'use client';

// 'use client' 는 사실 진술이다 — 이 훅은 클라이언트에서만 돈다.
// 없으면 shared/lib 배럴을 거쳐 Server Component 그래프로 딸려 들어가 빌드가 깨진다.
/** 뷰포트 진입 감지 — scroll 리스너를 직접 달지 않고 IntersectionObserver 하나로만 본다 */
import { useEffect, useRef, useState } from 'react';

// 등장 시점은 rootMargin 한 곳으로만 늦춘다(아래 15%)
// threshold 는 0 이다 — 뷰포트보다 큰 요소는 비율이 임계치에 영원히 못 닿아 등장 자체가 사라진다
const IN_VIEW_DEFAULTS = {
  rootMargin: '0px 0px -15% 0px',
  threshold: 0,
  once: true,
} as const;

/** idle 은 "아직 JS 가 개입하지 않음" — 이 상태에만 은닉 스타일이 걸리지 않아 SSR·미지원 환경에서 콘텐츠가 남는다 */
export type InViewState = 'idle' | 'out' | 'in';

/** enabled=false 는 관찰 자체를 안 건다 — 트리거가 뷰포트가 아닐 때 관찰자를 헛돌리지 않기 위한 스위치다 */
type UseInViewOptions = {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
  enabled?: boolean;
};

/** 등장 애니메이션의 상태원 — CSS view timeline 은 되감으면 같이 되감겨 once 를 만들 수 없다 */
export const useInView = <T extends HTMLElement>({
  rootMargin = IN_VIEW_DEFAULTS.rootMargin,
  threshold = IN_VIEW_DEFAULTS.threshold,
  once = IN_VIEW_DEFAULTS.once,
  enabled = true,
}: UseInViewOptions = {}) => {
  const ref = useRef<T>(null);
  const [state, setState] = useState<InViewState>('idle');

  useEffect(() => {
    const element = ref.current;

    if (!element || !enabled) {
      return;
    }

    // 미지원 환경에서는 idle 에 머문다 — 은닉 규칙이 걸리지 않는 상태가 곧 안전한 폴백이다
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    // 은닉을 effect 본문에서 걸지 않고 관찰자의 최초 보고에 맡긴다
    // — 이미 화면에 보이던 요소는 out 을 거치지 않아 hydration 직후 튀지 않는다
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // 최초 보고는 threshold 와 무관하게 오므로 비율을 직접 본다 — isIntersecting 만 믿으면 1% 만 걸쳐도 등장이 끝난다
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            setState('in');
            // once 는 여기서 끝난다 — 되감아도 다시 숨지 않게 관찰을 끊는다
            if (once) {
              observer.unobserve(entry.target);
            }
          } else {
            setState('out');
          }
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, once, enabled]);

  return [ref, state] as const;
};
