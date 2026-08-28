'use client';

import Link from 'next/link';
import { useIsAdmin } from '@/lib/auth/useIsAdmin';
import { SignOutButton } from './SignOutButton';
import { buttonVariants } from '@/views/blog/components/ui/button';

/** 목록 위 관리자 전용 버튼. 관리자가 아니면 아무것도 그리지 않는다. */
export function BlogAdminActions() {
  const admin = useIsAdmin();

  if (!admin) {
    return null;
  }

  return (
    <div className='mb-8 flex flex-wrap items-center justify-end gap-3'>
      <Link
        href='/admin/posts/new'
        className={buttonVariants({ size: 'sm' })}>
        새 글
      </Link>
      <SignOutButton />
    </div>
  );
}
