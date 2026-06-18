/** Tabs — 탭 줄(하단 경계선) + 활성 밑줄 전환 (정적; 페이드 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 묶음 — 탭 줄과 패널을 세로로 */
export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: '12' }),
]);

/** 탭 줄 — 하단 경계선 위에 트리거를 가로 정렬 */
export const list = style([
  sprinkles({ display: 'flex', gap: '4' }),
  { borderBottom: `1px solid ${vars.color.border}` },
]);

/** 트리거 — 비활성은 muted, 활성은 accent 밑줄 */
export const trigger = style([
  sprinkles({ px: '12', py: '8' }),
  {
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px', // 리스트 1px 경계선 위에 2px 밑줄을 겹쳐 정렬
    color: vars.color.muted,
    font: 'inherit',
    cursor: 'pointer',
    selectors: {
      '&[data-state="active"]': {
        color: vars.color.text,
        borderBottomColor: vars.color.accent,
      },
    },
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
]);

/** 패널 — 활성 탭의 본문 */
export const content = style({ color: vars.color.text });
