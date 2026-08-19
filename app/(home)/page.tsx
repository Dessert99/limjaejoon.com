import { HeroSection } from '@/views/home/components/HeroSection/HeroSection';
import { IntroOverlay } from '@/views/home/components/IntroOverlay/IntroOverlay';
import { ScrollStage } from '@/views/home/components/ScrollStage/ScrollStage';

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
