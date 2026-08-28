import Image from 'next/image';
import { HeroNav } from '../HeroNav/HeroNav';
import { HeroPanel } from '../HeroPanel/HeroPanel';
import { HeroMarquee } from './HeroMarquee';

/** 첫 화면 한 판. 인물 사진 위에 메뉴·연락처를 띄우고 바닥에 마퀴를 깐다. */
export function HeroSection() {
  return (
    <section
      aria-labelledby='hero-title'
      className='relative flex min-h-svh flex-col justify-end overflow-hidden pb-6'>
      <Image
        src='/images/meme.jpeg'
        alt='유럽 구도심 골목에 선 임재준'
        fill
        priority
        sizes='100vw'
        className='z-(--z-base) object-cover'
      />

      {/* 사진 아래쪽을 배경색으로 녹여 마퀴를 받친다. h-1/3을 키우면 더 위에서부터 어두워진다 */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-home-background'
      />

      <div className='z-(--z-content) flex flex-1 flex-col items-center justify-between p-home-gutter sm:items-end'>
        <HeroNav />

        <HeroPanel />
      </div>

      <HeroMarquee
        text='DESIGN ENGINEER'
        titleId='hero-title'
      />
    </section>
  );
}
