'use client';

import Link from 'next/link';
import { useIsAdmin } from '@/lib/auth/useIsAdmin';
import { buttonVariants } from '@/components/ui/button';

export function PostAdminActions({ id }: { id: string }) {
  const admin = useIsAdmin();

  if (!admin) {
    return null;
  }

  return (
    <Link
      href={`/admin/posts/${id}`}
      className={buttonVariants({ variant: 'outline', size: 'sm' })}>
      수정
    </Link>
  );
}
