/** admin 보호 구역 레이아웃 — 서버에서 admin 을 재확인하는 보조 가드(1차 방어는 proxy) */
import { getSessionClaims, isAdmin } from '@/entities/session';
import { SignOutButton } from '@/features/auth';
import { createSupabaseServerClient } from '@/shared/api';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

/** 비로그인은 로그인으로 보내고, 로그인했지만 비admin 은 403 문구만 보여준다(서버 컴포넌트라 signOut 불가) */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const client = await createSupabaseServerClient();
  const claims = await getSessionClaims(client);

  if (!claims) {
    redirect('/admin/login');
  }

  if (!isAdmin(claims)) {
    return <main>403 — 접근 권한이 없습니다.</main>;
  }

  return (
    <div>
      <header>
        <SignOutButton />
      </header>
      {children}
    </div>
  );
}
