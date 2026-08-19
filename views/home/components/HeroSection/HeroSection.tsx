import Image from 'next/image';
import { HeroPanel } from '../HeroPanel/HeroPanel';
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
        src='/images/meme.jpeg'
        alt='유럽 구도심 골목에 선 임재준'
        fill
        priority
        sizes='100vw'
        className='z-(--z-base) object-cover'
      />

      <div
        aria-hidden='true'
        className={FADE_CLASS}
      />

      <div className='z-(--z-content) flex flex-1 justify-end p-home-gutter pe-16'>
        <HeroPanel />
      </div>

      <HeroMarquee
        text='DESIGN ENGINEER'
        titleId={TITLE_ID}
      />
    </section>
  );
}
