'use client';

import { Button } from '@/components/ui/button';
import { useSignIn } from '../../lib/useSignIn';

const FIELD_CLASS =
  'text-body w-full rounded-md border border-border bg-card px-4 py-2 text-foreground';

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
          className='text-body-sm text-muted-foreground'>
          이메일
        </label>
        <input
          id='admin-email'
          type='email'
          autoComplete='username'
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          className={FIELD_CLASS}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label
          htmlFor='admin-password'
          className='text-body-sm text-muted-foreground'>
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
          className={FIELD_CLASS}
        />
      </div>

      {error ? (
        <p
          role='alert'
          className='text-body-sm text-destructive'>
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
