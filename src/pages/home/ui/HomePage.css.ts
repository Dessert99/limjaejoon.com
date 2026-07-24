/** HomePage 스타일 — 섹션을 세로로 쌓는 중앙 정렬 콘텐츠 컬럼 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { style } from '@vanilla-extract/css';

/** 홈 본문 — 최대 폭 제한 콘텐츠 컬럼, 섹션 간 여백 */
export const main = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: { mobile: 'x10', tablet: 'x16' },
    paddingBlock: { mobile: 'x10', tablet: 'x16' },
    paddingInline: { mobile: 'x6', tablet: 'x8' },
  }),
  {
    width: 'min(100%, 56rem)',
    marginInline: 'auto',
  },
]);
