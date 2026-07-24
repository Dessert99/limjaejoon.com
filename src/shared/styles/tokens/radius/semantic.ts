/** semantic radius tokens — UI 역할별 둥글기 */
import { radiusScale } from './scale';

/** semantic radius aliases — 컴포넌트 역할별 radius 이름 */
export const radius = {
  ...radiusScale,
  control: radiusScale.r2,
  card: radiusScale.r3,
  panel: radiusScale.r4,
  overlay: radiusScale.r3,
  pill: radiusScale.full,
} as const;
