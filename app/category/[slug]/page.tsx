import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SnippetSection } from '@/features/handbook/components/SnippetSection';
import { categorySlugs, getCategoryBySlug } from '@/features/handbook/data';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  // 카테고리 페이지를 SSG로 미리 생성하기 위한 slug 목록입니다.
  return categorySlugs.map((slug) => ({ slug }));
}

// 카테고리 상세 페이지: 선택한 카테고리의 스니펫 목록을 렌더합니다.
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

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
