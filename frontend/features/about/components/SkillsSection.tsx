import type { ComponentType } from 'react';
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
import * as s from './SkillsSection.css';

const iconBySkill: Record<string, ComponentType> = {
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
            return (
              <li
                key={skill}
                className={s.chip}>
                {Icon && (
                  <span
                    className={s.icon}
                    aria-hidden='true'>
                    <Icon />
                  </span>
                )}
                {skill}
              </li>
            );
          })}
        </ul>
      </SectionReveal>
    </section>
  );
}
