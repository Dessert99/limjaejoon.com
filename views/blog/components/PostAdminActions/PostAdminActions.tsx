'use client';

import Link from 'next/link';
import { useIsAdmin } from '@/lib/auth/useIsAdmin';
import { buttonVariants } from '@/views/blog/components/ui/button';

/** 글 상세의 수정 버튼. 관리자가 아니면 아무것도 그리지 않는다. */
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
