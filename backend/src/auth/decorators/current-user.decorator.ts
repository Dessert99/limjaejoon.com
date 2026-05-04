// 컨트롤러 핸들러에 인증된 userId만 안전하게 주입하는 파라미터 데코레이터 — IDOR 방어 핵심(req.body나 path가 아닌 토큰에서만 userId를 읽음)
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// JwtAuthGuard가 verify 후 req.user에 부착하는 payload 형태 — sub 클레임 = userId
interface JwtPayload {
  sub: string;
}

// createParamDecorator — 핸들러 매개변수에 붙는 커스텀 데코레이터를 만든다. 콜백이 (data, ctx) → 매개변수 값을 반환
// 사용 예: getMy(@CurrentUser() userId: string) — userId 한 줄로 추출
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    // ExecutionContext.switchToHttp() — Nest는 HTTP/WebSocket/RPC를 추상화해 다루므로 명시적으로 HTTP 컨텍스트로 좁힌다
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    // req.user가 비어 있으면 가드 누락 — 라우트에 @UseGuards(JwtAuthGuard) 빠뜨린 개발자 실수를 부팅 후 첫 요청에서 즉시 노출
    if (!req.user?.sub) {
      throw new Error('CurrentUser used without JwtAuthGuard');
    }
    return req.user.sub;
  }
);
