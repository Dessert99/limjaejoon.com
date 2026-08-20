import { isAdmin } from '@/lib/auth/isAdmin';
import { type SessionClaims } from '@/lib/auth/session';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type RequireAdminResult =
  | {
      client: Awaited<ReturnType<typeof createSupabaseServerClient>>;
      error: null;
    }
  | { client: null; error: NextResponse };

/** 다른 사이트가 로그인 쿠키를 빌려 쓰기 요청을 보내는 걸 막는 CSRF 방어다. */
const isSameOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin');
  // Origin이 없으면 판단할 근거가 없다. 통과가 아니라 거절이 안전한 쪽이다
  if (!origin) {
    return false;
  }
  // 프록시 뒤에서는 host가 내부 주소라, 실제로 사용자가 친 주소는 x-forwarded-host에 있다
  const forwardedHost =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === forwardedHost;
  } catch {
    return false;
  }
};

/** 관리자 쓰기 요청의 관문. 통과하면 클라이언트를, 막히면 그대로 돌려줄 응답을 준다. */
export const requireAdmin = async (
  request: Request
): Promise<RequireAdminResult> => {
  // 브라우저가 GET에는 Origin을 안 붙인다. 읽기는 CSRF로 바뀌는 게 없어 검사에서 뺀다
  const writes = request.method !== 'GET' && request.method !== 'HEAD';

  if (writes && !isSameOrigin(request)) {
    return {
      client: null,
      error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    };
  }

  const client = await createSupabaseServerClient();
  // getUser는 인증 서버에 토큰을 확인시킨다. 쿠키만 읽는 getSession은 위조를 못 거른다
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

/** DB 오류를 응답으로 옮긴다. 원인 문구는 감추고 상태 코드로만 알린다. */
export const mapWriteError = (error: unknown): NextResponse => {
  const code = (error as { code?: string })?.code;

  // 유니크 위반. 같은 주소나 같은 태그 이름이 이미 있다
  if (code === '23505') {
    return NextResponse.json({ message: 'Conflict' }, { status: 409 });
  }
  // 외래키 위반. 글이 붙은 태그를 지우려 했거나 없는 태그를 걸려 했다
  if (code === '23503') {
    return NextResponse.json({ message: 'Conflict' }, { status: 409 });
  }
  // 관문을 통과했는데 RLS가 막았다면 정책과 역할이 어긋난 것이라 로그를 남긴다
  if (code === '42501') {
    console.error('admin RLS denial after guard passed', error);
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
};
