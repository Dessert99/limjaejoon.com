import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'sample',
  description: '열매 하나에 붙는 본문 자리',
  alternates: { canonical: '/labs/sample' },
};

export default function LabsSamplePage() {
  return (
    <main className='absolute inset-y-0 right-0 w-full max-w-lg overflow-y-auto border-l border-labs-pine-100 bg-labs-cream-100 px-8 py-10'>
      <Link
        href='/labs'
        className='text-sm text-labs-pine-100 underline underline-offset-4'>
        나무로 돌아가기
      </Link>

      <h1 className='mt-6 text-3xl font-semibold'>sample</h1>

      <p className='mt-4 break-keep text-labs-bark-50'>
        열매 하나가 라우트 하나를 연다. 본문은 tsx라 아래처럼 살아 있는 예시를
        그대로 끼워 넣을 수 있다.
      </p>

      <div className='mt-6 h-24 rounded-lg bg-linear-to-r from-labs-peach-100 to-labs-pine-100' />
    </main>
  );
}
