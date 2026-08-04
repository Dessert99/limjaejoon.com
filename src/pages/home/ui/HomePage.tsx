/** 포트폴리오 홈 — 섹션 조립만 하고 콘텐츠는 각 섹션이 config 에서 가져온다 */
import { SiteFooter } from '@/widgets/site-footer';
import { ContactSection } from './ContactSection/ContactSection';
import { GallerySection } from './GallerySection/GallerySection';
import { HeroSection } from './HeroSection/HeroSection';
import { IntroductionSection } from './IntroductionSection/IntroductionSection';
import { ScrollStage } from './ScrollStage/ScrollStage';
import { WorkSection } from './WorkSection/WorkSection';

/** 홈 페이지 구성 */
export function HomePage() {
  return (
    // 스크롤하는 것은 전부 무대 안에 있어야 한다 — 밖에 두면 관성과 따로 논다
    <ScrollStage>
      <main>
        <HeroSection />
        <IntroductionSection />
        <WorkSection />
        <GallerySection />
        <ContactSection />
      </main>
      {/* main 밖이다 — section·main 안에 중첩된 footer 는 contentinfo 랜드마크가 되지 않는다 */}
      <SiteFooter />
    </ScrollStage>
  );
}
