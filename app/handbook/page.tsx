// handbook 홈 카드 UI를 그리는 컴포넌트를 가져옵니다.
import { CategoryCard } from '@/features/handbook/components/CategoryCard';
// handbook 홈에서 사용할 카테고리 데이터 배열을 가져옵니다.
import { handbookCategories } from '@/features/handbook/categoryRepository';

// handbook 루트 페이지: 카테고리 목록을 보여주는 진입점입니다.
export default function HandbookPage() {
  return (
    <main className='mx-auto min-h-screen w-full max-w-[1200px] px-4 py-12 md:px-6'>
      {/* handbook 소개 영역 */}
      <section className='surface-card p-6 md:p-10'>
        <p className='text-xs font-semibold uppercase tracking-[0.22em] text-(--accent-green-strong)'>
          Handbook
        </p>
        <h1 className='mt-4 text-4xl font-semibold tracking-tight text-(--text-primary) md:text-5xl'>
          HTML + CSS 핸드북
        </h1>
        <p className='mt-4 max-w-3xl text-sm leading-7 text-(--text-secondary) md:text-base'>
          코드와 실시간 미리보기로 개념을 바로 확인할 수 있는 학습형 가이드를 제공합니다.
        </p>
      </section>

      {/* 카테고리 카드 그리드 */}
      <section className='mt-8 grid gap-4 md:grid-cols-2'>
        {/* 카테고리 데이터 배열을 순회해 카드 컴포넌트로 렌더합니다. */}
        {handbookCategories.map((category) => (
          // 각 카드는 slug를 key로 사용해 안정적인 리스트 렌더를 유지합니다.
          <CategoryCard
            key={category.slug}
            category={category}
          />
        ))}
      </section>
    </main>
  );
}
