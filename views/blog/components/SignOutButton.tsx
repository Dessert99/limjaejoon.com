'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/views/blog/components/ui/button';
import { signOut } from '@/lib/auth/signOut';

/** 로그아웃 버튼. 나간 뒤 목록으로 보내고 서버 컴포넌트까지 다시 읽힌다. */
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
          router.replace('/blog');
          // replace만으로는 캐시된 관리자 화면이 남아서 서버에서 다시 받아온다
          router.refresh();
        });
      }}>
      로그아웃
    </Button>
  );
}
