/** SceneSection — 장면 배경을 깔고 화면 하나를 차지하는 섹션 셸 */
'use client';

import { useRef, type ReactNode } from 'react';
import {
  SceneBackdrop,
  useHorizontalParallax,
  type Scene,
} from '@/widgets/scene-backdrop';
import * as s from './SceneSection.css';

/** 섹션 셸 — 핀 대상 ref 를 소유하고 훅에 넘긴다. footer 는 하단 중앙 고정 슬롯 */
export function SceneSection({
  scene,
  children,
  footer,
}: {
  scene: Scene;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // 훅을 배경 쪽에서 부르면 자식 layout effect 가 먼저 돌아 sectionRef 가 아직 비어 있다
  useHorizontalParallax({ scene, sectionRef, scopeRef: backdropRef });

  return (
    <section
      ref={sectionRef}
      className={s.section}>
      <SceneBackdrop
        scene={scene}
        rootRef={backdropRef}
      />
      <div className={s.content}>{children}</div>
      {footer ? <div className={s.footer}>{footer}</div> : null}
    </section>
  );
}
