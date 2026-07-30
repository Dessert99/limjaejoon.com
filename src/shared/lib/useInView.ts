/** 뷰포트 진입 감지 — scroll 리스너를 직접 달지 않고 IntersectionObserver 하나로만 본다 */
import { useEffect, useRef, useState } from 'react';
import { IN_VIEW_DEFAULTS } from './motionPreset';

/** idle 은 "아직 JS 가 개입하지 않음" — 이 상태에만 은닉 스타일이 걸리지 않아 SSR·미지원 환경에서 콘텐츠가 남는다 */
export type InViewState = 'idle' | 'out' | 'in';

type UseInViewOptions = {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
};

/** 등장 애니메이션의 상태원 — CSS view timeline 은 되감으면 같이 되감겨 once 를 만들 수 없다 */
export const useInView = <T extends HTMLElement>({
  rootMargin = IN_VIEW_DEFAULTS.rootMargin,
  threshold = IN_VIEW_DEFAULTS.threshold,
  once = IN_VIEW_DEFAULTS.once,
}: UseInViewOptions = {}) => {
  const ref = useRef<T>(null);
  const [state, setState] = useState<InViewState>('idle');

  useEffect(() => {
    const element = ref.current;

    if (!element) {
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
  }, [rootMargin, threshold, once]);

  return [ref, state] as const;
};
