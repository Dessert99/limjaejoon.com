import * as crypto from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

// issue() 반환 타입 — 컨트롤러가 쿠키에 실어 보낼 raw + 프론트 만료 계산용 expiresAt + rotate 시 재조회용 userId
export interface IssuedToken {
  raw: string;
  expiresAt: Date;
  userId: string;
}

// raw 토큰 → sha-256 hex 64자 — DB에는 절대 raw를 저장하지 않는다
function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// refresh_tokens 발급·회전·폐기 — 학습용 최소 구조
@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly rtRepo: Repository<RefreshToken>,
    private readonly cs: ConfigService
  ) {}

  // 새 refresh 토큰 발급 — 256bit 랜덤을 sha256으로 해시해서 DB에 저장
  async issue(userId: string): Promise<IssuedToken> {
    const raw = crypto.randomBytes(32).toString('base64url');
    const tokenHash = hashToken(raw);
    const ttlStr = this.cs.get<string>('JWT_REFRESH_TTL') ?? '1d';
    const expiresAt = parseTtlToDate(ttlStr);

    await this.rtRepo.save(
      this.rtRepo.create({ userId, tokenHash, expiresAt })
    );

    return { raw, expiresAt, userId };
  }

  // 회전 — 기존 토큰 폐기 후 새 토큰 발급
  async rotate(rawIncoming: string): Promise<IssuedToken> {
    const tokenHash = hashToken(rawIncoming);
    const row = await this.rtRepo.findOne({ where: { tokenHash } });

    if (!row || row.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (row.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    row.revokedAt = new Date();
    await this.rtRepo.save(row);
    return this.issue(row.userId);
  }

  // 단일 토큰만 폐기 — 로그아웃. 이미 폐기된 토큰도 에러 없이 처리(멱등)
  async revoke(rawIncoming: string): Promise<void> {
    const tokenHash = hashToken(rawIncoming);
    const row = await this.rtRepo.findOne({ where: { tokenHash } });
    if (row && !row.revokedAt) {
      row.revokedAt = new Date();
      await this.rtRepo.save(row);
    }
  }
}

// "15m", "1d" 형식의 TTL 문자열을 현재 시각 기준 Date로 변환 — Joi 스키마가 형식을 보장
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
