import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'jaejoon docs',
  description: '재준 닷컴의 모든 것',
  alternates: { canonical: '/docs' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/docs',
    title: 'jaejoon docs',
    description: '재준 닷컴의 모든 것',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'limjaejoon docs',
      },
    ],
  },
};

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
