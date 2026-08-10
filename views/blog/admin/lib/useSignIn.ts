'use client';

/** 로그인 폼 상태 훅 — 입력·에러·제출을 plain state 로 관리한다(RHF 미사용) */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth/signIn';

/** 로그인 성공 시 이동할 기본 목적지 — 블로그가 곧 관리 화면이다 */
const ADMIN_HOME = '/blog';

/** 이메일/비밀번호 입력과 제출, 에러 노출을 담당한다 */
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

    // 실패는 폼에 머무르고, 성공만 보호 구역으로 보낸다
    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(ADMIN_HOME);
  };

  return { email, setEmail, password, setPassword, error, pending, submit };
};
