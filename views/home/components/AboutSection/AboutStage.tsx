'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

/** 어바웃 판을 화면에 박아둔 채, 스크롤로 로고 판을 지운 뒤 문구를 상단에 앉힌다. */
export function AboutStage({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const select = gsap.utils.selector(sectionRef);
      const badge = select('[data-day-badge]')[0];
      const anchor = select('[data-day-anchor]')[0];

      if (!badge || !anchor) {
        return;
      }

      const media = gsap.matchMedia();

      // 모션을 줄여달라는 기기에서는 판이 박히지 않아, 문구도 로고도 처음 자리에 그대로 있는다
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({
          // 스크롤에 그대로 매달리는 연출이라, 가속이 붙으면 손끝과 화면이 어긋나 보인다
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            // 판 윗변이 화면 꼭대기에 닿는 순간 붙잡는다
            start: 'top top',
            // 붙잡힌 채 굴릴 스크롤 거리가 화면 높이의 2.4배. 키우면 단계 하나하나가 느긋해진다
            end: '+=240%',
            pin: true,
            // 1이라 손을 떼도 1초쯤 더 따라와, 스크롤이 튈 때 화면이 같이 튀지 않는다
            scrub: 1,
            // 창 크기가 바뀌면 상단 자리표까지 남은 거리를 다시 잰다
            invalidateOnRefresh: true,
          },
        });

        timeline
          // 시작이 0.4라 판이 박히고 나서 잠깐은 아무 일도 없다. 키우면 멈춘 화면을 더 오래 본다
          .fromTo(
            select('[data-tech-slot]'),
            { clipPath: 'inset(0 0 0% 0)' },
            {
              // 아래쪽을 100%까지 밀어 올려 로고 하나하나를 바닥부터 잘라 없앤다
              clipPath: 'inset(0 0 100% 0)',
              // 칸이 로고보다 훨씬 커서 칼날이 빈 곳을 지나는 시간이 길다. 0.8은 돼야 베이는 순간이 눈에 보인다
              duration: 0.8,
              // from 'random'이 순서를 섞어, 행도 열도 아닌 아무 로고나 제 차례에 하나씩 베인다
              // amount 2라 로고가 몇 개든 첫 로고부터 마지막까지 늘 2초에 걸쳐 흩어진다. 줄이면 우수수 한꺼번에 진다
              stagger: { amount: 2, from: 'random' },
            },
            0.4
          )
          // 마지막 로고가 3.2에 지워지고 3.6까지 문구만 남은 화면이 이어진다. 미루면 그 정적이 길어진다
          .to(
            badge,
            {
              // 자리표까지 남은 거리를 그때그때 재서 간다. 화면이 바뀌어 자리가 옮겨져도 따라간다
              x: () => {
                const box = badge.getBoundingClientRect();

                return (
                  anchor.getBoundingClientRect().left -
                  (box.left + box.width / 2)
                );
              },
              y: () => {
                return (
                  anchor.getBoundingClientRect().top -
                  badge.getBoundingClientRect().top
                );
              },
              // 1이 날아가는 데 쓰는 시간. 줄이면 문구가 훅 빨려 올라간다
              duration: 1,
            },
            3.6
          );
      });

      return () => {
        return media.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby='about-title'
      className='relative isolate flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-home-background px-home-gutter py-24 text-center text-home-foreground'>
      {/* 문구가 날아가 앉을 자리. 크기가 없어 레이아웃엔 안 잡히고 좌표만 준다 */}
      <span
        data-day-anchor
        className='absolute top-home-gutter left-1/2'
      />

      {children}
    </section>
  );
}
