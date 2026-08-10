/** admin Route Handler 공용 가드 — 세션 클라이언트로 Origin·admin 을 재검증하고 에러를 상태로 매핑한다 */
import { isAdmin } from '@/lib/auth/isAdmin';
import { type SessionClaims } from '@/lib/auth/session';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/** client 가 null 인지로 성공/실패를 가르는 판별 유니언 — 호출부에서 error 를 좁히면 client 도 좁혀진다 */
type RequireAdminResult =
  | {
      client: Awaited<ReturnType<typeof createSupabaseServerClient>>;
      error: null;
    }
  | { client: null; error: NextResponse };

/** 쿠키 인증은 CSRF 표면이 생기므로 Origin 이 요청 호스트와 같은지 확인한다 */
const isSameOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin');
  if (!origin) {
    return false;
  }
  // request.url 은 프록시 뒤에서 내부 호스트라 신뢰할 수 없어 forwarded host 와 비교한다
  const forwardedHost =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === forwardedHost;
  } catch {
    // malformed origin (e.g. 'null' or garbage) → reject as origin mismatch
    return false;
  }
};

/** 세션 클라이언트를 만들고 Origin·admin 을 검증한다. 실패 시 error 에 응답을 담는다 */
export const requireAdmin = async (
  request: Request
): Promise<RequireAdminResult> => {
  if (!isSameOrigin(request)) {
    return {
      client: null,
      error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    };
  }

  const client = await createSupabaseServerClient();
  // getClaims() 의 JWT 는 role 회수 후에도 만료 전까지 캐시값을 반환하므로, 변경 요청은 getUser() 로 Auth 서버의 현재 role 을 재확인한다
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return {
      client: null,
      error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }

  const claims: SessionClaims = {
    sub: data.user.id,
    app_metadata: data.user.app_metadata?.role
      ? { role: data.user.app_metadata.role }
      : undefined,
  };

  if (!isAdmin(claims)) {
    return {
      client: null,
      error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    };
  }

  return { client, error: null };
};

/** Postgres 에러 코드를 외부 상태로 정규화한다 (원문은 노출하지 않음) */
export const mapWriteError = (error: unknown): NextResponse => {
  const code = (error as { code?: string })?.code;

  // 23505=unique_violation, 23503=foreign_key_violation, 42501=insufficient_privilege(RLS 거부)
  if (code === '23505') {
    return NextResponse.json({ message: 'Conflict' }, { status: 409 });
  }
  // 연결된 글이 있는 태그를 지우는 정상적인 거부다 — 500 으로 두면 장애로 보인다
  if (code === '23503') {
    return NextResponse.json({ message: 'Conflict' }, { status: 409 });
  }
  if (code === '42501') {
    // guard 통과 후 RLS 거부 = stale JWT·정책 배포 이슈 신호이므로 내부 로그만 남기고 응답은 그대로 opaque 하게
    console.error('admin RLS denial after guard passed', error);
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
};
