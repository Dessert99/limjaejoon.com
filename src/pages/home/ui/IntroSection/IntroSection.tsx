/** IntroSection — 홈 첫 섹션. 프라하 도시 실루엣 배경 위의 소개 화면 */
import { profile } from '@/entities/profile';
import { cityScene } from '@/widgets/scene-backdrop';
import { SceneSection } from '../SceneSection/SceneSection';
import * as s from './IntroSection.css';

/** 소개 섹션 — 좌측 문구, 우측 이미지 자리 */
export function IntroSection() {
  return (
    <SceneSection scene={cityScene}>
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
    </SceneSection>
  );
}
