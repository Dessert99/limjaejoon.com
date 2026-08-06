'use client';

/** 목록의 운영자 액션 — 새 글과 로그아웃. 감추는 건 편의일 뿐 인가는 API 가드와 RLS 가 한다 */
import { SignOutButton, useIsAdmin } from '@/features/auth';
import { Button } from '@/shared/ui';

export function BlogAdminActions() {
  const admin = useIsAdmin();

  if (!admin) {
    return null;
  }

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Button
        href='/admin/posts/new'
        size='sm'>
        새 글
      </Button>
      <SignOutButton />
    </div>
  );
}
