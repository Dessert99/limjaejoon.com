'use client';

/** 텍스트 등장 — 각 조각의 바깥이 overflow, 안쪽이 y 를 소유한다 */
import { Fragment, useRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/lib';
import { MOTION, gsap, useGSAP } from '@/shared/motion';

/** character 는 조각 사이에 줄바꿈 기회가 없다 — 한 줄에 들어가는 짧은 문구에만 쓴다 */
type RevealUnit = 'line' | 'word' | 'character';

/** ref 는 열지 않는다 — 루트 ref 는 애니메이션 scope 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
type RevealTextProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  children: string;
  unit?: RevealUnit;
  once?: boolean;
};

// line 은 블록으로 쌓이고 word·character 는 줄 안에서 흘러야 한다
const UNIT_DISPLAY = {
  line: 'block',
  word: 'inline-block',
  character: 'inline-block',
} as const;

// 코드 포인트가 아니라 사람이 한 글자로 보는 단위로 자른다 — Array.from 은 결합 악센트·ZWJ 이모지를 흩어놓는다
const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

/** 줄은 개행 기준이다 — 렌더 폭에 따른 실제 줄바꿈 위치는 측정 없이 알 수 없다 */
const splitText = (text: string, unit: RevealUnit): string[] => {
  if (unit === 'line') {
    return text.split('\n');
  }

  if (unit === 'word') {
    return text.split(' ');
  }

  return Array.from(graphemes.segment(text), (segment) => {
    return segment.segment;
  });
};

/** 문장을 조각내 순차로 밀어 올리는 등장 — 조각은 장식이고 원문은 sr-only 사본이 담당한다 */
export function RevealText({
  children,
  unit = 'line',
  once = true,
  className,
  ...rest
}: RevealTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const parts = splitText(children, unit);
  const display = UNIT_DISPLAY[unit];

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 오버행만큼 더 내려야 한다 — 100% 만 내리면 디센더 여백에 글자 윗동이 비친다
        const overhang =
          getComputedStyle(root).getPropertyValue('--mask-overhang').trim() ||
          '0px';

        gsap.from('[data-reveal]', {
          yPercent: 100,
          y: overhang,
          duration: MOTION.duration.reveal,
          ease: MOTION.ease.reveal,
          // amount 가 총 시차를 자른다 — 조각이 많아도 마지막이 하염없이 밀리지 않는다
          stagger: { each: MOTION.stagger.step, amount: MOTION.stagger.total },
          scrollTrigger: { trigger: root, start: 'top 85%', once },
        });
      });

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <span
      ref={rootRef}
      className={cn('block break-keep', className)}
      {...rest}>
      <span className='sr-only'>{children}</span>
      <span aria-hidden='true'>
        {parts.map((part, index) => {
          return (
            <Fragment key={`${index}-${part}`}>
              <span className={cn('mask-track', display)}>
                {/* 은닉 스타일이 마크업에 없다 — gsap.from 이 마운트 뒤에 시작 상태를 심는다 */}
                <span
                  data-reveal=''
                  className={cn(
                    display,
                    // 공백 자체가 조각이 되는 유일한 단위라 접힘을 막아야 한다
                    unit === 'character' && 'whitespace-pre'
                  )}>
                  {part}
                </span>
              </span>
              {/* 어절 사이 공백은 트랙 밖의 진짜 텍스트 노드여야 한다 — 안에 넣으면 접히고 줄바꿈 기회도 사라진다 */}
              {unit === 'word' && index < parts.length - 1 ? ' ' : null}
            </Fragment>
          );
        })}
      </span>
    </span>
  );
}
