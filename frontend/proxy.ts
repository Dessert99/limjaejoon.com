// 보호 layout이 currentPath를 알 수 있도록 x-pathname 헤더만 세팅
// 권한 검증의 source of truth는 (protected)/layout.tsx의 verifySession (Next.js 공식 권장 — Authentication Layouts 패턴)
// proxy.ts는 ambiguous 신호(쿠키 존재)로 결론 내지 않는다 — 좀비 쿠키 루프 방지
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest): NextResponse {
  const res = NextResponse.next();
  res.headers.set('x-pathname', request.nextUrl.pathname);
  return res;
}

export const config = {
  // 보호 라우트만 매칭 — layout이 verifySession에 currentPath 넘기기 위해 헤더 필요
  // /login·/signup은 빠짐 (proxy가 결정 안 함, 페이지 자체에서 처리)
  matcher: ['/me', '/me/:path*', '/tour', '/tour/:path*'],
};
