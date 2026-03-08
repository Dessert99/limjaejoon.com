// CSS 주제 카드 클릭 이동 링크를 만들기 위해 사용합니다.
import Link from 'next/link';

// 기존 CSS 학습 카테고리 데이터를 재사용합니다.
import { handbookCategories } from '@/features/handbook/css/categoryRepository';

// CSS 핸드북 목록 페이지: 세부 slug 진입용 주제 카드를 제공합니다.
export default function HandbookCssPage() {
  // CSS 카테고리 목록 화면을 렌더합니다.
  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl px-4 pt-28 pb-14 md:px-6'>
      {/* CSS 카드 전용 스타일 클래스(cssCard.css)를 적용한 카드 그리드입니다. */}
      <section className='css-topic-grid mt-6'>
        {/* 기존 CSS 주제 데이터 배열을 카드 목록으로 렌더합니다. */}
        {handbookCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/handbook/css/${category.slug}`}
            className='css-topic-card'>
            <h2 className='text-2xl font-semibold text-text-primary'>
              {category.title}
              <span className='ml-2 text-base font-medium text-text-muted'>
                ({category.intentHint})
              </span>
            </h2>

            <p className='css-topic-desc'>{category.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
