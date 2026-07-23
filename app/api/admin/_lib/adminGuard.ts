/** admin Route Handler 공용 가드 — 세션 클라이언트로 Origin·admin 을 재검증하고 에러를 상태로 매핑한다 */
import { getSessionClaims, isAdmin } from '@/entities/session';
import { createSupabaseServerClient } from '@/shared/api';
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
  try {
    return new URL(origin).host === new URL(request.url).host;
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
  const claims = await getSessionClaims(client);

  if (!claims) {
    return {
      client: null,
      error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }

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

  // 23505=unique_violation, 42501=insufficient_privilege(RLS 거부)
  if (code === '23505') {
    return NextResponse.json({ message: 'Conflict' }, { status: 409 });
  }
  if (code === '42501') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
};
