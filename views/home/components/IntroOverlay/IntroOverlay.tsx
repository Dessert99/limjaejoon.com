'use client';

/** 진입 인트로 — 인사 문구를 타이핑하고 위로 걷힌다. 최초 페이지 로드 한 번만 재생한다 */
import { useEffect, useRef, useState } from 'react';
import { INTRO_GREETING } from '../../config/intro';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { MOTION } from '../../lib/motionPreset';

/** 문장 전체가 찍히는 데 쓰는 시간 — 글자 수가 바뀌어도 이 시간은 그대로다(값은 GSAP 이 소유한다) */
const TYPING = { duration: 2, ease: 'none' } as const;

/** 다 찍고 걷히기까지 멈추는 시간 — 문장을 읽을 틈 */
const HOLD = 0.5;

// 위로 빠지므로 뒤에 남는 변은 아랫변이다 — 50% 는 상자 절반을 타원으로 깎는 최대치라 거의 반원이 된다
const CURVE = { flat: '0% 0% 0% 0%', bottom: '0% 0% 50% 50%' } as const;

// 모듈 스코프 — 새로고침에만 초기화된다. 클라이언트 라우팅으로 홈에 돌아와도 다시 재생하지 않는다
let played = false;

const OVERLAY_CLASS =
  'fixed inset-0 z-(--ds-z-transition) flex items-center justify-center bg-background px-gutter motion-reduce:hidden';

// pre-line 이 없으면 문구의 개행이 공백 하나로 접힌다 — 반대로 pre 는 들여쓴 소스의 공백까지 살려 버린다
const TEXT_CLASS =
  'font-display text-section text-foreground text-balance whitespace-pre-line text-center';

/** 홈 최초 진입 연출 — 무대(ScrollStage) 밖에 둔다 */
export function IntroOverlay() {
  // 렌더는 플래그를 읽기만 한다 — 쓰기를 effect 로 미뤄야 서버 모듈 스코프가 요청 사이에 오염되지 않는다
  const [visible] = useState(() => {
    return !played;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    played = true;
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const text = textRef.current;

      if (!root || !text) {
        return;
      }

      const media = gsap.matchMedia();

      // 감쇠에서는 만들지 않는다 — 대신 오버레이가 CSS 로 접혀 화면을 막지 않는다
      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 글자 수를 트윈해 잘라 붙인다 — 한글은 폭이 일정하지 않아 CSS steps 타이핑이 문장 끝에서 어긋난다
        const typed = { chars: 0 };

        gsap
          .timeline()
          .to(typed, {
            ...TYPING,
            chars: INTRO_GREETING.length,
            onUpdate: () => {
              text.textContent = INTRO_GREETING.slice(
                0,
                Math.round(typed.chars)
              );
            },
          })
          .fromTo(
            root,
            { borderRadius: CURVE.flat },
            {
              yPercent: -100,
              borderRadius: CURVE.bottom,
              duration: MOTION.duration.cinematic,
              ease: MOTION.ease.cinematic,
            },
            `+=${HOLD}`
          );
      });

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* 걷는 주체가 GSAP 이라 스크립트가 없으면 검은 화면이 영구히 남는다 — 그 환경에서는 아예 그리지 않는다 */}
      <noscript>
        <style>{'[data-intro-overlay]{display:none}'}</style>
      </noscript>

      {/* 인트로는 장식이다 — 같은 인사를 히어로와 두 번 읽히지 않게 접근성 트리에서 뺀다 */}
      <div
        ref={rootRef}
        data-intro-overlay=''
        data-testid='intro-overlay'
        aria-hidden='true'
        className={OVERLAY_CLASS}>
        {/* 빈 채로 시작한다 — 문장을 미리 심으면 첫 페인트에 통째로 보였다가 타이핑이 되감는다 */}
        <span
          ref={textRef}
          className={TEXT_CLASS}
        />
      </div>
    </>
  );
}
