/** 테마 변경을 클릭 지점 중심의 일렁이는 원형 확산 뷰 트랜지션으로 감싸는 연출 유틸 */
import { motion } from '@/shared/styles';
import {
  createRippleKeyframes,
  type RevealOrigin,
} from './createRippleKeyframes';

export type { RevealOrigin };

/** apply(테마 변경)를 원형 확산으로 감싼다 — 미지원·모션 축소 환경은 연출 없이 즉시 반영 */
export const withCircularReveal = (apply: () => void, origin: RevealOrigin) => {
  // 연출은 부가 기능 — 어떤 환경에서도 테마 변경 자체는 막지 않는다
  if (
    !document.startViewTransition ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    apply();
    return;
  }

  const transition = document.startViewTransition(apply);
  transition.ready
    .then(() => {
      // 클릭 지점에서 가장 먼 모서리까지 닿아야 화면 전체가 덮인다
      const radius = Math.hypot(
        Math.max(origin.x, innerWidth - origin.x),
        Math.max(origin.y, innerHeight - origin.y)
      );
      document.documentElement.animate(
        { clipPath: createRippleKeyframes(origin, radius) },
        {
          duration: Number.parseInt(motion.themeReveal.duration, 10),
          easing: motion.themeReveal.easing,
          // 새 테마 스냅샷만 잘라 보여준다 — 옛 화면은 그 밑에 그대로
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    .catch(() => {
      // 전환이 스킵되면(연속 클릭 등) ready가 reject된다 — 연출만 생략
    });
};
