/** NavigationMenu — 사이트 내비 바 + 트리거로 여는 링크 패널 (정적; 그림자·모션·Indicator·Viewport는 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 목록 — 항목을 가로로, 기본 목록 마커 제거하고 테두리로 감싼 바 */
export const list = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: 'x1',
    p: 'x1',
    r: 'r2',
  }),
  {
    listStyle: 'none',
    margin: 0,
    border: `1px solid ${vars.color.stroke.neutral}`,
    background: vars.color.bg.surface,
  },
]);

/** 항목 — 콘텐츠 패널의 위치 기준(relative); Portal을 안 쓰므로 CSS로 항목 아래 띄운다 */
export const item = style({ position: 'relative' });

/** 트리거 — 패널을 여는 메뉴 이름, 열림(data-state) 시 accent 배경 */
export const trigger = style([
  sprinkles({ px: 'x3', py: 'x1_5', r: 'r1' }),
  {
    background: 'transparent',
    border: 'none',
    color: vars.color.fg.neutral,
    font: 'inherit',
    cursor: 'pointer',
    outline: 'none',
    selectors: {
      '&[data-state="open"]': {
        background: vars.color.bg.brand,
        color: vars.color.fg.onBrand,
      },
    },
  },
]);

/** 패널 — 항목 바로 아래로 떨어지는 링크 묶음, 불투명 surface */
export const content = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x0_5',
    p: 'x2',
    r: 'r2',
  }),
  {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '0.25rem',
    minWidth: '12rem',
    background: vars.color.bg.surface,
    border: `1px solid ${vars.color.stroke.neutral}`,
  },
]);

/** 링크 — 내비/패널 공용, 현재 페이지(aria-current=page → data-active)는 accent 강조 */
export const link = style([
  sprinkles({ px: 'x2', py: 'x1_5', r: 'r1' }),
  {
    color: vars.color.fg.neutral,
    textDecoration: 'none',
    cursor: 'pointer',
    outline: 'none',
    selectors: {
      '&[data-active]': { color: vars.color.fg.brand, fontWeight: 600 },
    },
  },
]);
