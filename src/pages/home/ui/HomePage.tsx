import { Timeline } from '@/shared/ui';
import { activities, education, experience } from '@/entities/profile';
import { HeroSection } from './HeroSection/HeroSection';
import { ProjectsSection } from './ProjectsSection/ProjectsSection';
import { SkillsSection } from './SkillsSection/SkillsSection';
import * as s from './HomePage.css';

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
