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

const isSameOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin');
  if (!origin) {
    return false;
  }
  const forwardedHost =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === forwardedHost;
  } catch {
    return false;
  }
};

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

export const mapWriteError = (error: unknown): NextResponse => {
  const code = (error as { code?: string })?.code;

  if (code === '23505') {
    return NextResponse.json({ message: 'Conflict' }, { status: 409 });
  }
  if (code === '23503') {
    return NextResponse.json({ message: 'Conflict' }, { status: 409 });
  }
  if (code === '42501') {
    console.error('admin RLS denial after guard passed', error);
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
};
