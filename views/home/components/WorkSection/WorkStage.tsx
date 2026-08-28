'use client';

import { useRef, type ReactNode } from 'react';
import { CubeModel } from './CubeModel';
import { LogoRig, type LogoControl } from './LogoRig';
import { LogoScene } from './LogoScene';
import { gsap, useGSAP } from '@/lib/motion/gsap';

/** 워크 판을 화면에 박아둔 채, 로고를 층층이 조립해 세우고 설명을 붙였다가, 통째로 돌려 꺼뜨리고 다음 활동에 자리를 넘긴다. */
export function WorkStage({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  // GSAP이 굴리는 숫자를 useFrame이 매 프레임 읽어 간다. 리렌더 없이 스크롤과 3D를 잇는 유일한 통로다
  const team = useRef<LogoControl>({ build: 0, exit: 0 });
  const startup = useRef<LogoControl>({ build: 0, exit: 0 });

  useGSAP(
    () => {
      const select = gsap.utils.selector(sectionRef);
      const copies = select('[data-work-copy]');
      // 밝은 바닥은 스무더 바깥에 있어야 화면에 붙으므로, 판 밖에서 잡아 온다
      const bloom = document.querySelector('[data-chapter-bloom]');

      if (copies.length < 2 || !bloom) {
        return;
      }

      const media = gsap.matchMedia();

      // 모션을 줄여달라는 기기에서는 판이 박히지 않아, 활동이 그냥 위아래로 이어진 두 화면이 된다
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({
          // 스크롤에 그대로 매달리는 연출이라, 가속이 붙으면 손끝과 화면이 어긋나 보인다
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            // 붙잡힌 채 굴릴 거리가 화면 높이의 6.2배. 바닥을 열고 로고 둘을 세우고 읽히고 치우는 데 이만큼이 든다
            end: '+=620%',
            pin: true,
            // 1이라 손을 떼도 1초쯤 더 따라와, 스크롤이 튈 때 로고가 같이 튀지 않는다
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          // 어바웃이 마디를 오므려 꺼뜨린 그 점에서 밝은 바닥이 번져 나온다
          // 75%면 원이 화면 네 귀퉁이를 막 덮는다. 반지름 기준이 대각선의 √2분의 1이라 70.7%부터 다 덮인다
          .fromTo(
            bloom,
            { clipPath: 'circle(0% at 50% 50%)' },
            { clipPath: 'circle(75% at 50% 50%)', duration: 0.9 },
            0
          )
          // 바닥이 다 열리기 전인 0.5에 층이 모이기 시작해, 원이 로고를 밀고 오는 것처럼 보인다
          .to(team.current, { build: 1, duration: 1.2 }, 0.5)
          // 로고가 거의 다 선 1.5에 설명이 따라 올라온다
          .fromTo(
            copies[0],
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6 },
            1.5
          )
          // 2.1에 설명이 다 서고 3.3까지가 글을 읽는 정지 구간이다. 미루면 그 판에 더 오래 머문다
          .to(copies[0], { opacity: 0, y: -24, duration: 0.5 }, 3.3)
          .to(team.current, { exit: 1, duration: 0.8 }, 3.6)
          // 앞 로고가 반쯤 빠져나간 4.1에 다음 로고가 들어와, 둘이 잠깐 스치고 지나간다
          .to(startup.current, { build: 1, duration: 1.2 }, 4.1)
          .fromTo(
            copies[1],
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6 },
            5.1
          )
          .to(copies[1], { opacity: 0, y: -24, duration: 0.5 }, 6.9)
          .to(startup.current, { exit: 1, duration: 0.8 }, 7.2);

        return () => {
          return timeline.kill();
        };
      });

      return () => {
        return media.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    // 배경을 비워야 뒤에 깔린 밝은 바닥이 이 판에서만 드러난다
    <section
      ref={sectionRef}
      aria-labelledby='work-title'
      className='relative isolate min-h-svh overflow-hidden text-home-chapter-foreground'>
      <LogoScene>
        {/* 아직 조각이 하나뿐이라 relief는 아무것도 하지 않는다. 조각을 늘리면 그때부터 겹 사이를 벌린다 */}
        {/* spread 1.5는 모이기 전 조각이 카메라 쪽으로 튀어나온 거리. 키우면 더 멀리서 날아와 붙는다 */}
        {/* enterSpin -0.9는 들어올 때 비스듬히 선 각(rad). 0이면 정면 그대로 커지기만 한다 */}
        <LogoRig
          control={team}
          relief={0}
          spread={1.5}
          enterSpin={-0.9}>
          <CubeModel color='#232323' />
        </LogoRig>

        {/* 반대로 돌려 들어와야 두 활동이 같은 등장을 두 번 하지 않는다 */}
        <LogoRig
          control={startup}
          relief={0}
          spread={0.9}
          enterSpin={1.1}>
          <CubeModel color='#111111' />
        </LogoRig>
      </LogoScene>

      {children}
    </section>
  );
}
