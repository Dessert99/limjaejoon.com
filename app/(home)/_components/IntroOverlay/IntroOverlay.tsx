'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

// 탭이 살아 있는 동안 기억해, 홈으로 되돌아왔을 때 인트로를 두 번 재생하지 않는다
let played = false;

/** 첫 방문에서 인사말을 타이핑한 뒤 커튼처럼 걷히며 히어로를 여는 막. */
export function IntroOverlay() {
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

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const greeting = `안녕하세요.\n프론트엔드 개발자,\n임재준입니다.`;
        const typed = { chars: 0 };
        // 커튼이 걷히는 순간 히어로도 이어 움직이도록 막 바깥 요소를 미리 잡아둔다
        const track = document.querySelector('[data-marquee-track]');
        const panels = document.querySelectorAll('[data-glass-panel]');
        // 커튼 뒤에서 스크롤이 흐르면 히어로 등장 연출이 화면 밖에서 소진되는데, 터치 기기엔 스무더가 없어 문서를 직접 잠근다
        document.documentElement.style.overflow = 'hidden';

        gsap
          .timeline({
            onComplete: () => {
              document.documentElement.style.overflow = '';
            },
          })
          // 숫자 하나를 글자 수까지 밀어 타이핑을 흉내낸다. duration 1.2를 줄이면 급하게 쳐진다
          .to(typed, {
            duration: 1.2,
            ease: 'none',
            chars: greeting.length,
            onUpdate: () => {
              text.textContent = greeting.slice(0, Math.round(typed.chars));
            },
          })
          // 다 읽을 틈으로 0.5초를 준 뒤, 아래쪽이 50%로 둥글게 말리며 위로 빠진다
          .fromTo(
            root,
            { borderRadius: '0% 0% 0% 0%' },
            {
              yPercent: -100,
              borderRadius: '0% 0% 50% 50%',
              duration: 1.2,
              ease: 'power3.inOut',
            },
            '+=0.5'
          )
          // 끝의 '<' 숫자를 키우면 머퀴가 커튼을 더 늦게 따라 올라온다
          .from(
            track,
            { yPercent: 120, duration: 1, ease: 'power3.out' },
            '<0.2'
          )
          // back.out 괄호 안 숫자를 키우면 패널이 더 크게 튄다
          .from(
            panels,
            {
              scale: 0.4,
              opacity: 0,
              duration: 0.7,
              ease: 'back.out(1)',
              // stagger를 키우면 패널이 하나씩 또렷하게 떨어져 등장한다
              stagger: 0.12,
            },
            '<0.35'
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
      {/* JS가 죽으면 커튼이 걷히지 못해 화면을 영영 덮으므로, CSS만으로 먼저 치운다 */}
      <noscript>
        <style>{'[data-intro-overlay]{display:none}'}</style>
      </noscript>

      <div
        ref={rootRef}
        data-intro-overlay=''
        data-testid='intro-overlay'
        aria-hidden='true'
        className='fixed inset-0 z-(--z-transition) flex items-center justify-center bg-home-background px-home-gutter motion-reduce:hidden'>
        <span
          ref={textRef}
          className='text-center font-display text-home-intro text-balance whitespace-pre-line text-home-foreground'
        />
      </div>
    </>
  );
}
