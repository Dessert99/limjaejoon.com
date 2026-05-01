import type { IconType } from 'react-icons';
import {
  SiExpo,
  SiJavascript,
  SiNestjs,
  SiNextdotjs,
  SiReact,
  SiTypescript,
} from 'react-icons/si';
import { SectionReveal } from '@/features/about/components/SectionReveal';
import { skills } from '@/features/about/data/skills';
import { IconTile } from './IconTile';
import * as s from './SkillsSection.css';

const iconBySkill: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  'React.js': SiReact,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  'React Native': SiReact,
  Expo: SiExpo,
  NestJS: SiNestjs,
};

export function SkillsSection() {
  return (
    <section className={s.section}>
      <h2 className={s.heading}>보유 기술</h2>
      <SectionReveal>
        <ul className={s.list}>
          {skills.map((skill) => {
            const Icon = iconBySkill[skill];
            if (!Icon) {
              return null;
            }
            return (
              <li key={skill}>
                <IconTile
                  icon={Icon}
                  label={skill}
                />
              </li>
            );
          })}
        </ul>
      </SectionReveal>
    </section>
  );
}
