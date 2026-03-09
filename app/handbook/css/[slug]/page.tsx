import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SnippetSection } from '@/features/handbook/css/common/components/SnippetSection';
import {
  cssPropertySlugs,
  getCssPropertyModuleBySlug,
} from '@/features/handbook/css/catalog/propertyCatalog';

interface HandbookCssPropertyPageProps {
  params: Promise<{ slug: string }>;
}

// handbook CSS 상세 페이지를 SSG로 미리 생성하기 위한 slug 목록을 반환합니다.
export function generateStaticParams() {
  return cssPropertySlugs.map((slug) => ({ slug }));
}

// handbook CSS 상세 페이지: 선택한 속성의 스니펫 목록을 렌더합니다.
export default async function HandbookCssPropertyPage({ params }: HandbookCssPropertyPageProps) {
  const { slug } = await params;
  const property = getCssPropertyModuleBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-6'>
      <div className='mb-4 flex flex-wrap items-center gap-4'>
        <Link
          href='/'
          className='text-sm font-medium text-text-muted transition-colors hover:text-text-primary'>
          ← 홈으로
        </Link>
        <Link
          href='/handbook/css'
          className='text-sm font-medium text-text-muted transition-colors hover:text-accent-strong'>
          CSS 목록
        </Link>
      </div>

      <header className='surface-card mb-8 p-6 md:p-8'>
        <p className='text-xs font-semibold uppercase tracking-widest text-accent-strong'>
          CSS Property
        </p>
        <h1 className='mt-3 text-3xl font-semibold text-text-primary md:text-4xl'>
          {property.title}
        </h1>
        <p className='mt-3 text-sm leading-7 text-text-secondary'>{property.intent}</p>
      </header>

      <section className='space-y-5'>
        {property.snippets.map((snippet) => (
          <SnippetSection
            key={snippet.id}
            snippet={snippet}
            previewConfig={property.previewConfig}
          />
        ))}
      </section>
    </main>
  );
}
