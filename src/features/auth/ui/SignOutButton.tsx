'use client';

/** 로그아웃 버튼 — 세션을 지우고 로그인 화면으로 되돌린다 */
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/shared/ui';
import { signOut } from '../api/signOut';

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <Button
      variant='outline'
      size='sm'
      disabled={pending}
      onClick={() => {
        setPending(true);
        void signOut().then(() => {
          // refresh 로 서버 컴포넌트까지 새 세션 상태로 다시 그린다
          router.replace('/blog');
          router.refresh();
        });
      }}>
      로그아웃
    </Button>
  );
}
