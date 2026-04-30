// 보호 경로 프록시 — Next.js 16부터 middleware.ts → proxy.ts 로 명명 규칙 변경 (ADR 0005)
// 쿠키 존재 여부만 확인하고, 실제 토큰 유효성 검증은 Server Component(verifySession)가 담당
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * 쿠키 존재 여부로 1차 게이트 역할 수행.
 * access_token 또는 refresh_token 중 하나라도 있으면 통과 —
 * 만료된 access_token이 있어도 refresh 흐름이 살아있을 수 있으므로 OR 조건 사용.
 * 실제 만료·서명 검증은 verifySession.ts(SC)가 백엔드 /auth/me 호출로 처리.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // 쿠키 존재 여부 확인 — 하나라도 있으면 SC에서 세밀하게 검증
  const hasAccessToken = request.cookies.has('access_token');
  const hasRefreshToken = request.cookies.has('refresh_token');

  if (hasAccessToken || hasRefreshToken) {
    // 토큰이 있으면 SC(verifySession)에게 검증 위임
    return NextResponse.next();
  }

  // 둘 다 없으면 login으로 redirect — returnTo에 현재 경로 보존 (open redirect 방어는 safeReturnTo가 담당)
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.search = `returnTo=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // /me 경로만 적용 — 정적 자산(_next/static, _next/image, favicon 등) 제외
  matcher: ['/me', '/me/:path*'],
};
