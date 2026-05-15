import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

// 검색 입력창 — 단일 accent 규칙: 포커스 시에만 teal 보더, 평소엔 중립
export const input = style({
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: vars.fontSize.base,
  color: vars.color.textPrimary,
  backgroundColor: vars.color.bgSoft,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.xl,
  outline: 'none',
  transition: 'border-color 150ms ease',
  ':focus-visible': {
    borderColor: vars.color.accentStrong,
  },
  '::placeholder': {
    color: vars.color.textMuted,
  },
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize.lg,
      padding: '0.875rem 1.25rem',
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
