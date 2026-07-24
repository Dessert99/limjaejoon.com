/** SiteHeader 스타일 — sticky 상단바, 불투명 surface, active 네비 accent */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 상단 고정 헤더 — 로고·네비·액션을 양끝/중앙 배치 */
export const header = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'x4',
    px: 'x6',
    py: 'x3',
    bg: 'surface',
  }),
  {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    borderBottom: `1px solid ${vars.color.stroke.muted}`,
  },
]);

/** 워드마크 로고 — 홈 링크 */
export const logo = style({
  fontSize: vars.typography.fontSize[16],
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.fg.neutral,
  textDecoration: 'none',
});

/** 네비 영역 */
export const nav = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: 'x1',
  }),
]);

/** 네비 링크 — 기본은 muted, active·hover 시 강조 */
export const navLink = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    px: 'x3',
    py: 'x2',
    r: 'control',
  }),
  {
    fontSize: vars.typography.fontSize[14],
    fontWeight: vars.typography.fontWeight.medium,
    color: vars.color.fg.muted,
    textDecoration: 'none',
    transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
    '@media': {
      '(hover: hover) and (pointer: fine)': {
        selectors: {
          '&:hover': {
            background: vars.color.bg.surfaceMuted,
            color: vars.color.fg.neutral,
          },
        },
      },
    },
    selectors: {
      '&[data-active="true"]': {
        color: vars.color.fg.brand,
        fontWeight: vars.typography.fontWeight.semibold,
      },
      '&:focus-visible': {
        outline: `2px solid ${vars.color.stroke.brand}`,
        outlineOffset: vars.dimension.x0_5,
      },
    },
  },
]);

/** 우측 액션 영역 — GitHub·테마 토글 */
export const actions = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: 'x1',
  }),
]);
