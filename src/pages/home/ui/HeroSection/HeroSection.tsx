/** Hero — 첫 화면. 인물 사진이 화면을 덮고 하단을 마퀴가 가로지른다 */
import Image from 'next/image';
import { HERO } from '../../config/hero';
import { HeroMarquee } from './HeroMarquee';
import { HeroNav } from './HeroNav';

// 섹션을 region 랜드마크로 만들려면 이름이 필요하다 — id 만으로는 랜드마크 목록에 안 뜬다
const TITLE_ID = 'hero-title';

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

      <HeroNav />

      <HeroMarquee
        text={HERO.headline}
        titleId={TITLE_ID}
      />
    </section>
  );
}
