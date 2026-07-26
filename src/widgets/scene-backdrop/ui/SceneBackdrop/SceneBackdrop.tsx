/** SceneBackdrop — 장면 하나를 겹으로 조립해 섹션 배경으로 깐다 */
'use client';

import { useRef, type RefObject } from 'react';
import { useHorizontalParallax } from '../../model/useHorizontalParallax';
import type { Scene } from '../../model/types';
import { SceneLayer } from '../SceneLayer/SceneLayer';
import * as s from './SceneBackdrop.css';

/** 배경 조립 — 겹의 순서가 곧 그리는 순서이며, 먼 겹이 먼저 온다 */
export function SceneBackdrop({
  scene,
  sectionRef,
}: {
  scene: Scene;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useHorizontalParallax({ scene, sectionRef, scopeRef });

  return (
    <div
      ref={scopeRef}
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
            />
          );
        })}
      </svg>
    </div>
  );
}
