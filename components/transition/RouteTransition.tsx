'use client';

import { gsap } from '@/lib/motion/gsap';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { routeLabel } from './routeLabel';

const SWEEP = { duration: 1, ease: 'power2.inOut' } as const;

const CURVE = {
  flat: '0% 0% 0% 0%',
  bottom: '0% 0% 50% 50%',
  top: '50% 50% 0% 0%',
} as const;

const CURTAIN_CLASS =
  'fixed inset-x-0 bottom-full z-(--ds-z-transition) flex h-dvh items-center justify-center bg-background';

const LABEL_CLASS = 'font-display text-section text-foreground';

type Phase = 'idle' | 'covering' | 'navigating';

const StartContext = createContext<((href: string) => void) | null>(null);

export function useCurtainStart() {
  return useContext(StartContext);
}

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
    setLabel(routeLabel(href));
    setPhase('covering');
  };

  useEffect(() => {
    const curtain = curtainRef.current;

    if (!curtain || phase !== 'covering') {
      return;
    }

    const tween = gsap.fromTo(
      curtain,
      { borderRadius: CURVE.bottom },
      {
        ...SWEEP,
        yPercent: 100,
        borderRadius: CURVE.flat,
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
      { borderRadius: CURVE.flat },
      {
        ...SWEEP,
        yPercent: 200,
        borderRadius: CURVE.top,
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
