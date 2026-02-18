import { CategoryCard } from '@/features/handbook/components/CategoryCard';
import { handbookCategories } from '@/features/handbook/data';

// 홈 페이지: 카테고리 목록을 보여주는 진입점입니다.
export default function Home() {
  return (
    <main className='mx-auto min-h-screen w-full max-w-7xl px-4 py-12 md:px-8'>
      {/* 서비스 소개 영역 */}
      <section className='rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-10'>
        <p className='text-xs uppercase tracking-[0.22em] text-blue-300'>
          멋쟁이사자처럼
        </p>
        <h1 className='mt-4 text-4xl font-semibold tracking-tight text-zinc-100 md:text-5xl'>
          HTML + CSS 핸드북
        </h1>
        <p className='mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base'>
          코드와 실시간 미리보기로 바로 확인하세요.
        </p>
      </section>

      {/* 카테고리 카드 그리드 */}
      <section className='mt-8 grid gap-4 md:grid-cols-2'>
        {handbookCategories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
          />
        ))}
      </section>
    </main>
  );
}
