/** 랩 목록 — 인터랙션 실험 페이지 인덱스 */
import Link from 'next/link';
import * as s from './LabPage.css';

// 아직 항목이 적어 로컬 상수로 관리 — 데이터 소스가 필요해지면 그때 분리한다
const LAB_ENTRIES = [
  {
    href: '/lab/transition',
    title: 'transition',
    description: 'CSS transition 4요소를 실시간 조작하며 배우는 플레이그라운드',
  },
];

/** /lab 페이지 — 실험 목록 카드 */
export function LabPage() {
  return (
    <main className={s.main}>
      <header className={s.header}>
        <p className={s.eyebrow}>Lab</p>
        <h1 className={s.title}>인터랙션 실험실</h1>
        <p className={s.description}>
          인터랙션 애니메이션 개념을 하나씩, 직접 만져보며 배우는 공간.
        </p>
      </header>
      <section
        aria-label='실험 목록'
        className={s.list}>
        {LAB_ENTRIES.map((entry) => {
          return (
            <article
              className={s.item}
              key={entry.href}>
              <h2 className={s.itemTitle}>
                <Link href={entry.href}>{entry.title}</Link>
              </h2>
              <p className={s.itemDescription}>{entry.description}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
