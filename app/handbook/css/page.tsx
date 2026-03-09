import Link from 'next/link';

import { groupedCssPropertyCards } from '@/features/handbook/css/catalog/propertyCatalog';

// CSS 속성 목록 페이지: 대분류별로 속성 카드를 렌더합니다.
export default function HandbookCssPage() {
  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl pb-14 md:px-6'>
      <header className='mb-8'>
        <p className='text-xs font-semibold uppercase tracking-widest text-accent-strong'>
          CSS Property Handbook
        </p>
        <h1 className='mt-2 text-3xl font-semibold text-text-primary md:text-4xl'>
          CSS 속성 분류
        </h1>
      </header>

      <section className='space-y-10'>
        {groupedCssPropertyCards.map(({ group, cards }) => {
          if (!cards.length) {
            return null;
          }

          return (
            <article key={group.slug}>
              <header className='mb-4'>
                <h2 className='text-xl font-semibold text-text-primary'>
                  {group.label}
                </h2>
                {group.description ? (
                  <p className='mt-1 text-sm text-text-secondary'>
                    {group.description}
                  </p>
                ) : null}
              </header>

              <div className='css-topic-grid'>
                {cards.map((card) => (
                  <Link
                    key={card.slug}
                    href={`/handbook/css/${card.slug}`}
                    className='css-topic-card'>
                    <h3 className='text-2xl font-semibold text-text-primary'>
                      {card.title}
                    </h3>
                    <p className='css-topic-desc'>{card.intent}</p>
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
