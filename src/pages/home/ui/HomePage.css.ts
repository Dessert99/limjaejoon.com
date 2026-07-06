import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const main = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: { mobile: 'x6', tablet: 'x12' },
  }),
  {
    minHeight: '100vh',
    width: '100%',
  },
]);

export const panel = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x5',
    padding: { mobile: 'x6', tablet: 'x10' },
    borderRadius: 'r3',
    bg: 'surface',
  }),
  {
    width: 'min(100%, 42rem)',
    border: `1px solid ${vars.color.border}`,
  },
]);

export const eyebrow = style({
  color: vars.color.muted,
  fontSize: '0.875rem',
  fontWeight: 600,
});

export const title = style({
  color: vars.color.text,
  fontSize: '2rem',
  lineHeight: 1.1,
});

export const description = style({
  color: vars.color.muted,
  lineHeight: 1.7,
});

/** 랩 진입 링크 — 본문과 구분되는 액센트 컬러 */
export const labLink = style({
  color: vars.color.accent,
  fontWeight: 600,
});
