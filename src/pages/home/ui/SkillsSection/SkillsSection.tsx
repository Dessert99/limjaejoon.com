/** SkillsSection — 보유 기술을 브랜드 아이콘과 함께 칩 목록으로 렌더 */
import type { IconType } from 'react-icons';
import {
  SiExpo,
  SiJavascript,
  SiNestjs,
  SiNextdotjs,
  SiReact,
  SiTypescript,
} from 'react-icons/si';
import { skills } from '@/entities/profile';
import * as s from './SkillsSection.css';

// 기술 라벨 → 브랜드 아이콘 매핑 (매핑에 없는 기술은 렌더하지 않는다)
const iconBySkill: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  'React.js': SiReact,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  'React Native': SiReact,
  Expo: SiExpo,
  NestJS: SiNestjs,
};

/** "보유 기술" 제목과 기술 칩 목록 */
export function SkillsSection() {
  return (
    <section className={s.section}>
      <h2 className={s.heading}>보유 기술</h2>
      <ul className={s.list}>
        {skills.map((skill) => {
          const Icon = iconBySkill[skill];
          if (!Icon) {
            return null;
          }
          return (
            <li
              key={skill}
              className={s.item}>
              <Icon
                className={s.icon}
                aria-hidden='true'
              />
              <span className={s.label}>{skill}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
