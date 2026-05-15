// IconToggleButton 스타일 — 도메인 비종속 토글 버튼 primitive
import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

// 기본 버튼 스타일 — pressed 상태에 따라 색상 전환
export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: vars.radius.full,
  border: '1px solid transparent',
  backgroundColor: 'transparent',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xl,
  cursor: 'pointer',
  transition:
    'color 150ms ease, background-color 150ms ease, border-color 150ms ease',

  ':hover': {
    backgroundColor: vars.color.bgElevated,
    borderColor: vars.color.lineStrong,
  },

  ':focus-visible': {
    outline: `2px solid ${vars.color.accentStrong}`,
    outlineOffset: '2px',
  },

  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },

  selectors: {
    // pressed 상태 — aria-pressed="true"로 CSS 선택
    '&[aria-pressed="true"]': {
      color: vars.color.accentStrong,
      backgroundColor: vars.color.accentSoft,
      borderColor: vars.color.accentStrong,
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
