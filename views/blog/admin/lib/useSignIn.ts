'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth/signIn';

const ADMIN_HOME = '/blog';

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

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(ADMIN_HOME);
  };

  return { email, setEmail, password, setPassword, error, pending, submit };
};
