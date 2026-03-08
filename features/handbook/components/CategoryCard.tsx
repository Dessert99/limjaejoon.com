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
    // 카테고리 slug를 handbook 하위 경로에 붙여 상세 페이지로 이동시킵니다.
    <Link
      href={`/handbook/${category.slug}`}
      className='group surface-card flex h-full flex-col p-5 transition-shadow duration-200 hover:shadow-card-md'>
      <h2 className='mt-1 text-2xl font-semibold text-text-primary'>
        {category.title}
        <span className='text-base font-medium text-text-muted'>
          ({category.intentHint})
        </span>
      </h2>

      <p className='mt-3 text-sm leading-6 text-text-secondary'>
        {category.questionPrompt}
      </p>
      <p className='mt-2 text-sm leading-6 text-text-muted'>
        {category.description}
      </p>

      <p className='mt-5 text-xs text-text-muted'>
        스니펫{' '}
        <span className='font-semibold text-accent-strong'>
          {category.snippets.length}개
        </span>
      </p>
    </Link>
  );
}
