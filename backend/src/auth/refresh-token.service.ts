import * as crypto from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

// issue() 반환 타입 — 호출자(auth.service)가 쿠키에 실어 보낼 값 + userId 포함
export interface IssuedToken {
  raw: string; // 클라이언트 쿠키에 넣을 opaque 토큰 (256bit base64url)
  expiresAt: Date; // 만료 시각 — 프론트 사전 refresh 계산용
  familyId: string; // 같은 로그인 세션 묶음 — 재사용 감지 시 family 단위 폐기
  userId: string; // rotate() 가 auth.service.refresh() 에서 사용자 조회에 필요
}

// raw 토큰(256bit) → sha-256 hex 64자 — DB에는 절대 raw를 저장하지 않는다
function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// refresh_tokens 테이블의 발급·회전·폐기 로직 — atomic UPDATE로 race condition 방지
@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly rtRepo: Repository<RefreshToken>,
    private readonly cs: ConfigService
  ) {}

  // 새 refresh 토큰을 발급하고 DB에 삽입 — familyId 미제공 시 새 family 시작(로그인)
  async issue(userId: string, familyId?: string): Promise<IssuedToken> {
    const raw = crypto.randomBytes(32).toString('base64url'); // 256bit 균등 랜덤 — Math.random 금지
    const tokenHash = hashToken(raw);
    const newFamilyId = familyId ?? crypto.randomUUID(); // 기존 family 이어가거나 새로 시작 (Node 내장 randomUUID)

    // refresh TTL 문자열(예: "7d")을 밀리초로 변환
    const ttlStr = this.cs.get<string>('JWT_REFRESH_TTL') ?? '7d';
    const expiresAt = parseTtlToDate(ttlStr);

    await this.rtRepo.save(
      this.rtRepo.create({
        userId,
        familyId: newFamilyId,
        tokenHash,
        expiresAt,
      })
    );

    return { raw, expiresAt, familyId: newFamilyId, userId };
  }

  // atomic 회전 — UPDATE WHERE revokedAt IS NULL 이 0행이면 재사용 감지 분기
  async rotate(rawIncoming: string): Promise<IssuedToken> {
    const hash = hashToken(rawIncoming);

    // 단일 atomic UPDATE — 두 클라이언트가 동시에 같은 raw를 보내도 1번만 성공한다
    const updateResult = await this.rtRepo
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revokedAt: () => 'NOW()' })
      .where('"tokenHash" = :hash AND "revokedAt" IS NULL', { hash })
      .returning(['id', 'familyId', 'userId', 'expiresAt', 'revokedAt'])
      .execute();

    if (updateResult.affected === 0) {
      // 0행 = 이미 폐기됐거나 존재하지 않는 토큰
      const existing = await this.rtRepo.findOne({
        where: { tokenHash: hash },
      });

      if (existing) {
        // 존재하지만 이미 revokedAt이 있다 → 재사용 감지 — 같은 family 전체 폐기 + 401
        await this.rtRepo
          .createQueryBuilder()
          .update(RefreshToken)
          .set({ revokedAt: () => 'NOW()' })
          .where('"familyId" = :familyId AND "revokedAt" IS NULL', {
            familyId: existing.familyId,
          })
          .execute();
        throw new UnauthorizedException('Refresh token reuse detected');
      }

      // 아예 존재하지 않는 hash
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 1행 성공 — 반환된 raw 객체에서 정보 추출
    const rotated = updateResult.raw[0] as RefreshToken;

    // 만료된 토큰은 회전 거부
    if (rotated.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // 같은 family로 새 토큰 발급 — 회전 완료
    return this.issue(rotated.userId, rotated.familyId);
  }

  // 단일 토큰만 폐기 — 로그아웃. 다른 디바이스 family에 영향 없음
  async revoke(rawIncoming: string): Promise<void> {
    const hash = hashToken(rawIncoming);

    // 이미 폐기된 토큰이라도 에러를 던지지 않는다 — 로그아웃은 멱등 동작
    await this.rtRepo
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revokedAt: () => 'NOW()' })
      .where('"tokenHash" = :hash AND "revokedAt" IS NULL', { hash })
      .execute();
  }
}

// "15m", "7d" 형식의 TTL 문자열을 현재 시각 기준 Date로 변환
function parseTtlToDate(ttl: string): Date {
  const unit = ttl.slice(-1); // 마지막 문자가 단위
  const value = parseInt(ttl.slice(0, -1), 10);
  const msMap: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  const ms = (msMap[unit] ?? 1000) * value;
  return new Date(Date.now() + ms);
}
