import { HeroSection } from '@/views/home/components/HeroSection/HeroSection';
import { IntroOverlay } from '@/views/home/components/IntroOverlay/IntroOverlay';
import { ScrollStage } from '@/views/home/components/ScrollStage/ScrollStage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

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
