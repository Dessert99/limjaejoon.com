'use client';

/** 글 상세의 운영자 액션 — 수정으로 보낸다(삭제는 에디터가 갖는다) */
import Link from 'next/link';
import { useIsAdmin } from '@/features/auth';
import { buttonVariants } from '@/shared/ui';

export function PostAdminActions({ id }: { id: string }) {
  const admin = useIsAdmin();

  // 서버 렌더에서는 늘 false 라, 정적 HTML 한 벌이 로그인 여부와 무관하게 유지된다
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
