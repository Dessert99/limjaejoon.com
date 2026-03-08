// 핸드북 홈 카드 데이터 타입을 props 검증에 사용합니다.
import type { HandbookHubCategory } from '@/features/handbook/types';

interface HandbookEntryCardProps {
  // 카드가 렌더할 단일 카테고리 데이터입니다.
  category: HandbookHubCategory;
}

// 핸드북 홈에서 사용하는 비클릭형 카테고리 카드 컴포넌트입니다.
export function HandbookEntryCard({ category }: HandbookEntryCardProps) {
  return (
    // 카드 콘텐츠를 정보 단위로 묶기 위해 article 시맨틱을 사용합니다.
    <article className='group surface-card flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent-strong hover:shadow-card-md'>
      <div className='flex items-start gap-3'>
        <h2 className='text-2xl font-semibold tracking-tight text-text-primary'>{category.title}</h2>
      </div>

      <p className='mt-3 text-sm leading-7 text-text-secondary'>{category.summary}</p>
    </article>
  );
}
