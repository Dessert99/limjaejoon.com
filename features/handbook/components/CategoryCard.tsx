// 카테고리 상세 페이지 이동 링크를 만들기 위해 사용합니다.
import Link from 'next/link';

// 카테고리 데이터 타입을 props 검증에 사용합니다.
import type { HandbookCategory } from '@/features/handbook/types';

interface CategoryCardProps {
  // 카드가 렌더할 단일 카테고리 데이터입니다.
  category: HandbookCategory;
}

// 홈에서 보여주는 카테고리 카드 컴포넌트입니다.
export function CategoryCard({ category }: CategoryCardProps) {
  return (
    // 카테고리 slug를 경로에 붙여 상세 페이지로 이동시킵니다.
    <Link
      href={`/category/${category.slug}`}
      className='group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-blue-500/70 hover:bg-zinc-900'>
      <h2 className='mt-3 text-2xl font-semibold text-zinc-100'>
        {category.title}{' '}
        <span className='text-base font-medium text-zinc-400'>
          ({category.intentHint})
        </span>
      </h2>

      <p className='mt-3 text-sm leading-6 text-zinc-200'>
        {category.questionPrompt}
      </p>
      <p className='mt-2 text-sm leading-6 text-zinc-400'>
        {category.description}
      </p>

      <p className='mt-5 text-xs text-zinc-500'>
        스니펫{' '}
        <span className='font-semibold text-zinc-300'>
          {category.snippets.length}개
        </span>
      </p>
    </Link>
  );
}
