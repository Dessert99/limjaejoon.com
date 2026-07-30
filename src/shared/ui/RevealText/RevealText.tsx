'use client';

/** 텍스트 등장 — 각 조각의 바깥이 overflow, 안쪽이 translate 를 소유한다(설계 7.3) */
import {
  Fragment,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from 'react';
import { cn, staggerIndex, useInView } from '@/shared/lib';

/** character 는 조각 사이에 줄바꿈 기회가 없다 — 한 줄에 들어가는 짧은 문구에만 쓴다 */
type RevealUnit = 'line' | 'word' | 'character';

/** ref 는 열지 않는다 — 루트 ref 는 관찰자 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
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
  const [ref, state] = useInView<HTMLSpanElement>({ once });
  const parts = splitText(children, unit);
  const display = UNIT_DISPLAY[unit];

  return (
    <span
      ref={ref}
      className={cn('block break-keep', className)}
      {...rest}>
      <span className='sr-only'>{children}</span>
      <span aria-hidden='true'>
        {parts.map((part, index) => {
          return (
            <Fragment key={`${index}-${part}`}>
              <span className={cn('mask-track', display)}>
                <span
                  // idle 에 해당하는 CSS 규칙은 없다 — 서버 렌더와 미지원 환경이 이 상태에 머문다
                  data-reveal={state}
                  style={{ '--stagger': staggerIndex(index) } as CSSProperties}
                  className={cn(
                    'transition-transform stagger-delay duration-slow ease-reveal',
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
