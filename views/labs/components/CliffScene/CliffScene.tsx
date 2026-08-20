'use client';

import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { CameraRig } from './CameraRig';
import { Cliff } from './Cliff';
import { TopicBoard } from './TopicBoard';
import { gsap, useGSAP } from '@/lib/motion/gsap';

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
                // 스크럽 지연이 곧 카메라 관성이다. 1.2를 키우면 더 미끄러지고, 0에 가까우면 전진이 뻣뻣해진다
                scrub: context.conditions?.smooth ? 1.2 : true,
              },
            })
            .to(scroll, { current: 1, ease: 'none', duration: 1 }, 0)
            // 낙하가 시작되는 0.86부터 남은 구간을 암전에 쓴다. power2.in이라 바닥에 가까울수록 급히 어두워진다
            .to(
              blackout,
              { opacity: 1, ease: 'power2.in', duration: 1 - 0.86 },
              0.86
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
    // 600vh가 씬 전체에 배정된 스크롤 길이다. 키우면 같은 거리를 더 천천히 걷는다
    <div
      ref={rootRef}
      className='h-[600vh]'>
      <div className='fixed inset-0'>
        <Canvas
          // 톤매핑을 꺼야 labs 팔레트 색이 화면에 그대로 나온다
          flat
          // dpr 상한 2를 올리면 선명해지는 대신 고해상도 화면에서 프레임이 떨어진다
          dpr={[1, 2]}
          // fov는 CameraRig의 계산과 같아야 하고, far를 줄이면 먼 구름부터 잘려 나간다
          camera={{ fov: 55, near: 0.1, far: 400 }}>
          <CameraRig scroll={scroll} />
          <Cliff />
          {/* 배열 순서가 곧 카메라가 만나는 순서다 */}
          {[
            {
              title: '스크롤 실험',
              caption: 'GSAP ScrollTrigger',
              href: '/labs/scroll',
            },
            { title: '셰이더 놀이터', caption: 'GLSL', href: '/labs/shader' },
            {
              title: '타이포 실험',
              caption: 'variable font',
              href: '/labs/typography',
            },
          ].map((topic, index, topics) => {
            return (
              <TopicBoard
                key={topic.href}
                {...topic}
                // 절벽 길이 130을 보드 수 +1로 나눠 균등 배치한다. 130을 늘리면 보드 사이가 벌어진다
                z={(-130 * (index + 1)) / (topics.length + 1)}
              />
            );
          })}
        </Canvas>
      </div>

      {/* 낙하 끝을 덮는 암전막. z-overlay라 보드 위에 얹히고, pointer-events가 없어 클릭은 통과한다 */}
      <div
        ref={blackoutRef}
        aria-hidden='true'
        className='pointer-events-none fixed inset-0 z-(--z-overlay) bg-labs-void opacity-0'
      />
    </div>
  );
}
