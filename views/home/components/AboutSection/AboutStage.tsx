'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

/** 어바웃 판을 화면에 박아둔 채, 스크롤로 로고 판을 지우고 일수 문구를 오므려 없앤 그 자리에서 활동 이력을 그려 내린다. */
export function AboutStage({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const select = gsap.utils.selector(sectionRef);
      const stage = sectionRef.current;
      const badge = select('[data-day-badge]')[0];
      const list = select('[data-timeline-list]')[0];
      const items = select('[data-timeline-item]');
      const nodes = select('[data-timeline-node]');
      const firstNode = nodes[0];
      const lastItem = items.at(-1);
      const lastNode = nodes.at(-1);

      if (!stage || !badge || !list || !firstNode || !lastItem || !lastNode) {
        return;
      }

      const media = gsap.matchMedia();

      // 모션을 줄여달라는 기기에서는 판이 박히지 않아, 문구도 로고도 이력도 처음 자리에 그대로 있는다
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({
          // 스크롤에 그대로 매달리는 연출이라, 가속이 붙으면 손끝과 화면이 어긋나 보인다
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            // 판 윗변이 화면 꼭대기에 닿는 순간 붙잡는다
            start: 'top top',
            // 붙잡힌 채 굴릴 스크롤 거리가 화면 높이의 6.9배. 마디 5개를 하나씩 세우고 다시 말아 없애는 데 이만큼이 든다
            end: '+=690%',
            pin: true,
            // 1이라 손을 떼도 1초쯤 더 따라와, 스크롤이 튈 때 화면이 같이 튀지 않는다
            scrub: 1,
            // 창 크기가 바뀌면 타임라인을 얼마나 내려 시작할지 다시 잰다
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
              scale: 0,
              // 왼쪽 끝을 붙박아 오므려야 첫 원이 설 그 점으로 정확히 빨려 들어간다
              transformOrigin: 'left center',
              // back.in(2.4)라 한 번 부풀었다 꺼져, 첫 원이 뜰 때와 정확히 뒤집힌 '뿅'이 된다
              ease: 'back.in(2.4)',
              duration: 0.5,
            },
            3.6
          )
          // 문구가 4.1에 꺼지고 4.2에 첫 마디가 그 자리에 선다. 여기서부터 마디 하나가 1.2씩 차지한다
          .fromTo(
            select('[data-timeline-node]'),
            { scale: 0 },
            {
              scale: 1,
              // back.out(2.4)라 목표 크기를 한 번 넘겼다 돌아와 '뿅' 하고 튄다. 낮추면 튐이 잦아든다
              ease: 'back.out(2.4)',
              duration: 0.4,
              // each 1.2가 마디 하나에 주는 스크롤 몫. 앞 마디의 줄기가 다 내려온 순간 다음 원이 선다
              stagger: { each: 1.2 },
            },
            4.2
          )
          // 원이 다 서고 나서 가지가 뻗는다
          .fromTo(
            select('[data-timeline-branch]'),
            { scaleX: 0 },
            { scaleX: 1, duration: 0.3, stagger: { each: 1.2 } },
            4.6
          )
          // 가지가 절반쯤 뻗었을 때 문구가 따라 붙어, 가지가 문구를 끌고 오는 것처럼 보인다
          .fromTo(
            select('[data-timeline-copy]'),
            { opacity: 0, x: -16 },
            { opacity: 1, x: 0, duration: 0.45, stagger: { each: 1.2 } },
            4.75
          )
          // 줄기는 위에서 아래로 자란다. 0.5가 다음 원에 닿기까지 걸리는 시간
          .fromTo(
            select('[data-timeline-stem]'),
            { scaleY: 0 },
            { scaleY: 1, duration: 0.5, stagger: { each: 1.2 } },
            4.9
          )
          // 판을 내려 시작해야 첫 원이 문구가 꺼진 화면 한가운데에 선다. 다 그리는 동안 y 0으로 돌아와 전체가 가운데 놓인다
          .fromTo(
            list,
            {
              y: () => {
                return list.offsetHeight / 2 - firstNode.offsetHeight / 2;
              },
            },
            { y: 0, duration: 4.6 },
            4.2
          )
          // 마지막 문구가 10.0에 끝난다. 여기서부터가 판을 비우고 다음 섹션에 넘기는 퇴장
          // 문구가 먼저 빠져야 남은 원들만 굴러 내려가는 게 보인다
          .to(
            select('[data-timeline-copy]'),
            { opacity: 0, x: -16, duration: 0.3, stagger: { each: 0.06 } },
            10.2
          )
          // 가지와 줄기는 그린 방향 그대로 제 원 쪽으로 되말려 들어간다
          .to(
            select('[data-timeline-branch]'),
            { scaleX: 0, duration: 0.3, stagger: { each: 0.06 } },
            10.2
          )
          .to(
            select('[data-timeline-stem]'),
            { scaleY: 0, duration: 0.3, stagger: { each: 0.06 } },
            10.2
          )
          // 줄기를 오므려도 transform이라 아래 마디를 끌어당기지 못한다. 마디마다 y를 직접 줘야 한 점에 포개진다
          // 마지막 마디 자리로 모아야 DOM 순서상 그 마디가 맨 위에 남아, 더미가 로고 하나로 보인다
          .to(
            items,
            {
              y: (index, item: HTMLElement) => {
                return lastItem.offsetTop - item.offsetTop;
              },
              // power2.in이라 굴러갈수록 빨라져 마지막에 탁 포개진다
              ease: 'power2.in',
              duration: 0.6,
              // each 0.08이 마디가 넘어가는 시차. 맨 위부터 차례로 떨어져 아래로 말리는 것처럼 보인다
              stagger: { each: 0.08 },
            },
            10.5
          )
          // 포개진 더미를 판 한가운데로 끌어와 거기서 꺼뜨린다. 다음 섹션 첫 판이 같은 자리에서 튀어나온다
          .to(
            list,
            {
              x: () => {
                return (
                  stage.offsetWidth / 2 -
                  (lastNode.getBoundingClientRect().left -
                    stage.getBoundingClientRect().left +
                    lastNode.offsetWidth / 2)
                );
              },
              y: () => {
                return (
                  stage.offsetHeight / 2 -
                  (lastNode.getBoundingClientRect().top -
                    stage.getBoundingClientRect().top +
                    lastNode.offsetHeight / 2)
                );
              },
              duration: 0.5,
            },
            11.3
          )
          // back.in(2.4)라 한 번 부풀었다 꺼진다. 배지가 첫 원으로 바뀔 때 쓴 그 '뿅'을 되돌려준다
          .to(nodes, { scale: 0, ease: 'back.in(2.4)', duration: 0.4 }, 11.5);
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
      {children}
    </section>
  );
}
