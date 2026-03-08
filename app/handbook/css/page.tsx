// CSS 주제 카드 클릭 이동 링크를 만들기 위해 사용합니다.
import Link from 'next/link';

// 기존 CSS 학습 카테고리 데이터를 재사용합니다.
import { handbookCategories } from '@/features/handbook/categoryRepository';

// CSS 핸드북 목록 페이지: 세부 slug 진입용 주제 카드를 제공합니다.
export default function HandbookCssPage() {
  // CSS 카테고리 목록 화면을 렌더합니다.
  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl px-4 pt-28 pb-14 md:px-6'>
      <header className='surface-card p-6 md:p-10'>
        <p className='text-xs font-semibold uppercase tracking-widest text-accent-strong'>
          Handbook Category
        </p>
        <h1 className='mt-3 text-3xl font-semibold tracking-tight text-text-primary md:text-5xl'>
          CSS
        </h1>
        <p className='mt-4 text-sm leading-7 text-text-secondary md:text-base'>
          flex, grid, box, spacing 주제를 선택해 CSS 스니펫 상세 페이지로 이동할 수 있습니다.
        </p>
      </header>

      <section className='mt-6 grid gap-4 md:grid-cols-2'>
        {/* 기존 CSS 주제 데이터 배열을 카드 목록으로 렌더합니다. */}
        {handbookCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/handbook/css/${category.slug}`}
            className='group surface-card flex h-full flex-col p-5 transition-shadow duration-200 hover:shadow-card-md'>
            <h2 className='mt-1 text-2xl font-semibold text-text-primary'>
              {category.title}
              <span className='ml-2 text-base font-medium text-text-muted'>
                ({category.intentHint})
              </span>
            </h2>

            <p className='mt-3 text-sm leading-6 text-text-secondary'>{category.questionPrompt}</p>
            <p className='mt-2 text-sm leading-6 text-text-muted'>{category.description}</p>

            <p className='mt-5 text-xs text-text-muted'>
              스니펫{' '}
              <span className='font-semibold text-accent-strong'>
                {category.snippets.length}개
              </span>
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
