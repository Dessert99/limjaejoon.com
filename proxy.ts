import { isAdmin } from '@/lib/auth/isAdmin';
import { getSessionClaims } from '@/lib/auth/session';
import { readPublicEnv } from '@/config/env';
import type { Database } from '@/lib/supabase/database.types';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { decideRedirect } from './proxyDecision';

// 어드민 주소만 거른다. 넓히면 공개 페이지마다 인증 왕복이 붙는다
export const config = { matcher: ['/admin/:path*'] };

/** 어드민 주소에 닿기 전에 세션을 확인하고, 갱신된 쿠키를 응답에 실어 보낸다. */
export async function proxy(request: NextRequest) {
  const env = readPublicEnv();
  let response = NextResponse.next({ request });

  const client = createServerClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      cookies: {
        getAll: () => {
          return request.cookies.getAll();
        },
        // 갱신된 토큰을 요청과 응답 양쪽에 심어야, 이번 요청도 새 세션으로 처리된다
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const claims = await getSessionClaims(client);
  const hasSession = claims !== null;
  const admin = isAdmin(claims);
  const target = decideRedirect(request.nextUrl.pathname, hasSession, admin);

  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    const redirectResponse = NextResponse.redirect(url);
    // 리다이렉트로 갈아타면서 방금 갱신한 쿠키를 흘리면 다음 요청에 다시 로그아웃된다
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return response;
}
