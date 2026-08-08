'use client';

/** 경과일 카운터 — 스택 섹션을 여는 문장. 숫자만 소유한다 */
import { useRef } from 'react';
import { DEV_START } from '../../config/stack';
import { countDaysSince } from '../../lib/countDaysSince';
import { gsap, useGSAP } from '@/shared/motion';

/** 0 에서 오늘까지 굴리는 데 쓰는 시간 — 일수가 늘어도 이 시간은 그대로다(값은 GSAP 이 소유한다) */
const ROLL = { duration: 2, ease: 'power2.out' } as const;

/** 자릿수 구분 — 서버가 심은 초기값과 굴러가는 값의 표기를 한 곳에서 맞춘다 */
const format = (days: number): string => {
  return days.toLocaleString('ko-KR');
};

type DevCounterProps = {
  days: number;
  titleId: string;
};

/** days 는 빌드 시점 값이다 — hydration 을 맞추려고 서버에서 받고, 오늘 값 보정은 마운트 뒤에 한다 */
export function DevCounter({ days, titleId }: DevCounterProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const count = countRef.current;

      if (!count) {
        return;
      }

      // 정적 페이지라 서버 값은 배포한 날에 굳는다 — 여기서 오늘로 고쳐야 오래 묵은 배포가 거짓말을 안 한다
      const today = countDaysSince(DEV_START, new Date());
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const rolled = { value: 0 };

        gsap.to(rolled, {
          ...ROLL,
          value: today,
          onUpdate: () => {
            count.textContent = format(Math.round(rolled.value));
          },
          // 히어로 아래라 로드 시점엔 화면 밖이다 — 스크롤로 닿을 때 굴려야 굴러가는 걸 본다
          scrollTrigger: { trigger: count, start: 'top 85%', once: true },
        });
      });

      // 감쇠에서는 굴리지 않는다 — 그래도 빌드 시점 값이 남으면 안 되므로 오늘 값으로 갈아 둔다
      media.add('(prefers-reduced-motion: reduce)', () => {
        count.textContent = format(today);
      });

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <h2
      id={titleId}
      ref={rootRef}
      className='font-display text-section text-balance text-foreground'>
      개발을 시작한 지 <span ref={countRef}>{format(days)}</span>일째입니다
    </h2>
  );
}
