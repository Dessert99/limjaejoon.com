import { bp } from '@/shared/styles/breakpoints';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

export const nav = style([
  sprinkles({
    display: 'none',
  }),
  {
    '@media': {
      [bp.lg]: {
        display: 'block',
        position: 'sticky',
        top: '10rem',
        // top(10rem) + 하단 여유(1rem) 만큼 빼야 TOC 박스가 뷰포트 안에 완전히 들어와 짤리지 않음
        maxHeight: 'calc(100vh - 11rem)',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        borderLeft: `1px solid ${color.outlineVariant}`,
        paddingLeft: '0.75rem',
      },
    },
  },
]);

export const title = style([
  sprinkles({
    c: 'onSurfaceVariant',
    marginBottom: '12',
  }),
  {
    font: tokens.typescale.labelMedium,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
]);

export const list = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '4',
  }),
  {
    listStyle: 'none',
  },
]);

export const link = style([
  sprinkles({
    display: 'block',
    c: 'onSurfaceVariant',
    paddingLeft: 'none',
  }),
  {
    font: tokens.typescale.bodyMedium,
    textDecoration: 'none',
    paddingBlock: '0.2rem',
    borderLeft: '2px solid transparent',
    marginLeft: '-0.8125rem',
    paddingInlineStart: '0.625rem',
    transition: 'color 150ms ease, border-color 150ms ease',
    ':hover': {
      color: color.onSurface,
    },
    ':focus-visible': {
      color: color.onSurface,
      borderLeftColor: color.primary,
    },
    selectors: {
      '&[data-active="true"]': {
        color: color.primary,
        borderLeftColor: color.primary,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
]);
