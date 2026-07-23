/** proxy 전용 Supabase 세션 클라이언트 — next/headers 대신 request/response 쿠키에 바인딩한다 */
import { readPublicEnv } from '@/shared/config';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import type { Database } from './database.types';

/** 세션 갱신 쿠키를 request(다운스트림)·response(브라우저) 양쪽에 써야 유실되지 않는다 */
export const createSupabaseProxyClient = (
  request: NextRequest,
  response: NextResponse
) => {
  const env = readPublicEnv();

  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
};
