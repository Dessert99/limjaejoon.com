import Image from 'next/image';
import { HERO } from '../../config/hero';
import { HeroMarquee } from './HeroMarquee';

const TITLE_ID = 'hero-title';

const FADE_CLASS =
  'pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-home-background';

export function HeroSection() {
  return (
    <section
      aria-labelledby={TITLE_ID}
      className='relative flex min-h-svh flex-col justify-end overflow-hidden pb-6'>
      <Image
        src={HERO.portrait.src}
        alt={HERO.portrait.alt}
        fill
        priority
        sizes='100vw'
        className='z-(--z-base) object-cover'
      />

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
