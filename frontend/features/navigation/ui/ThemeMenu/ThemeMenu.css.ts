import { sprinkles } from '@/shared/styles/sprinkles.css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
});

// 아이콘 버튼 (app bar 액션) — state layer 는 컴포넌트에서 recipes 의 stateLayer 합성
export const triggerBtn = style([
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
  },
]);

const popIn = keyframes({
  from: { opacity: 0, transform: 'scale(0.92) translateY(-4px)' },
  to: { opacity: 1, transform: 'none' },
});

// 팝오버 메뉴 — surface-container 톤 + elevation 2 (MD3 menu)
export const popover = style([
  sprinkles({
    paddingBlock: '8',
    paddingInline: 'none',
    bg: 'surfaceContainer',
    borderRadius: 'extraSmall',
  }),
  {
    position: 'absolute',
    right: 0,
    top: '48px',
    zIndex: 40,
    minWidth: '180px',
    boxShadow: tokens.elevation.level2,
    transformOrigin: 'top right',
    animation: `${popIn} ${tokens.motion.durationShort} ${tokens.motion.easingEmphasized}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },
  },
]);

export const menuLabel = style([
  sprinkles({ c: 'onSurfaceVariant' }),
  {
    font: tokens.typescale.labelMedium,
    padding: '4px 16px 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
]);

// 메뉴 항목 — state layer 는 컴포넌트에서 합성. 선택 시 primary 강조
export const item = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '12',
    paddingInline: '16',
    c: 'onSurface',
  }),
  {
    height: '44px',
    font: tokens.typescale.labelLarge,
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    selectors: {
      '&[aria-checked="true"]': {
        color: color.primary,
      },
    },
  },
]);

export const itemLabel = style({
  flex: 1,
});

export const checkIcon = sprinkles({
  c: 'primary',
});
