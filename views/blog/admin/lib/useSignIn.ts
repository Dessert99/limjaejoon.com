'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth/signIn';

/** 관리자 로그인 폼 상태. 성공하면 블로그로 보낸다. */
export const useSignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async () => {
    setPending(true);
    setError(null);

    const result = await signIn({ email, password });

    setPending(false);

    // 실패해도 입력값은 남겨야 오타 한 글자만 고쳐 다시 넣을 수 있다
    if (result.error) {
      setError(result.error);
      return;
    }

    router.push('/blog');
  };

  return { email, setEmail, password, setPassword, error, pending, submit };
};
