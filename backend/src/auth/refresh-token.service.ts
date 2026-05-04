// refresh_tokens 테이블의 발급·회전·폐기 전담 — AuthService가 access JWT를 만들 때 짝으로 호출, 토큰의 raw 값은 DB에 저장하지 않고 sha256 해시만 보관
import * as crypto from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

// 발급 결과 — raw는 쿠키로(평문 1회만 클라에 노출), expiresAt은 프론트가 만료 계산에 사용, userId는 회전 시 재조회용
export interface IssuedToken {
  raw: string;
  expiresAt: Date;
  userId: string;
}

// raw 256bit → sha-256 hex 64자. DB 유출 시에도 raw가 없으면 토큰으로 사용 불가
function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

@Injectable()
export class RefreshTokenService {
  // @InjectRepository(RefreshToken) — TypeOrmModule.forFeature가 만들어둔 Repository<RefreshToken>를 컨테이너에서 꺼내 주입
  constructor(
    @InjectRepository(RefreshToken)
    private readonly rtRepo: Repository<RefreshToken>,
    private readonly cs: ConfigService
  ) {}

  // issue(userId) — 256bit 랜덤 raw 생성 → 해시 저장 → 컨트롤러가 쿠키에 실을 raw + expiresAt 반환
  async issue(userId: string): Promise<IssuedToken> {
    // crypto.randomBytes(32) — 추측 불가 256bit 랜덤. Math.random은 PRNG라 절대 금지
    const raw = crypto.randomBytes(32).toString('base64url');
    const tokenHash = hashToken(raw);
    const ttlStr = this.cs.get<string>('JWT_REFRESH_TTL') ?? '1d';
    const expiresAt = parseTtlToDate(ttlStr);

    // create + save 2단계 — create는 메모리 인스턴스만 만들고 INSERT는 save에서 발생. 한 줄로 하면 lifecycle 훅이 안 걸리는 케이스 있음
    await this.rtRepo.save(
      this.rtRepo.create({ userId, tokenHash, expiresAt })
    );

    return { raw, expiresAt, userId };
  }

  // rotate(rawIncoming) — 기존 row 검증 → revokedAt 세팅 → issue(userId)로 새 raw 발급. 1회 사용 보장으로 토큰 도난 시간을 단축
  async rotate(rawIncoming: string): Promise<IssuedToken> {
    const tokenHash = hashToken(rawIncoming);
    const row = await this.rtRepo.findOne({ where: { tokenHash } });

    // 미존재·이미 폐기된 토큰 둘 다 동일 응답 — 클라가 어느 케이스인지 알 필요 없음
    if (!row || row.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // 만료 시간이 지난 토큰 — 폐기 처리 안 했어도 거부
    if (row.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // revokedAt 세팅 → save → 같은 userId로 issue. row 객체를 그대로 mutate해서 save하는 패턴(TypeORM 활성 레코드 스타일)
    row.revokedAt = new Date();
    await this.rtRepo.save(row);
    return this.issue(row.userId);
  }

  // revoke(rawIncoming) — 로그아웃 시 호출. 행 없거나 이미 폐기됐어도 throw 없음(멱등 — 같은 요청을 두 번 보내도 결과 동일)
  async revoke(rawIncoming: string): Promise<void> {
    const tokenHash = hashToken(rawIncoming);
    const row = await this.rtRepo.findOne({ where: { tokenHash } });
    // 살아있는 토큰만 polish — 미존재나 이미 폐기는 그냥 통과
    if (row && !row.revokedAt) {
      row.revokedAt = new Date();
      await this.rtRepo.save(row);
    }
  }
}

// "15m"·"1d" 형식 TTL 문자열을 현재 시각 기준 Date로 변환 — env.validation의 Joi 패턴이 형식을 사전 보장하지만 한 번 더 방어적으로 검증
const TTL_RE = /^(\d+)([smhd])$/;
const TTL_UNIT_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

function parseTtlToDate(ttl: string): Date {
  const match = TTL_RE.exec(ttl);
  // Joi가 통과시킨 후라 도달 가능성은 낮지만 — 실수로 dataSource.ts나 mock에서 잘못된 값을 넣으면 silent NaN 대신 즉시 명시적 에러
  if (!match) {
    throw new Error(`Invalid TTL format: "${ttl}"`);
  }
  const ms = TTL_UNIT_MS[match[2]] * parseInt(match[1], 10);
  return new Date(Date.now() + ms);
}
