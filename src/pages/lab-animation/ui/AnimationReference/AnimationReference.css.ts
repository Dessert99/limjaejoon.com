/** AnimationReference — 정리 섹션 표·코드 블록 타이포 (transition 랩과 동형, 셋째 페이지에서 추출 검토) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x6' }),
]);

export const heading = style({
  fontSize: '1.5rem',
  fontWeight: 700,
  lineHeight: 1.2,
});

export const subheading = style({
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: 'monospace',
});

export const block = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x2' }),
]);

export const paragraph = style({
  color: vars.color.fg.muted,
  lineHeight: 1.7,
});

/** 표 — 모바일에서 열이 좁아지면 가로 스크롤로 도망갈 공간 */
export const tableWrap = style({
  overflowX: 'auto',
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem',
  lineHeight: 1.6,
});

export const th = style({
  padding: '0.5rem 0.75rem',
  textAlign: 'left',
  borderBottom: `1px solid ${vars.color.stroke.neutral}`,
  whiteSpace: 'nowrap',
});

export const td = style({
  padding: '0.5rem 0.75rem',
  verticalAlign: 'top',
  borderBottom: `1px solid ${vars.color.stroke.neutral}`,
  color: vars.color.fg.muted,
});

/** 표 안 코드 표기 — 속성명·키워드는 원문 그대로 보이게 */
export const code = style({
  fontFamily: 'monospace',
  fontSize: '0.8125rem',
  color: vars.color.fg.neutral,
  whiteSpace: 'nowrap',
});

/** 문법 예시 블록 */
export const codeBlock = style([
  sprinkles({ p: 'x4', r: 'r1' }),
  {
    margin: 0,
    overflowX: 'auto',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    background: vars.color.bg.canvas,
    border: `1px solid ${vars.color.stroke.neutral}`,
  },
]);
