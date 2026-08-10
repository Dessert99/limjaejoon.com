/** Hero — 첫 화면. 인물 사진이 화면을 덮고, 하단이 어둠에 잠겨 페이지 바탕으로 이어진다 */
import Image from 'next/image';
import { HERO } from '../../config/hero';
import { HeroMarquee } from './HeroMarquee';

// 섹션을 region 랜드마크로 만들려면 이름이 필요하다 — id 만으로는 랜드마크 목록에 안 뜬다
const TITLE_ID = 'hero-title';

/* 어둠에 잠기는 높이 — 낮으면 경계가 띠로 보이고, 높으면 인물까지 먹는다 */
/* 끝을 background 로 맞춘다 — body 가 칠하는 색과 같아야 사진이 끝나는 자리에 이음매가 안 생긴다 */
const FADE_CLASS =
  'pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-background';

export function HeroSection() {
  return (
    <section
      aria-labelledby={TITLE_ID}
      className='relative flex min-h-svh flex-col justify-end overflow-hidden pb-6'>
      {/* Media 를 쓰지 않는다 — 비율 상자라 h-full 과 만나면 높이에서 폭을 역산해 좁은 화면 밖으로 넘친다 */}
      <Image
        src={HERO.portrait.src}
        alt={HERO.portrait.alt}
        fill
        priority
        sizes='100vw'
        className='z-(--ds-z-base) object-cover'
      />

      {/* 사진 위, 마퀴 아래다 — 마퀴는 이 어둠을 배경으로 반전해야 하단에서도 읽힌다 */}
      <div
        aria-hidden='true'
        className={FADE_CLASS}
      />

      <HeroMarquee
        text={HERO.headline}
        titleId={TITLE_ID}
      />
    </section>
  );
}
