import { globalStyle, style } from '@vanilla-extract/css';
import { bp } from './breakpoints';
import { vars } from './theme.css';

export const surfaceCard = style({
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.lg,
  background: vars.color.bgSurface,
  boxShadow: vars.shadow.cardSm,
});

export const surfaceSubtle = style({
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.md,
  background: vars.color.bgSoft,
});

export const contentLayout = style({
  '@media': {
    [bp.lg]: {
      display: 'grid',
      gridTemplateColumns: '1fr 15rem',
      gap: '2rem',
    },
  },
});

export const tocAside = style({
  display: 'none',
  '@media': {
    [bp.lg]: {
      display: 'block',
    },
  },
});

// prose 셀렉터를 받아 heading-anchor 관련 globalStyle을 등록
export function applyHeadingAnchorStyles(prose: string) {
  globalStyle(`${prose} :is(h1, h2, h3)[id]`, {
    scrollMarginTop: '5rem',
  });

  globalStyle(`${prose} .heading-anchor`, {
    color: vars.color.textMuted,
    textDecoration: 'none',
    opacity: 0,
    marginRight: '0.375rem',
    fontWeight: 400,
    transition: 'opacity 150ms ease, color 150ms ease',
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  });
  globalStyle(`${prose} :is(h1, h2, h3):hover .heading-anchor`, {
    opacity: 1,
  });
  globalStyle(`${prose} .heading-anchor:hover`, {
    color: vars.color.accentStrong,
  });
  globalStyle(`${prose} .heading-anchor:focus-visible`, {
    opacity: 1,
    color: vars.color.accentStrong,
  });
}
