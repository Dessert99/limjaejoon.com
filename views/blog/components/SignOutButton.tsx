'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth/signOut';

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
          router.refresh();
        });
      }}>
      로그아웃
    </Button>
  );
}
