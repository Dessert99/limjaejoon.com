import { isAdmin } from '@/lib/auth/isAdmin';
import { type SessionClaims } from '@/lib/auth/session';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const client = await createSupabaseServerClient();
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

  return (
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background text-foreground'>
      {children}
    </div>
  );
}
