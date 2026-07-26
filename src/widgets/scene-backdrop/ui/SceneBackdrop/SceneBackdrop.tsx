/** SceneBackdrop — 장면 하나를 겹으로 조립해 섹션 배경으로 깐다 */
import type { RefObject } from 'react';
import type { Scene } from '../../model/types';
import { SceneLayer } from '../SceneLayer/SceneLayer';
import * as s from './SceneBackdrop.css';

/** 배경 조립 — 겹의 순서가 곧 그리는 순서이며, 먼 겹이 먼저 온다 */
export function SceneBackdrop({
  scene,
  rootRef,
}: {
  scene: Scene;
  rootRef?: RefObject<HTMLDivElement | null>;
}) {
  // 겹 반복 간격 = 장면 폭. viewBox 는 "minX minY width height" 라 세 번째 값이다
  const repeatOffset = Number(scene.viewBox.split(' ')[2]);

  return (
    <div
      ref={rootRef}
      className={s.backdrop}>
      <svg
        className={s.canvas}
        viewBox={scene.viewBox}
        preserveAspectRatio='xMidYMax slice'
        aria-hidden='true'>
        {scene.layers.map((layer) => {
          return (
            <SceneLayer
              key={layer.id}
              layer={layer}
              repeatOffset={repeatOffset}
            />
          );
        })}
      </svg>
    </div>
  );
}
