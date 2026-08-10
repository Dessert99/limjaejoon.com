import { isAdmin } from '@/lib/auth/isAdmin';
import { type SessionClaims } from '@/lib/auth/session';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

/** 어드민 보호 구역 — proxy 는 UX 용 optimistic redirect 고, 화면 접근은 여기서 집행한다 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const client = await createSupabaseServerClient();
  // getClaims 가 아니라 getUser 다 — 캐시된 JWT 는 role 회수 뒤에도 만료 전까지 옛 값을 답한다
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    redirect('/admin/login');
  }

  const claims: SessionClaims = {
    sub: data.user.id,
    app_metadata: data.user.app_metadata?.role
      ? { role: data.user.app_metadata.role }
      : undefined,
  };

  // 로그인은 했는데 권한이 없는 상태다 — 로그인 화면으로 돌려보내면 무한 왕복이 된다
  if (!isAdmin(claims)) {
    return (
      <div
        data-surface='light'
        className='flex min-h-svh flex-col justify-center bg-background text-foreground'>
        <div className='mx-auto max-w-content px-gutter'>
          <h1 className='text-statement'>권한이 없다</h1>
          <p className='mt-4 text-body-lg text-muted-foreground'>
            이 계정에는 운영자 권한이 없다.
          </p>
        </div>
      </div>
    );
  }

  // 어드민 화면은 전부 밝게 뒤집는다 — 페이지마다 다시 걸지 않는다
  return (
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background text-foreground'>
      {children}
    </div>
  );
}
