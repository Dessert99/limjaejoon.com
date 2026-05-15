// refresh JWT 검증 전략 — refresh_token 쿠키에서 추출 → JWT_REFRESH_SECRET으로 서명·만료 검증 → validate()에서 jti가 DB에 살아있는지 확인 후 req.user에 부착
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RefreshTokenService } from '../refresh-token.service';

// refresh JWT payload — sub(userId) + jti(DB 행 식별자), jti가 폐기 추적에 사용
interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

// 'jwt-refresh' 이름으로 등록 — RefreshTokenGuard(extends AuthGuard('jwt-refresh'))가 이 이름으로 strategy를 찾는다
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  // RefreshTokenService를 주입해 validate에서 jti가 폐기됐는지 DB 조회
  constructor(
    cs: ConfigService,
    private readonly rtService: RefreshTokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.['refresh_token'] ?? null,
      ]),
      // refresh 전용 시크릿 — access와 다른 키여야 한쪽이 유출돼도 다른 쪽으로 위조 불가
      secretOrKey: cs.getOrThrow<string>('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
    });
  }

  // validate(payload) — JWT 서명·만료 OK 후 jti가 DB에서 활성 상태인지 추가 검증. revoke된 토큰을 거부하기 위한 stateful 체크
  async validate(payload: RefreshTokenPayload) {
    // assertActive는 폐기·만료·미존재 시 UnauthorizedException throw — Passport가 그대로 401로 응답
    await this.rtService.assertActive(payload.jti);
    return { sub: payload.sub, jti: payload.jti };
  }
}
