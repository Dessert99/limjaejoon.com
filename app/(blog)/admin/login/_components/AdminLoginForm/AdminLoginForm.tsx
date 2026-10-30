'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth/signIn';

/** 관리자 로그인 폼 상태. 성공하면 블로그로 보낸다. */
const useSignIn = () => {
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

    router.push('/library');
  };

  return { email, setEmail, password, setPassword, error, pending, submit };
};

/** 관리자 로그인 폼. 이메일·비밀번호만 받고 나머지는 Supabase가 맡는다. */
export function AdminLoginForm() {
  const { email, setEmail, password, setPassword, error, pending, submit } =
    useSignIn();

  return (
    <form
      className='mt-8 flex flex-col gap-4'
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}>
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='admin-email'
          className='text-sm text-blog-muted-foreground'>
          이메일
        </label>
        <input
          id='admin-email'
          type='email'
          // 비밀번호 관리자가 계정을 알아보게 하는 값이라 email이 아니라 username이다
          autoComplete='username'
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          className='w-full rounded-lg border border-blog-border bg-blog-card px-4 py-2 text-base text-blog-foreground'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label
          htmlFor='admin-password'
          className='text-sm text-blog-muted-foreground'>
          비밀번호
        </label>
        <input
          id='admin-password'
          type='password'
          autoComplete='current-password'
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          className='w-full rounded-lg border border-blog-border bg-blog-card px-4 py-2 text-base text-blog-foreground'
        />
      </div>

      {error ? (
        <p
          role='alert'
          className='text-sm text-blog-destructive'>
          {error}
        </p>
      ) : null}

      <Button
        type='submit'
        disabled={pending}
        className='mt-2'>
        {pending ? '확인 중…' : '로그인'}
      </Button>
    </form>
  );
}
