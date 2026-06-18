/** HoverCard 패널 — 트리거 옆에 떠서 보조 정보를 담는 floating 카드 (정적; 그림자·모션 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 패널 — 페이지 콘텐츠 위로 뜨므로 불투명 surface 배경 필수, 테두리로 경계 */
export const content = style([
  sprinkles({ px: '16', py: '12', r: 'md' }),
  {
    background: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
    color: vars.color.text,
  },
]);
