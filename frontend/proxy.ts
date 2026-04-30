// 보호 경로 프록시 — Next.js 16부터 middleware.ts → proxy.ts 로 명명 규칙 변경 (ADR 0005)
// 1차 게이트로 쿠키 존재 여부만 확인. 실제 토큰 유효성 검증은 Server Component(verifySession)가 담당
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 인증된 사용자가 진입하면 /me로 보낼 인증 페이지들 — 로그인된 채로 폼 보는 어색함 차단
const AUTH_ROUTES = ['/login', '/signup'];

/**
 * - 보호 페이지 + 토큰 0개 → /login?returnTo=...
 * - 인증 페이지 + 토큰 보유 → /me (이미 로그인된 사용자에게 폼 미노출)
 * - 그 외 → 통과 (실제 토큰 검증은 SC verifySession이 /auth/me 호출로 수행)
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // 쿠키 존재 여부 — access_token OR refresh_token (만료된 access도 refresh로 살릴 수 있어 OR)
  const hasToken =
    request.cookies.has('access_token') || request.cookies.has('refresh_token');

  // 현재 경로가 인증 페이지(/login, /signup)인지 판단
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // 인증 페이지 + 토큰 보유 → /me로 보냄 (returnTo 무시 — 이미 로그인 상태이므로)
  if (isAuthRoute && hasToken) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = '/me';
    homeUrl.search = '';
    return NextResponse.redirect(homeUrl);
  }

  // 보호 페이지 + 토큰 0개 → /login으로 redirect (returnTo에 pathname + search 모두 보존)
  if (!isAuthRoute && !hasToken) {
    const loginUrl = request.nextUrl.clone();
    const fullPath = pathname + request.nextUrl.search;
    loginUrl.pathname = '/login';
    loginUrl.search = `returnTo=${encodeURIComponent(fullPath)}`;
    return NextResponse.redirect(loginUrl);
  }

  // 그 외(보호 페이지 + 토큰 있음 / 인증 페이지 + 토큰 없음) → 통과
  return NextResponse.next();
}

export const config = {
  // 보호 라우트 + 인증 라우트 매칭 — 정적 자산은 자동 제외
  matcher: ['/me', '/me/:path*', '/login', '/signup'],
};
