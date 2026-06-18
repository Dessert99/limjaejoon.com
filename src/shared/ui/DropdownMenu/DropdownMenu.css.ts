/** DropdownMenu — 트리거로 여는 액션 메뉴 패널 + 항목·라벨·구분선 (정적; 그림자·모션 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 패널 — 페이지 위로 뜨므로 불투명 surface 배경, 항목을 감싸는 얇은 안쪽 여백 */
export const content = style([
  sprinkles({ p: '4', r: 'md' }),
  {
    minWidth: '8rem',
    background: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
  },
]);

/** 항목 — 한 줄 액션, 포커스(data-highlighted) 시 accent 배경으로 키보드 위치를 드러낸다 */
export const item = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    px: '8',
    py: '6',
    r: 'sm',
  }),
  {
    color: vars.color.text,
    cursor: 'pointer',
    outline: 'none',
    userSelect: 'none',
    selectors: {
      '&[data-highlighted]': {
        background: vars.color.accent,
        color: vars.color.accentForeground,
      },
      '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
]);

/** 라벨 — 항목 묶음의 제목, 약하게 죽인 색·작은 글자 */
export const label = style([
  sprinkles({ px: '8', py: '6' }),
  {
    fontSize: '0.8125rem',
    color: vars.color.muted,
  },
]);

/** 구분선 — 항목 사이 얇은 가로선 */
export const separator = style([
  sprinkles({ my: '4' }),
  {
    height: '1px',
    background: vars.color.border,
  },
]);
