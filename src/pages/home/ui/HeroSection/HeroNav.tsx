/** Hero 상단 내비게이션 — 사진 위에 blob 링크를 일정 간격으로 늘어놓는다 */
import { HERO_NAV } from '../../config/navigation';
import { BlobButton } from '../BlobButton/BlobButton';

export function HeroNav() {
  return (
    // position: fixed 를 쓰지 않는다 — ScrollSmoother 가 래퍼를 transform 으로 밀어 고정이 성립하지 않는다
    <nav
      aria-label='주요 섹션'
      className='absolute inset-x-0 top-0 z-(--ds-z-content) px-gutter pt-6'>
      {/* 간격을 좁게 둔다 — 덩어리가 상자를 다 채우지 않아 투명한 여백을 이미 스스로 들고 있다 */}
      <ul className='flex flex-wrap items-center justify-center gap-1 sm:gap-2'>
        {HERO_NAV.map((item) => {
          return (
            <li key={item.href}>
              <BlobButton href={item.href}>{item.label}</BlobButton>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
