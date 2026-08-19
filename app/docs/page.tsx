import { buildPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: '소개',
  description: '어떤 문제를 어떻게 풀어 왔는지',
  path: '/docs',
});

export default function DocsPage() {
  return (
    <main className='grow bg-docs-background py-docs-section text-docs-foreground'>
      <div className='mx-auto flex min-h-[60svh] max-w-docs flex-col justify-center gap-5 px-docs-gutter'>
        <h1 className='text-docs-statement'>소개</h1>
        <p className='text-lg break-keep text-docs-muted-foreground'>
          어떤 문제를 어떻게 풀어 왔는지 길게 적을 자리. 준비 중이다.
        </p>
      </div>
    </main>
  );
}
