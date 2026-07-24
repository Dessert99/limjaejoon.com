/** Next 16 proxy — 세션 쿠키를 갱신하고 비로그인/역할에 따라 optimistic redirect 한다 */
import { getSessionClaims, isAdmin } from '@/entities/session';
import { readPublicEnv } from '@/shared/config';
import type { Database } from '@/shared/api';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { decideRedirect } from './proxyDecision';

/** /admin 하위만 처리한다 */
export const config = { matcher: ['/admin/:path*'] };

/** 세션을 갱신하고 인증·권한 상태에 따라 optimistic redirect 한다 */
export async function proxy(request: NextRequest) {
  const env = readPublicEnv();
  // setAll 이 request 를 갱신할 때마다 response 를 다시 만들어야 다운스트림 Server Component 도 새 쿠키를 본다
  let response = NextResponse.next({ request });

  // proxy 는 next/headers cookies() 를 못 써서, NextRequest 에서 직접 쿠키를 읽고 쓰는 전용 client 를 만든다 (server.ts 와 분리된 이유)
  const client = createServerClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      cookies: {
        // 요청에 실려온 쿠키를 client 에 읽혀 세션 상태를 복원한다
        getAll: () => {
          return request.cookies.getAll();
        },
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          // 갱신된 request 를 반영해 response 를 재생성(그냥 response.cookies.set 만 하면 다운스트림엔 안 전달됨)
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // claims 는 optimistic redirect 판단용일 뿐 — 진짜 인가는 (protected) layout 과 RLS 가 집행하므로 여기선 UX 를 위한 빠른 분기만 한다
  const claims = await getSessionClaims(client);
  const hasSession = claims !== null;
  const admin = isAdmin(claims);
  const target = decideRedirect(request.nextUrl.pathname, hasSession, admin);

  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    const redirectResponse = NextResponse.redirect(url);
    // 갱신 쿠키를 redirect 응답에도 복사(누락 방지)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  // redirect 대상이 없으면(정상 접근) 갱신된 세션 쿠키를 실은 채 요청을 그대로 통과시킨다
  return response;
}
