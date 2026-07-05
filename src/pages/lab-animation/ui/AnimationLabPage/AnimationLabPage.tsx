'use client';

/** animation 플레이그라운드 — 조작 상태를 소유하고 컨트롤·프리뷰·코드 패널을 조립 */
import { useAnimationConfig } from '../../model/useAnimationConfig';
import { AnimationControls } from '../AnimationControls/AnimationControls';
import { AnimationReference } from '../AnimationReference/AnimationReference';
import { CodePanel } from '../CodePanel/CodePanel';
import { PreviewStage } from '../PreviewStage/PreviewStage';
import * as s from './AnimationLabPage.css';

/** /lab/animation 페이지 — 단일 config가 아래로만 흐른다 */
export function AnimationLabPage() {
  const { config, update } = useAnimationConfig();

  return (
    <main className={s.main}>
      <header className={s.header}>
        <p className={s.eyebrow}>Lab</p>
        <h1 className={s.title}>animation</h1>
        <p className={s.description}>
          animation은 트리거 없이 스스로 재생되는 다단계 연출이다. 장면은
          @keyframes 프리셋에서 고르고, 반복·방향·바깥 시간의 모습을 직접
          조작하며 transition과의 차이를 관찰해보자.
        </p>
        <CodePanel config={config} />
      </header>
      <div className={s.grid}>
        <div className={s.column}>
          <AnimationControls
            config={config}
            onChange={update}
          />
        </div>
        <div className={s.column}>
          <PreviewStage
            config={config}
            onPlayStateChange={(playState) => {
              return update({ playState });
            }}
          />
        </div>
      </div>
      <AnimationReference />
    </main>
  );
}
