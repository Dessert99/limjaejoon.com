import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개',
  description: '어떤 문제를 어떻게 풀어 왔는지',
};

export default function DocsPage() {
  return (
    <main className='grow bg-background py-section text-foreground'>
      <div className='mx-auto flex min-h-[60svh] max-w-content flex-col justify-center gap-5 px-gutter'>
        <h1 className='text-statement'>소개</h1>
        <p className='text-body-lg break-keep text-muted-foreground'>
          어떤 문제를 어떻게 풀어 왔는지 길게 적을 자리. 준비 중이다.
        </p>
      </div>
    </main>
  );
}
