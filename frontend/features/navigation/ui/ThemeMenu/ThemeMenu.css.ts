import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
});

// 아이콘 버튼 (app bar 액션) — state layer 는 컴포넌트에서 recipes 의 stateLayer 합성
export const triggerBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: tokens.shape.full,
  border: 'none',
  background: 'transparent',
  color: color.onSurfaceVariant,
  cursor: 'pointer',
});

const popIn = keyframes({
  from: { opacity: 0, transform: 'scale(0.92) translateY(-4px)' },
  to: { opacity: 1, transform: 'none' },
});

// 팝오버 메뉴 — surface-container 톤 + elevation 2 (MD3 menu)
export const popover = style({
  position: 'absolute',
  right: 0,
  top: '48px',
  zIndex: 40,
  minWidth: '180px',
  padding: '8px 0',
  background: color.surfaceContainer,
  borderRadius: tokens.shape.extraSmall,
  boxShadow: tokens.elevation.level2,
  transformOrigin: 'top right',
  animation: `${popIn} ${tokens.motion.durationShort} ${tokens.motion.easingEmphasized}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const menuLabel = style({
  font: tokens.typescale.labelMedium,
  color: color.onSurfaceVariant,
  padding: '4px 16px 8px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

// 메뉴 항목 — state layer 는 컴포넌트에서 합성. 선택 시 primary 강조
export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  height: '44px',
  paddingInline: '16px',
  color: color.onSurface,
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
});

export const itemLabel = style({
  flex: 1,
});

export const checkIcon = style({
  color: color.primary,
});
