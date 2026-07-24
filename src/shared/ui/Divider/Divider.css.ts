/** Divider — 콘텐츠 구획을 나누는 1px 기본 구분선 */
import { vars } from '@/shared/styles/theme.css';
import { createVar, style } from '@vanilla-extract/css';

/** 호출처가 color prop으로 덮을 수 있는 stroke 변수 */
export const dividerColor = createVar();

/** 호출처가 thickness prop으로 덮을 수 있는 두께 변수 */
export const dividerThickness = createVar();

/** 구분선 — horizontal은 block-size, vertical은 inline-size를 thickness로 쓴다 */
export const divider = style({
  border: 0,
  margin: 0,
  background: dividerColor,
  vars: {
    [dividerColor]: vars.color.stroke.neutral,
    [dividerThickness]: '1px',
  },
  selectors: {
    '&[data-orientation="horizontal"]': {
      width: '100%',
      height: dividerThickness,
    },
    '&[data-orientation="vertical"]': {
      alignSelf: 'stretch',
      width: dividerThickness,
      minHeight: '1em',
    },
    '&[data-inset]': {
      marginInline: vars.spacing.globalGutter,
      width: `calc(100% - (${vars.spacing.globalGutter} * 2))`,
    },
  },
});
