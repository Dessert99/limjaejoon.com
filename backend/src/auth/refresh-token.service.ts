// refresh JWT 발급·회전·폐기 — JWT 서명은 JwtService가, DB 영속화는 Repository가 담당. RefreshTokenStrategy.validate가 jti로 활성 검증을 위해 assertActive를 호출
import * as crypto from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

// 발급 결과 — raw는 쿠키로(서명된 JWT 문자열), expiresAt은 프론트 만료 계산용, jti는 회전 시 인자
export interface IssuedToken {
  raw: string;
  expiresAt: Date;
  userId: string;
  jti: string;
}

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly rtRepo: Repository<RefreshToken>,
    private readonly cs: ConfigService,
    private readonly jwt: JwtService
  ) {}

  // issue(userId) — 새 jti(UUID) 생성 → DB INSERT → {sub, jti}로 JWT 서명 → 클라가 쿠키로 받을 raw JWT 문자열 반환
  async issue(userId: string): Promise<IssuedToken> {
    // crypto.randomUUID() — Node 표준 v4 UUID. 추측 불가능하고 예측 어려운 jti가 폐기 추적의 키
    const jti = crypto.randomUUID();
    const ttlStr = this.cs.get<string>('JWT_REFRESH_TTL') ?? '1d';
    const expiresAt = parseTtlToDate(ttlStr);

    // DB 행 INSERT 먼저 — JWT 서명 후 INSERT가 실패하면 발급된 토큰이 DB에 없는 좀비 상태 발생, 순서를 INSERT → sign으로 고정
    await this.rtRepo.save(this.rtRepo.create({ userId, jti, expiresAt }));

    // JwtService.sign({sub, jti}, {secret, expiresIn}) — refresh 전용 시크릿으로 서명, expiresIn은 ms 라이브러리의 StringValue 타입 단언 필요
    const expiresIn = ttlStr as JwtSignOptions['expiresIn'];
    const raw = this.jwt.sign(
      { sub: userId, jti },
      {
        secret: this.cs.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn,
      }
    );

    return { raw, expiresAt, userId, jti };
  }

  // assertActive(jti) — RefreshTokenStrategy.validate가 호출. JWT 서명·만료가 유효해도 DB에서 폐기되지 않았는지 추가 검증(stateful revocation)
  async assertActive(jti: string): Promise<void> {
    const row = await this.rtRepo.findOne({ where: { jti } });
    // 미존재(jti 위조) 또는 폐기됨 — 동일 응답
    if (!row || row.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // 만료 — JWT exp가 통과했어도 DB의 expiresAt으로 한 번 더 검증(시계 어긋남 방어)
    if (row.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }
  }

  // rotate(jti, userId) — RefreshTokenStrategy 통과 후 호출. 기존 jti를 폐기하고 같은 사용자에게 새 토큰 발급
  async rotate(jti: string, userId: string): Promise<IssuedToken> {
    const row = await this.rtRepo.findOne({ where: { jti } });
    // strategy에서 이미 통과했지만 race condition으로 그 사이 폐기됐을 수 있어 한 번 더 확인
    if (!row || row.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    row.revokedAt = new Date();
    await this.rtRepo.save(row);
    return this.issue(userId);
  }

  // revoke(jti) — 로그아웃 시 호출. 미존재·이미 폐기 모두 throw 없음(멱등)
  async revoke(jti: string): Promise<void> {
    const row = await this.rtRepo.findOne({ where: { jti } });
    if (row && !row.revokedAt) {
      row.revokedAt = new Date();
      await this.rtRepo.save(row);
    }
  }
}

// "15m"·"1d" → 미래 Date 변환. env.validation의 Joi 패턴이 형식을 사전 보장하지만 한 번 더 방어
const TTL_RE = /^(\d+)([smhd])$/;
const TTL_UNIT_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

function parseTtlToDate(ttl: string): Date {
  const match = TTL_RE.exec(ttl);
  if (!match) {
    throw new Error(`Invalid TTL format: "${ttl}"`);
  }
  const ms = TTL_UNIT_MS[match[2]] * parseInt(match[1], 10);
  return new Date(Date.now() + ms);
}
