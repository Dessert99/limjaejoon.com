// 카테고리 페이지 상단의 '홈으로' 이동 링크를 위해 사용합니다.
import Link from 'next/link';
// 허용되지 않은 slug 접근 시 404 처리하기 위해 사용합니다.
import { notFound } from 'next/navigation';

import {
  SnippetSection,
  SnippetSectionFooter,
  SnippetSectionHeader,
  SnippetSectionPanels,
} from '@/features/handbook/components/SnippetSection';
import { categorySlugs, handbookCategories } from '@/features/handbook/categoryRepository';

interface CategoryPageProps {
  // App Router에서 전달하는 동적 라우트 파라미터 Promise 입니다.
  params: Promise<{ slug: string }>;
}

// 빌드 시 이 함수를 실행해서 배열(카테고리)을 받는다. 이거로 각 항목마다 CategoryPage를 호출해서 HTML/RSC결과를 생성한다.
export function generateStaticParams() {
  // 카테고리 페이지를 SSG로 미리 생성하기 위한 slug 목록입니다.
  return categorySlugs.map((slug) => ({ slug }));
}

// 카테고리 상세 페이지: 선택한 카테고리의 스니펫 목록을 렌더합니다.
export default async function CategoryPage({ params }: CategoryPageProps) {
  // params Promise를 해제해 현재 경로의 slug 값을 얻습니다.
  const { slug } = await params;

  // 해당하는 카테고리 찾기
  const category = handbookCategories.find((item) => item.slug === slug);

  if (!category) {
    // 허용되지 않은 slug는 404로 처리합니다.
    notFound();
  }

  return (
    <main className='mx-auto min-h-screen w-full max-w-7xl px-4 py-10 md:px-8'>
      <div className='mb-4'>
        <Link
          href='/'
          className='text-sm text-zinc-400 transition hover:text-blue-200'>
          ← 홈으로
        </Link>
      </div>

      <header className='mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8'>
        <p className='text-xs uppercase tracking-[0.2em] text-blue-300'>
          Category
        </p>
        <h1 className='mt-3 text-3xl font-semibold text-zinc-100 md:text-4xl'>
          {category.title}
          <span className='text-xl font-medium text-zinc-400'>
            ({category.intentHint})
          </span>
        </h1>
        <p className='mt-3 text-sm leading-7 text-zinc-300'>
          {category.questionPrompt}
        </p>
      </header>

      {/* 카테고리별 스니펫 카드 목록 */}
      <section className='space-y-5'>
        {/* 현재 카테고리에 포함된 스니펫을 순회해 학습 섹션을 렌더합니다. */}
        {category.snippets.map((snippet) => (
          // 클라이언트 컴포넌트
          <SnippetSection
            key={snippet.id}
            snippet={snippet}>
            <SnippetSectionHeader />
            <SnippetSectionPanels />
            <SnippetSectionFooter />
          </SnippetSection>
        ))}
      </section>
    </main>
  );
}
