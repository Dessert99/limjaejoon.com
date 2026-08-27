'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

/** 화면에 들어오는 순간 0부터 목표 일수까지 굴러 올라가는 숫자. */
export function DayCounter({ days }: { days: number }) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const number = numberRef.current;

      if (!number) {
        return;
      }

      const media = gsap.matchMedia();

      // 모션을 줄여달라는 기기에서는 이 블록이 통째로 안 돌아, 숫자가 처음부터 최종값으로 멈춰 있는다
      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 서버가 박아둔 최종 숫자를 0으로 되돌려야 스크롤이 닿는 순간 0에서 출발한다
        number.textContent = '0';

        const counted = { value: 0 };

        gsap.to(counted, {
          value: days,
          // duration 2가 다 세는 데 걸리는 초. 키우면 느긋하게 오래 굴러간다
          duration: 2,
          // power2.out이라 초반에 확 치솟고 목표 근처에서 잦아든다
          ease: 'power2.out',
          onUpdate: () => {
            number.textContent = Math.round(counted.value).toLocaleString(
              'ko-KR'
            );
          },
          scrollTrigger: {
            trigger: number,
            // 숫자 윗변이 화면 80% 높이에 닿으면 시작한다. 값을 줄이면 더 올라온 뒤에야 센다
            start: 'top 80%',
            // 되돌아가도 다시 세지 않는다
            once: true,
          },
        });

        // 설정이 도중에 바뀌어 이 블록이 걷힐 때, 0에서 멈춘 숫자를 최종값으로 되돌린다
        return () => {
          number.textContent = days.toLocaleString('ko-KR');
        };
      });

      return () => {
        return media.revert();
      };
    },
    { dependencies: [days] }
  );

  return (
    // tabular-nums라야 자릿수가 바뀌어도 숫자 폭이 흔들리지 않는다
    <p className='font-display text-6xl font-medium tracking-tight tabular-nums sm:text-8xl'>
      {/* inline-block이라야 clip-path가 걸린다. 인라인 상자에는 안 먹는다 */}
      <span
        data-day-label
        className='mr-3 inline-block text-base font-normal opacity-50 sm:text-xl'>
        개발을 시작한지
      </span>

      {/* 숫자와 '일'이 좌상단으로 함께 날아가야 해서 한 상자에 묶는다 */}
      <span
        data-day-badge
        className='inline-block'>
        <span ref={numberRef}>{days.toLocaleString('ko-KR')}</span>

        <span className='ml-3 text-2xl sm:text-4xl'>일</span>
      </span>
    </p>
  );
}
