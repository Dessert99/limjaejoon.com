import { bp } from '@/shared/styles/breakpoints';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

// MD3 top app bar — surface 톤, 스크롤 시 surface-container + elevation 1 로 떠오름
export const header = style([
  sprinkles({ bg: 'surface' }),
  {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    borderBottom: `1px solid ${color.outlineVariant}`,
    transition: `background-color ${tokens.motion.durationShort} ${tokens.motion.easingStandard}, box-shadow ${tokens.motion.durationShort} ${tokens.motion.easingStandard}`,
    selectors: {
      '&[data-scrolled="true"]': {
        background: color.surfaceContainer,
        borderBottomColor: 'transparent',
        boxShadow: tokens.elevation.level1,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
]);

export const inner = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '8',
    marginInline: 'auto',
    paddingInline: '16',
  }),
  {
    width: '100%',
    maxWidth: '80rem',
    height: '64px',
    '@media': {
      [bp.md]: {
        paddingInline: '6rem',
      },
    },
  },
]);

// 브랜드(아바타 + 워드마크) — full corner pill, state layer 합성
export const brand = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10',
    borderRadius: 'full',
  }),
  {
    textDecoration: 'none',
    padding: '4px 10px 4px 4px',
  },
]);

export const avatar = style([
  sprinkles({ borderRadius: 'full' }),
  {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    border: `1px solid ${color.outlineVariant}`,
  },
]);

export const wordmark = style([
  sprinkles({ c: 'onSurface' }),
  {
    font: tokens.typescale.titleLarge,
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
  },
]);

export const nav = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '4',
    marginLeft: '8',
  }),
  {
    flex: 1,
  },
]);

// nav 링크 — 활성/hover 시 primary 밑줄(scaleX 전환)
export const navLink = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: '14',
    c: 'onSurfaceVariant',
  }),
  {
    position: 'relative',
    height: '64px',
    textDecoration: 'none',
    font: tokens.typescale.titleSmall,
    whiteSpace: 'nowrap',
    transition: `color ${tokens.motion.durationShort} ${tokens.motion.easingStandard}`,

    '::after': {
      content: '""',
      position: 'absolute',
      left: '14px',
      right: '14px',
      bottom: 0,
      height: '3px',
      borderRadius: '3px 3px 0 0',
      background: color.primary,
      transform: 'scaleX(0)',
      transformOrigin: 'center',
      transition: `transform ${tokens.motion.durationMedium} ${tokens.motion.easingEmphasized}`,
    },

    ':hover': {
      color: color.onSurface,
    },

    selectors: {
      '&[data-active="true"]': {
        color: color.primary,
      },
      '&[data-active="true"]::after': {
        transform: 'scaleX(1)',
      },
      '&:hover::after': {
        transform: 'scaleX(1)',
      },
    },

    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
        selectors: {
          '&::after': {
            transition: 'none',
          },
        },
      },
    },
  },
]);

export const actions = sprinkles({
  display: 'flex',
  alignItems: 'center',
  gap: '4',
});

// 아이콘 버튼(GitHub) — state layer 는 컴포넌트에서 합성
export const iconBtn = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'full',
    c: 'onSurfaceVariant',
  }),
  {
    width: '40px',
    height: '40px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '22px',
  },
]);
