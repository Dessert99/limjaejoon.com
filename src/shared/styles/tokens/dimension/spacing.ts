/** semantic spacing tokens — 레이아웃 의도를 이름으로 고정한다 */
import { dimension } from './scale';

/** semantic spacing aliases — raw dimension 과 사용 의도를 분리한다 */
export const spacing = {
  globalGutter: dimension.x4,
  componentDefault: dimension.x3,
  betweenText: dimension.x1_5,
  sectionGap: dimension.x8,
  cardPadding: dimension.x6,
  controlGap: dimension.x2,
} as const;
