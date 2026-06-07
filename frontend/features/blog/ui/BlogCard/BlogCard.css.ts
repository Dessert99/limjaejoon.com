import { sprinkles } from '@/shared/styles/sprinkles.css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style, styleVariants } from '@vanilla-extract/css';

// 준정사각 post-card — 컬러 커버 + 본문. hover 시 떠오름(MD3 elevation 1→3).
export const card = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'large',
    bg: 'surfaceContainerLow',
  }),
  {
    overflow: 'hidden',
    boxShadow: tokens.elevation.level1,
    textDecoration: 'none',
    transition: `transform ${tokens.motion.durationMedium} ${tokens.motion.easingEmphasized}, box-shadow ${tokens.motion.durationMedium} ${tokens.motion.easingStandard}`,
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: tokens.elevation.level3,
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
]);

// 커버 공통 — 색은 cover 변형에서 부여
export const coverBase = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    position: 'relative',
    height: '108px',
  },
]);

// styleVariants: 커버 색을 container 역할 3종으로 회전(index % 3)
export const cover = styleVariants({
  primary: {
    background: color.primaryContainer,
    color: color.onPrimaryContainer,
  },
  secondary: {
    background: color.secondaryContainer,
    color: color.onSecondaryContainer,
  },
  tertiary: {
    background: color.tertiaryContainer,
    color: color.onTertiaryContainer,
  },
});

export type CoverTone = keyof typeof cover;
// 노출 순서 — BlogCard 가 index % 3 으로 회전 적용
export const COVER_TONES: CoverTone[] = ['primary', 'secondary', 'tertiary'];

export const coverGlyph = style({
  font: tokens.typescale.displaySmall,
  fontWeight: 600,
  opacity: 0.92,
  lineHeight: 1,
});

export const coverIco = style({
  position: 'absolute',
  right: '12px',
  bottom: '10px',
  opacity: 0.55,
});

export const body = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '8',
  }),
  {
    padding: '14px 16px 16px',
    flex: 1,
  },
]);

export const title = style([
  sprinkles({
    c: 'onSurface',
    margin: 'none',
  }),
  {
    font: tokens.typescale.titleMedium,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
]);

export const description = style([
  sprinkles({
    c: 'onSurfaceVariant',
    margin: 'none',
  }),
  {
    font: tokens.typescale.bodySmall,
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
]);

export const meta = sprinkles({
  marginTop: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8',
  paddingTop: '6',
});

export const tags = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6',
  }),
  {
    listStyle: 'none',
    minWidth: 0,
  },
]);

export const tag = style([
  sprinkles({
    c: 'primary',
    r: 'small',
    paddingBlock: '2',
    paddingInline: '8',
  }),
  {
    font: tokens.typescale.labelSmall,
    background: `color-mix(in oklab, ${color.primary} 12%, transparent)`,
    whiteSpace: 'nowrap',
  },
]);

export const date = style([
  sprinkles({
    c: 'onSurfaceVariant',
  }),
  {
    font: tokens.typescale.labelSmall,
    fontFamily: tokens.typeface.mono,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
]);
