import { HeroSection } from '@/views/home/components/HeroSection/HeroSection';
import { IntroOverlay } from '@/views/home/components/IntroOverlay/IntroOverlay';
import { ScrollStage } from '@/views/home/components/ScrollStage/ScrollStage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/** 인트로 커튼이 걷히면 관성 스크롤 무대 위의 히어로가 드러난다. */
export default function HomePage() {
  return (
    <>
      <IntroOverlay />

      <ScrollStage>
        <main>
          <HeroSection />
        </main>
      </ScrollStage>
    </>
  );
}
