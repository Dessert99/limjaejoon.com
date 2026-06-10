import { HeroSection } from '@/features/about/ui/HeroSection/HeroSection';
import { ProjectsSection } from '@/features/about/ui/ProjectsSection/ProjectsSection';
import { SkillsSection } from '@/features/about/ui/SkillsSection/SkillsSection';
import { Timeline } from '@/shared/ui';
import { activities, education, experience } from '@/entities/profile';
import * as s from './page.css';

export default function Home() {
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
