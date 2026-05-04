// access JWT 검증 전략 — Passport가 access_token 쿠키에서 토큰을 추출 → JWT_ACCESS_SECRET으로 서명·만료 검증 → validate()의 반환값을 req.user에 부착
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

// JWT payload — sub 클레임에 userId만 담음
interface AccessTokenPayload {
  sub: string;
}

// PassportStrategy(Strategy, 'jwt') — Passport에 'jwt'라는 이름으로 등록. AuthGuard('jwt')가 이 이름으로 strategy를 찾는다
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(cs: ConfigService) {
    super({
      // 토큰 추출 위치 — httpOnly 쿠키 한 곳으로 고정. Authorization 헤더는 사용하지 않음
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.['access_token'] ?? null,
      ]),
      // 서명·만료 검증 시크릿 — env 미설정이면 부팅 시 throw로 즉시 실패
      secretOrKey: cs.getOrThrow<string>('JWT_ACCESS_SECRET'),
      // 만료 검증 활성화 — 만료된 access는 자동으로 401
      ignoreExpiration: false,
    });
  }

  // validate(payload) — 서명·만료 검증 통과 후 호출. 반환값이 req.user가 됨, throw하면 401
  validate(payload: AccessTokenPayload) {
    return { sub: payload.sub };
  }
}
