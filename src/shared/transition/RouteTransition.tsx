'use client';

/** 라우트 전환 커튼 — 덮고, 이동하고, 걷는다. TransitionLink 로 누른 링크만 이 흐름을 탄다 */
import { usePathname, useRouter } from '@/shared/lib';
import { gsap } from 'gsap';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { routeLabel } from './routeLabel';

/** 커튼이 한 번 오르내리는 시간 — 값은 GSAP 이 소유한다(CSS 토큰을 읽어 오지 않는다) */
const SWEEP = { duration: 1, ease: 'power2.inOut' } as const;

// 곡선은 상자 밖으로 부풀지 않고 안쪽을 깎는다 — 밖에 덧대면 대기 중인 커튼이 화면 끝에 걸린다
/** 가장자리 곡률 — 50% 는 상자 절반을 통째로 타원으로 깎는 최대치라 거의 반원이 된다 */
const CURVE = {
  flat: '0% 0% 0% 0%',
  bottom: '0% 0% 50% 50%',
  top: '50% 50% 0% 0%',
} as const;

// 커튼을 뷰포트 위에 세워 둔다 — 스크립트가 죽어도 화면을 덮지 않고, GSAP 은 제 높이만큼 내려 채운다
const CURTAIN_CLASS =
  'fixed inset-x-0 bottom-full z-(--ds-z-transition) flex h-dvh items-center justify-center bg-background';

const LABEL_CLASS = 'font-display text-section text-foreground';

/** 전환 단계 — 커튼이 내려오는 중(covering)과 목적지를 기다리는 중(navigating)을 가른다 */
type Phase = 'idle' | 'covering' | 'navigating';

const StartContext = createContext<((href: string) => void) | null>(null);

/** 커튼을 올리는 함수 — 프로바이더 밖에서는 null 이라 링크가 기본 이동으로 흐른다 */
export function useCurtainStart() {
  return useContext(StartContext);
}

/** 라우트 전환 커튼 — 루트 레이아웃에서 화면 전체를 감싼다 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('');
  const curtainRef = useRef<HTMLDivElement>(null);
  const hrefRef = useRef('');
  const fromPathRef = useRef('');
  const pathname = usePathname();
  const router = useRouter();

  const start = (href: string): void => {
    // 전환 중 클릭은 버린다 — 절반쯤 내려온 커튼 위에 새 타임라인이 겹친다
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

    // 내려오는 동안만 아랫변이 부푼다 — 다 덮은 순간 평평해야 깎인 모서리로 목적지가 새지 않는다
    const tween = gsap.fromTo(
      curtain,
      { borderRadius: CURVE.bottom },
      {
        ...SWEEP,
        yPercent: 100,
        borderRadius: CURVE.flat,
        // 다 덮은 뒤에 이동한다 — 먼저 밀면 목적지가 커튼 뒤에서 그려지다 새 화면이 비친다
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

    // pathname 이 바뀐 시점이 App Router 가 목적지를 커밋한 시점이다 — 그전까진 커튼이 로딩을 가린다
    if (
      !curtain ||
      phase !== 'navigating' ||
      pathname === fromPathRef.current
    ) {
      return;
    }

    // 걷히며 윗변이 부푼다 — 모서리부터 열리고 가운데가 가장 늦게 드러난다
    const tween = gsap.fromTo(
      curtain,
      { borderRadius: CURVE.flat },
      {
        ...SWEEP,
        yPercent: 200,
        borderRadius: CURVE.top,
        onComplete: () => {
          // 다음 전환을 위해 화면 위로 되돌린다 — 걷힌 자리에서 시작하면 아래에서 올라온다
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

      {/* 커튼은 장식이다 — 라우트가 바뀌었다는 안내는 Next 가 이미 한다 */}
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
