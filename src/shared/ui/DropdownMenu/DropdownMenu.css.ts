/** DropdownMenu — 트리거로 여는 액션 메뉴 패널 + 항목·라벨·구분선 (모션 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { shadow } from '@/shared/styles/tokens';
import { style } from '@vanilla-extract/css';

/** 패널 — 페이지 위로 뜨므로 불투명 surface 배경, 뜬 느낌을 주는 raise 그림자 */
export const content = style([
  sprinkles({ p: 'x1', r: 'r2' }),
  {
    minWidth: '8rem',
    background: vars.color.bg.surface,
    border: `1px solid ${vars.color.stroke.muted}`,
    boxShadow: shadow.raise,
  },
]);

/** 항목 — 한 줄 액션, 포커스(data-highlighted) 시 옅은 surfaceMuted 배경으로 키보드 위치를 드러낸다 */
export const item = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    px: 'x2',
    py: 'x1_5',
    r: 'r1',
  }),
  {
    color: vars.color.fg.neutral,
    cursor: 'pointer',
    outline: 'none',
    userSelect: 'none',
    selectors: {
      '&[data-highlighted]': {
        background: vars.color.bg.surfaceMuted,
      },
      '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
]);

/** 라벨 — 항목 묶음의 제목, 약하게 죽인 색·작은 글자 */
export const label = style([
  sprinkles({ px: 'x2', py: 'x1_5' }),
  {
    fontSize: '0.8125rem',
    color: vars.color.fg.muted,
  },
]);

/** 구분선 — 항목 사이 얇은 가로선 */
export const separator = style([
  sprinkles({ my: 'x1' }),
  {
    height: '1px',
    background: vars.color.stroke.neutral,
  },
]);
