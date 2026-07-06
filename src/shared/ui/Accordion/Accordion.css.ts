/** Accordion 디스클로저 — 테두리 묶음 + 전폭 헤더 + 접이 패널 (정적; 슬라이드 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 묶음 — 세로 스택 + 테두리로 감싼 카드, 라운드에 항목 모서리 클립 */
export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', r: 'r2' }),
  {
    border: `1px solid ${vars.color.stroke.neutral}`,
    overflow: 'hidden',
  },
]);

/** 항목 — 항목 사이 구분선(마지막 항목은 생략) */
export const item = style({
  borderBottom: `1px solid ${vars.color.stroke.neutral}`,
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
});

/** 헤더 — Radix h3의 기본 마진 제거 */
export const header = style({ margin: 0 });

/** 트리거 — 전폭 클릭 영역, 라벨과 표식을 양끝 배치 */
export const trigger = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 'x4',
    py: 'x3',
  }),
  {
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: vars.color.fg.neutral,
    font: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
]);

/** 패널 — 열렸을 때만 마운트되는 본문 */
export const content = style([
  sprinkles({ px: 'x4', py: 'x3' }),
  { color: vars.color.fg.neutral },
]);
