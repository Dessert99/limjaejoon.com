/** 포트폴리오 홈 — Hero·Skills·Projects 조립 */
import { HeroSection } from './HeroSection/HeroSection';
import { SkillsSection } from './SkillsSection/SkillsSection';
import { ProjectsSection } from './ProjectsSection/ProjectsSection';
import * as s from './HomePage.css';

/** 홈 페이지 구성 */
export function HomePage() {
  return (
    <main className={s.main}>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
    </main>
  );
}
