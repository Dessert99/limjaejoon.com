// access_token 쿠키 검증 가드 — Nest 7단계 파이프라인의 'Guards' 단계에서 컨트롤러보다 먼저 실행, 통과 못 하면 컨트롤러는 호출조차 안 됨
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// JwtService.verify가 풀어주는 페이로드 — sub 클레임이 userId, 그 외 클레임은 사용 안 함
interface JwtPayload {
  sub: string;
}

// CanActivate 인터페이스 — Nest가 가드라고 인식하기 위한 계약. canActivate가 boolean 반환하면 통과, throw하면 예외 응답
@Injectable()
export class JwtAuthGuard implements CanActivate {
  // DI — JwtModule이 export한 JwtService와 전역 ConfigService를 자동 주입
  constructor(
    private readonly jwtService: JwtService,
    private readonly cs: ConfigService
  ) {}

  // canActivate(ctx) — ctx에서 req를 꺼내 access_token 쿠키를 검증, 통과 시 req.user에 payload 부착 후 true
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    // 토큰 위치는 httpOnly 쿠키 한 곳으로 고정 — Authorization 헤더 허용 시 XSS로 토큰을 헤더에 직접 실어 보내는 우회 경로가 생김
    const token: string | undefined = req.cookies?.['access_token'];
    // 쿠키 자체가 없으면 미인증 — 인터셉터가 401을 받아 refresh 트리거하도록 던진다
    if (!token) {
      throw new UnauthorizedException('No access token');
    }

    try {
      // JwtService.verify — 서명·만료를 한 번에 검증. 실패 시 JsonWebTokenError/TokenExpiredError throw → 아래 catch로 잡힘
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.cs.get<string>('JWT_ACCESS_SECRET'),
      });
      // req.user 부착 — 이후 컨트롤러나 @CurrentUser 데코레이터가 이 자리에서 userId를 꺼낸다
      (req as Request & { user: JwtPayload }).user = payload;
      return true;
    } catch {
      // 만료/위조/시크릿 불일치 모두 동일 메시지로 응답 — 내부 실패 원인을 클라에 노출하면 공격 단서가 됨
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
