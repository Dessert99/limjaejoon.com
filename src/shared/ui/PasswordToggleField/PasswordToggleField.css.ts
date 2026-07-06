/** PasswordToggleField — 비밀번호 입력 + 가시성 토글 (정적; 포커스 링 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 입력 — 일반 텍스트 필드 모양, 포커스 시 accent 테두리 */
export const input = style([
  sprinkles({ px: 'x3', py: 'x2', r: 'r2' }),
  {
    background: vars.color.bg.surface,
    border: `1px solid ${vars.color.stroke.neutral}`,
    color: vars.color.fg.neutral,
    outline: 'none',
    selectors: {
      '&:focus': { borderColor: vars.color.stroke.brand },
    },
  },
]);

/** 토글 — 보기/숨기기 버튼, 테두리 없이 약한 색 */
export const toggle = style([
  sprinkles({ px: 'x2', py: 'x2', r: 'r1' }),
  {
    background: 'transparent',
    border: 'none',
    color: vars.color.fg.muted,
    cursor: 'pointer',
    outline: 'none',
    selectors: {
      '&:focus-visible': { color: vars.color.fg.brand },
    },
  },
]);
