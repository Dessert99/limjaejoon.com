/** TransitionLabPage — 헤더와 2열 그리드 배치 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const main = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '32',
    px: { mobile: '20', tablet: '40' },
    py: '64',
  }),
  { width: '100%', maxWidth: '72rem', marginInline: 'auto' },
]);

export const header = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '8' })]);

export const eyebrow = style({
  color: vars.color.muted,
  fontSize: '0.875rem',
});

export const title = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  fontFamily: 'monospace',
  lineHeight: 1.1,
});

export const description = style({
  color: vars.color.muted,
  lineHeight: 1.7,
});

/** 본문 그리드 — 모바일 1열, 태블릿부터 컨트롤/프리뷰 2열 */
export const grid = style([
  sprinkles({ display: 'grid', gap: '32' }),
  {
    '@media': {
      'screen and (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' },
    },
  },
]);

export const column = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '24' })]);
