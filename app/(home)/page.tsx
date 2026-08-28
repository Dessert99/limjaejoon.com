import { AboutSection } from '@/views/home/components/AboutSection/AboutSection';
import { ChapterBloom } from '@/views/home/components/ChapterBloom/ChapterBloom';
import { HeroSection } from '@/views/home/components/HeroSection/HeroSection';
import { IntroOverlay } from '@/views/home/components/IntroOverlay/IntroOverlay';
import { ScrollStage } from '@/views/home/components/ScrollStage/ScrollStage';
import { WorkSection } from '@/views/home/components/WorkSection/WorkSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// 개발 일수가 하루에 한 번만 바뀌므로, 정적 페이지를 24시간마다 다시 굽는다
export const revalidate = 86400;

/** 인트로 커튼이 걷히면 관성 스크롤 무대 위의 히어로가 드러난다. */
export default function HomePage() {
  return (
    <>
      {/* 무대 바깥에 먼저 깔아야 스무더의 transform에 끌려다니지 않는다 */}
      <ChapterBloom />

      <ScrollStage>
        <main>
          <HeroSection />

          <AboutSection />

          <WorkSection />
        </main>
      </ScrollStage>

      {/* 커튼이 스무더를 잡아 세우려면 스무더가 먼저 만들어져 있어야 한다 */}
      <IntroOverlay />
    </>
  );
}
