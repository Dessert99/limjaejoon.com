/** Next 16 proxy — 세션 쿠키를 갱신하고 비로그인/역할에 따라 optimistic redirect 한다 */
import { getSessionClaims, isAdmin } from '@/entities/session';
import { readPublicEnv } from '@/shared/config';
import type { Database } from '@/shared/api';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { decideRedirect } from './proxyDecision';

/** /admin 하위만 처리한다 */
export const config = { matcher: ['/admin/:path*'] };

export async function proxy(request: NextRequest) {
  const env = readPublicEnv();
  // setAll 이 request 를 갱신할 때마다 response 를 다시 만들어야 다운스트림 Server Component 도 새 쿠키를 본다
  let response = NextResponse.next({ request });

  const client = createServerClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      cookies: {
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

  const claims = await getSessionClaims(client);
  const target = decideRedirect(request.nextUrl.pathname, isAdmin(claims));

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

  return response;
}
