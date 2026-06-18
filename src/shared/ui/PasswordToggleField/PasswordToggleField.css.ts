/** PasswordToggleField — 비밀번호 입력 + 가시성 토글 (정적; 포커스 링 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 입력 — 일반 텍스트 필드 모양, 포커스 시 accent 테두리 */
export const input = style([
  sprinkles({ px: '12', py: '8', r: 'md' }),
  {
    background: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
    color: vars.color.text,
    outline: 'none',
    selectors: {
      '&:focus': { borderColor: vars.color.accent },
    },
  },
]);

/** 토글 — 보기/숨기기 버튼, 테두리 없이 약한 색 */
export const toggle = style([
  sprinkles({ px: '8', py: '8', r: 'sm' }),
  {
    background: 'transparent',
    border: 'none',
    color: vars.color.muted,
    cursor: 'pointer',
    outline: 'none',
    selectors: {
      '&:focus-visible': { color: vars.color.accent },
    },
  },
]);
