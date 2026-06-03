import { bp } from '@/shared/styles/breakpoints';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { keyframes, style } from '@vanilla-extract/css';

// 펼칠 때 검색 아이콘 버튼이 제자리에서 한 바퀴 도는 연출 (회전 끝난 뒤 컨테이너가 늘어남)
const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

// 검색창 컨테이너 — width 만 애니메이션해 "접힘(아이콘) ↔ 펼침(검색창)" 전환.
// 2단계 시퀀싱은 SearchBox.tsx 가 제어: 스핀(data-spinning) 종료 후 data-expanded
// 를 켜 width 확장. (CSS delay 로 순서 만들지 않음 — 시점은 JS 가 결정)
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  width: '2.75rem', // 접힘: 아이콘 1개만 들어가는 정사각
  height: '2.75rem',
  background: color.surfaceContainerHighest,
  border: `1px solid ${color.outlineVariant}`,
  borderRadius: tokens.shape.medium,
  color: color.onSurfaceVariant,
  overflow: 'hidden', // 접힘 동안 input·닫기버튼을 잘라내 자연스럽게 "자라나게"
  // 평소(접힐 때 포함) 전환: width 즉시 시작
  transition:
    'width 220ms ease, border-color 150ms ease, background-color 150ms ease, color 150ms ease',
  selectors: {
    // 펼침: 검색 행(searchWrap) 전체 너비로 확장 (스핀이 끝난 뒤 JS 가 켬)
    '&[data-expanded]': {
      width: '100%',
    },
    // 접힘 상태 hover = primary 강조
    '&:not([data-expanded]):hover': {
      color: color.primary,
      borderColor: color.primary,
    },
  },
  // 펼침 상태 포커스 = 보더만 primary(2px)
  ':focus-within': {
    borderColor: color.primary,
  },
  '@media': {
    [bp.md]: {
      height: '3rem',
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

// 선두 검색 아이콘 — 접힘일 땐 펼침 트리거 버튼. 색은 root 의 hover 색을 상속
export const searchBtn = style({
  flex: '0 0 auto',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.75rem',
  height: '2.75rem',
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  transition: 'color 150ms ease',
  selectors: {
    // 스핀 단계 동안 버튼(=아이콘) 1회 회전. 버튼은 투명·정사각이라 버튼째
    // 돌려도 가운데 아이콘만 도는 것처럼 보인다. 끝나면 JS 가 펼침으로 전환
    [`${root}[data-spinning] &`]: {
      animation: `${spin} 400ms ease`,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: {
        [`${root}[data-spinning] &`]: {
          animation: 'none',
        },
      },
    },
  },
});

// 검색 입력부 — 항상 마운트, 접힘일 땐 opacity 0 으로 숨김(width 전환과 분리)
export const input = style({
  flex: 1,
  minWidth: 0,
  height: '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: color.onSurface,
  font: tokens.typescale.bodyLarge,
  transition: 'opacity 150ms ease',
  selectors: {
    // 접힘일 땐 입력부를 투명하게 (overflow:hidden 와 함께 "사라진 듯" 보이게)
    [`${root}:not([data-expanded]) &`]: {
      opacity: 0,
    },
  },
  '::placeholder': {
    color: color.onSurfaceVariant,
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

// 닫기(X) — 펼침일 때만 노출. 클릭 시 접고 검색어 초기화(SearchBox.tsx)
export const collapseBtn = style({
  flex: '0 0 auto',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.75rem',
  height: '2.75rem',
  border: 'none',
  background: 'transparent',
  borderRadius: tokens.shape.full,
  color: color.onSurfaceVariant,
  cursor: 'pointer',
  transition:
    'opacity 150ms ease, color 150ms ease, background-color 150ms ease',
  ':hover': {
    color: color.primary,
  },
  selectors: {
    // 접힘일 땐 보이지도, 눌리지도 않게
    [`${root}:not([data-expanded]) &`]: {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
