/** semantic motion tokens — 실제 UI 피드백 의도를 이름으로 고정한다 */
import { duration } from './duration';
import { easing } from './easing';

/** semantic motion alias shape — duration/easing 쌍을 고정한다 */
export interface MotionAlias {
  duration: string;
  easing: string;
}

/** semantic motion aliases — 전환 의도를 duration/easing 쌍으로 고정한다 */
export const motion = {
  colorTransition: {
    duration: duration.d3,
    easing: easing.standard,
  },
  controlFeedback: {
    duration: duration.d3,
    easing: easing.enter,
  },
  overlayEnter: {
    duration: duration.d4,
    easing: easing.enter,
  },
  overlayExit: {
    duration: duration.d3,
    easing: easing.exit,
  },
  themeReveal: {
    duration: '2000ms',
    easing: 'ease-in-out',
  },
  tactilePress: {
    duration: duration.d1,
    easing: easing.enter,
  },
  tactileLift: {
    duration: duration.d6,
    easing: easing.spring,
  },
  controlSlide: {
    duration: duration.d6,
    easing: easing.springStrong,
  },
} as const satisfies Record<string, MotionAlias>;
