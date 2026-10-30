'use client';

/** 화면을 그리다 오류가 났을 때. 어느 라우트에도 속하지 않아 라우트 토큰 없이 그린다. */
export default function RootError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className='grid min-h-svh place-items-center px-6 text-center'>
      <div>
        <h1 className='text-2xl font-semibold'>문제가 생겼다</h1>
        <p className='mt-3 text-sm opacity-60'>잠시 뒤 다시 시도해 달라.</p>
        <button
          type='button'
          onClick={() => {
            unstable_retry();
          }}
          className='mt-8 text-sm underline underline-offset-4'>
          다시 시도
        </button>
      </div>
    </main>
  );
}
