// 카테고리 페이지 상단의 이동 링크를 만들기 위해 사용합니다.
import Link from 'next/link';
// 허용되지 않은 slug 접근 시 404 처리하기 위해 사용합니다.
import { notFound } from 'next/navigation';

import { SnippetSection } from '@/features/handbook/css/components/SnippetSection';
import { categorySlugs, handbookCategories } from '@/features/handbook/css/categoryRepository';

interface HandbookCssCategoryPageProps {
  // App Router에서 전달하는 동적 라우트 파라미터 Promise 입니다.
  params: Promise<{ slug: string }>;
}

// handbook CSS 상세 페이지를 SSG로 미리 생성하기 위한 slug 목록을 반환합니다.
export function generateStaticParams() {
  // 카테고리 slug 배열을 `[{ slug }]` 형태로 변환해 반환합니다.
  return categorySlugs.map((slug) => ({ slug }));
}

// handbook CSS 상세 페이지: 선택한 주제의 스니펫 목록을 렌더합니다.
export default async function HandbookCssCategoryPage({
  params,
}: HandbookCssCategoryPageProps) {
  // params Promise를 해제해 현재 경로의 slug 값을 얻습니다.
  const { slug } = await params;
  // 현재 slug에 대응하는 카테고리를 데이터 저장소에서 조회합니다.
  const category = handbookCategories.find((item) => item.slug === slug);

  if (!category) {
    // 허용되지 않은 slug는 404로 처리합니다.
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
          CSS Topic
        </p>
        <h1 className='mt-3 text-3xl font-semibold text-text-primary md:text-4xl'>
          {category.title}
          <span className='ml-2 text-xl font-medium text-text-muted'>
            ({category.intentHint})
          </span>
        </h1>
        <p className='mt-3 text-sm leading-7 text-text-secondary'>{category.description}</p>
      </header>

      {/* 카테고리별 스니펫 카드 목록 */}
      <section className='space-y-5'>
        {/* 현재 카테고리에 포함된 스니펫을 순회해 학습 섹션을 렌더합니다. */}
        {category.snippets.map((snippet) => (
          <SnippetSection
            key={snippet.id}
            snippet={snippet}
          />
        ))}
      </section>
    </main>
  );
}
