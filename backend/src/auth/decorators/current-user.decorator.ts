import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// JwtAuthGuard가 verify 후 req.user에 부착하는 payload 형태 — sub 클레임이 userId
interface JwtPayload {
  sub: string;
}

// 컨트롤러 핸들러에서 인증 컨텍스트의 userId만 꺼내 쓰도록 강제하는 파라미터 데코레이터
// IDOR 방어 핵심: path/body가 아닌 인증된 토큰에서만 userId를 받는다 (ADR 0003)
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    // JwtAuthGuard 통과 흐름에서만 호출되어야 하므로 여기 도달 시 가드 누락 — 안전망
    if (!req.user?.sub) {
      throw new Error('CurrentUser used without JwtAuthGuard');
    }
    return req.user.sub;
  }
);
