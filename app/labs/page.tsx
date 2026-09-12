import { TransitionLink } from '@/components/transition/TransitionLink';
import type { Metadata } from 'next';

/** 실험 목록의 검색 및 공유 정보를 제공한다. */
export const metadata: Metadata = {
  title: 'jaejoon labs',
  description: '마음껏 실험하는 공간',
  alternates: { canonical: '/labs' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/labs',
    title: 'jaejoon labs',
    description: '마음껏 실험하는 공간',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'limjaejoon labs',
      },
    ],
  },
};

/** 실험 목록과 등록된 항목이 없을 때의 안내를 보여준다. */
export default function LabsPage() {
  return (
    <div className='min-h-svh bg-labs-background text-labs-foreground scheme-light'>
      <nav
        aria-label='주요 메뉴'
        className='sticky top-0 z-(--z-sticky) flex items-center gap-6 border-b border-labs-border bg-labs-background px-labs-gutter py-4'>
        <span className='mr-auto text-xs tracking-widest text-labs-muted uppercase'>
          labs
        </span>
        {[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Labs', href: '/labs' },
        ].map((route) => {
          return (
            <TransitionLink
              key={route.href}
              href={route.href}
              aria-current={route.href === '/labs' ? 'page' : undefined}
              className='text-base font-medium transition-colors hover:text-labs-primary'>
              {route.label}
            </TransitionLink>
          );
        })}
      </nav>

      <main className='mx-auto max-w-6xl px-labs-gutter py-12 sm:py-24'>
        <header className='mb-12'>
          <h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>
            Labs
          </h1>
          <p className='mt-4 text-base leading-relaxed text-labs-muted'>
            궁금한 것을 만들고 실험하는 공간입니다.
          </p>
        </header>

        <section
          aria-label='실험 목록'
          className='rounded-xl border border-labs-border bg-labs-card px-6 py-12 text-center'>
          <p className='text-base font-medium'>아직 등록된 실험이 없습니다.</p>
          <p className='mt-2 text-sm text-labs-muted'>
            새로운 실험을 준비하고 있어요.
          </p>
        </section>
      </main>
    </div>
  );
}
