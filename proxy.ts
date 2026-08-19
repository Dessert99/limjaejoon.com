import { isAdmin } from '@/lib/auth/isAdmin';
import { getSessionClaims } from '@/lib/auth/session';
import { readPublicEnv } from '@/config/env';
import type { Database } from '@/lib/supabase/database.types';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { decideRedirect } from './proxyDecision';

export const config = { matcher: ['/admin/:path*'] };

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
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return response;
}
