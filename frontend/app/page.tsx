import { HeroSection } from '@/features/about/components/HeroSection';
import { ProjectsSection } from '@/features/about/components/ProjectsSection';
import { SkillsSection } from '@/features/about/components/SkillsSection';
import { Timeline } from '@/features/about/components/Timeline';
import { activities } from '@/features/about/data/activities';
import { education } from '@/features/about/data/education';
import { experience } from '@/features/about/data/experience';
import * as s from './page.css';

export default function Home() {
  return (
    <main className={s.main}>
      <HeroSection />
      <Timeline
        title='경력'
        items={experience}
      />
      <Timeline
        title='활동'
        items={activities}
      />
      <ProjectsSection />
      <SkillsSection />
      <Timeline
        title='학력'
        items={education}
      />
    </main>
  );
}
