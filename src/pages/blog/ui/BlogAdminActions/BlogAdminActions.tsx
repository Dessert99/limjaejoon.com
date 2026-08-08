'use client';

/** 목록의 운영자 액션 — 새 글과 로그아웃. 감추는 건 편의일 뿐 인가는 API 가드와 RLS 가 한다 */
import Link from 'next/link';
import { SignOutButton, useIsAdmin } from '@/features/auth';
import { buttonVariants } from '@/shared/ui';

export function BlogAdminActions() {
  const admin = useIsAdmin();

  // 서버 렌더에서는 늘 false 라, 정적 HTML 한 벌이 로그인 여부와 무관하게 유지된다
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
