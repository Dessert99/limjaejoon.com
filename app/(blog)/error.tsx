'use client';

import { Button } from '@/components/ui/button';

/** 블로그 쪽 화면을 그리다 오류가 났을 때. 위 레이아웃의 배색은 그대로 두고 본문 자리만 바꾼다. */
export default function BlogError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className='mx-auto flex w-full max-w-blog flex-1 flex-col justify-center px-blog-gutter py-24'>
      <h1 className='text-blog-statement'>문제가 생겼다</h1>
      <p className='mt-4 text-lg text-blog-muted-foreground'>
        잠시 뒤 다시 시도해 달라.
      </p>
      <div className='mt-8'>
        <Button
          variant='outline'
          onClick={() => {
            unstable_retry();
          }}>
          다시 시도
        </Button>
      </div>
    </main>
  );
}
