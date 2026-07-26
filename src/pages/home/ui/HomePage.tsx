/** 포트폴리오 홈 — 섹션 단위 풀페이지 스크롤 */
import { IntroSection } from './IntroSection/IntroSection';
import { RiverSection } from './RiverSection/RiverSection';

/** 홈 페이지 구성 */
export function HomePage() {
  return (
    <main>
      <IntroSection />
      <RiverSection />
    </main>
  );
}
