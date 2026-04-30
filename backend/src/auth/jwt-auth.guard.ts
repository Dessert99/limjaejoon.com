import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// JWT payload 형태 — sub 클레임이 userId
interface JwtPayload {
  sub: string;
}

// access_token 쿠키를 검증하고 req.user 에 payload를 붙이는 가드 — passport 의존성 없음 (ADR 0002)
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cs: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    // httpOnly 쿠키에서 access 토큰 추출 — Authorization 헤더는 사용하지 않는다
    const token: string | undefined = req.cookies?.['access_token'];
    if (!token) {
      throw new UnauthorizedException('No access token');
    }

    try {
      // verify 는 만료·서명 불일치 모두 예외로 던진다
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.cs.get<string>('JWT_ACCESS_SECRET'),
      });
      // 컨트롤러에서 req.user.sub 으로 userId 접근
      (req as Request & { user: JwtPayload }).user = payload;
      return true;
    } catch {
      // JsonWebTokenError·TokenExpiredError 모두 동일 메시지 — 내부 힌트 미노출 (ADR 0002)
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
