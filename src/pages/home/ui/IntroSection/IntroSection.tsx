/** IntroSection — 홈 첫 섹션. 프라하 실루엣 배경 위의 소개 화면 */
'use client';

import { useRef } from 'react';
import { profile } from '@/entities/profile';
import { SceneBackdrop, cityScene } from '@/widgets/scene-backdrop';
import * as s from './IntroSection.css';

/** 소개 섹션 — 핀 대상 ref 를 소유해 배경 위젯에 넘긴다 */
export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className={s.section}>
      <SceneBackdrop
        scene={cityScene}
        sectionRef={sectionRef}
      />
      <div className={s.content}>
        <div className={s.copy}>
          <p className={s.label}>FRONTEND</p>
          <h1 className={s.name}>{profile.name}</h1>
          <p className={s.headline}>{profile.headline}</p>
          <ul className={s.taglines}>
            {profile.taglines.map((line) => {
              return (
                <li
                  key={line}
                  className={s.tagline}>
                  {line}
                </li>
              );
            })}
          </ul>
        </div>
        <div
          className={s.imageSlot}
          aria-hidden='true'
        />
      </div>
    </section>
  );
}
