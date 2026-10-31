'use client';

import { gsap } from '@/lib/motion/gsap';

import { usePathname, useRouter } from 'next/navigation';

import type { ReactNode } from 'react';

import { useEffect, useRef, useState } from 'react';
import { routeLabel } from '@/domains/transition/lib/routeLabel';

import {
  CURTAIN_CLASS,
  LABEL_CLASS,
} from '@/domains/transition/config/curtain';

import type { Phase } from '@/domains/transition/types/transition.types';

import { StartContext } from '@/domains/transition/hooks/useCurtainStart';

export function RouteTransition({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('');
  const curtainRef = useRef<HTMLDivElement>(null);
  const hrefRef = useRef('');
  const fromPathRef = useRef('');
  const pathname = usePathname();
  const router = useRouter();

  const start = (href: string): void => {
    if (phase !== 'idle') {
      return;
    }

    hrefRef.current = href;
    fromPathRef.current = pathname;
    const route = routeLabel(href);

    // 서재 주소는 /library지만 메뉴 이름이 Blog라 커튼 글자도 blog로 맞춘다
    setLabel(route === 'library' ? 'blog' : route);
    setPhase('covering');
  };

  useEffect(() => {
    const curtain = curtainRef.current;

    if (!curtain || phase !== 'covering') {
      return;
    }

    const tween = gsap.fromTo(
      curtain,
      { borderRadius: '0% 0% 50% 50%' },
      {
        duration: 1,
        ease: 'power2.inOut',
        yPercent: 100,
        borderRadius: '0% 0% 0% 0%',
        onComplete: () => {
          setPhase('navigating');
          router.push(hrefRef.current);
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, [phase, router]);

  useEffect(() => {
    const curtain = curtainRef.current;

    if (
      !curtain ||
      phase !== 'navigating' ||
      pathname === fromPathRef.current
    ) {
      return;
    }

    const tween = gsap.fromTo(
      curtain,
      { borderRadius: '0% 0% 0% 0%' },
      {
        duration: 1,
        ease: 'power2.inOut',
        yPercent: 200,
        borderRadius: '50% 50% 0% 0%',
        onComplete: () => {
          gsap.set(curtain, { yPercent: 0 });
          setPhase('idle');
          setLabel('');
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, [phase, pathname]);

  return (
    <StartContext value={start}>
      {children}

      <div
        ref={curtainRef}
        data-testid='route-curtain'
        aria-hidden='true'
        className={CURTAIN_CLASS}>
        <span className={LABEL_CLASS}>{label}</span>
      </div>
    </StartContext>
  );
}
