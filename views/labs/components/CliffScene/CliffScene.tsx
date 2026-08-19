'use client';

import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { CameraRig } from './CameraRig';
import { Cliff } from './Cliff';
import { TopicBoard } from './TopicBoard';
import { CLIFF } from '../../config/cliff';
import { TOPICS } from '../../config/topics';
import { gsap, useGSAP } from '@/lib/motion/gsap';

const SCRUB = 1.2;

const BLACKOUT_CLASS =
  'pointer-events-none fixed inset-0 z-(--z-overlay) bg-labs-void opacity-0';

/** 절벽 위를 걷다 끝에서 떨어지는 스크롤 씬. 주제 보드가 소실점에서 다가온다. */
export function CliffScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);

  useGSAP(
    () => {
      const root = rootRef.current;
      const blackout = blackoutRef.current;

      if (!root || !blackout) {
        return;
      }

      const media = gsap.matchMedia();

      media.add(
        { smooth: '(prefers-reduced-motion: no-preference)' },
        (context) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: 'bottom bottom',
                // 스크럽 지연이 곧 카메라 관성이라, 없애면 전진이 뻣뻣해진다
                scrub: context.conditions?.smooth ? SCRUB : true,
              },
            })
            .to(scroll, { current: 1, ease: 'none', duration: 1 }, 0)
            .to(
              blackout,
              { opacity: 1, ease: 'power2.in', duration: 1 - CLIFF.fallStart },
              CLIFF.fallStart
            );
        }
      );

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className='h-[600vh]'>
      <div className='fixed inset-0'>
        <Canvas
          flat
          dpr={[1, 2]}
          camera={{ fov: CLIFF.fov, near: 0.1, far: 400 }}>
          <CameraRig scroll={scroll} />
          <Cliff />
          {TOPICS.map((topic, index) => {
            return (
              <TopicBoard
                key={topic.href}
                topic={topic}
                z={(-CLIFF.length * (index + 1)) / (TOPICS.length + 1)}
              />
            );
          })}
        </Canvas>
      </div>

      <div
        ref={blackoutRef}
        aria-hidden='true'
        className={BLACKOUT_CLASS}
      />
    </div>
  );
}
