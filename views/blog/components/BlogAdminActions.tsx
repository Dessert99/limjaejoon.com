'use client';

import Link from 'next/link';
import { useIsAdmin } from '@/lib/auth/useIsAdmin';
import { SignOutButton } from './SignOutButton';
import { buttonVariants } from '@/views/blog/components/ui/button';

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
