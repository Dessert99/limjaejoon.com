'use client';

/** 어드민 로그인 — 여기는 입구일 뿐이고, 인가의 집행자는 (protected) layout 과 RLS 다 */
import { useSignIn } from '@/features/auth';
import { Button, Container } from '@/shared/ui';

const FIELD_CLASS =
  'text-body w-full rounded-md border border-border bg-surface px-4 py-2 text-foreground';

export function AdminLoginPage() {
  const { email, setEmail, password, setPassword, error, pending, submit } =
    useSignIn();

  return (
    <div
      data-surface='light'
      className='flex min-h-svh flex-col justify-center bg-background text-foreground'>
      <main className='py-section'>
        <Container className='max-w-sm'>
          <h1 className='text-statement'>어드민</h1>

          <form
            className='mt-8 flex flex-col gap-4'
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='admin-email'
                className='text-body-sm text-muted'>
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
                className='text-body-sm text-muted'>
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

            {/* 실패는 폼에 머문다 — 원인은 Supabase 문구를 그대로 보여준다(운영자 본인만 보는 화면) */}
            {error ? (
              <p
                role='alert'
                className='text-body-sm text-accent'>
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
        </Container>
      </main>
    </div>
  );
}
