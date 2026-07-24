/** 포트폴리오 홈 — Hero·Skills·경력/활동/학력 Timeline·Projects 조립 */
import { activities, education, experience } from '@/entities/profile';
import { Timeline } from '@/shared/ui';
import { HeroSection } from './HeroSection/HeroSection';
import { SkillsSection } from './SkillsSection/SkillsSection';
import { ProjectsSection } from './ProjectsSection/ProjectsSection';
import * as s from './HomePage.css';

/** 홈 페이지 구성 (main 순서 유지) */
export function HomePage() {
  return (
    <main className={s.main}>
      <HeroSection />
      <SkillsSection />
      <Timeline
        title='경력'
        items={experience}
      />
      <Timeline
        title='활동'
        items={activities}
      />
      <ProjectsSection />
      <Timeline
        title='학력'
        items={education}
      />
    </main>
  );
}
