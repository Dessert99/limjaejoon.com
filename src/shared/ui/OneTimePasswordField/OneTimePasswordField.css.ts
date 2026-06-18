/** OneTimePasswordField — 인증코드 입력 칸 묶음 (정적; 포커스 링 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 묶음 — 칸을 가로로 일정 간격 배치 */
export const root = sprinkles({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8',
});

/** 칸 — 글자 하나짜리 정사각 입력, 포커스 시 accent 테두리 */
export const input = style([
  sprinkles({ r: 'md' }),
  {
    width: '2.5rem',
    height: '2.75rem',
    textAlign: 'center',
    fontSize: '1.125rem',
    background: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
    color: vars.color.text,
    outline: 'none',
    selectors: {
      '&:focus': { borderColor: vars.color.accent },
    },
  },
]);
