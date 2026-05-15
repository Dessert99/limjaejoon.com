// /tour 페이지 스타일 — 검색 입력 + 카드 그리드 + 상태 메시지
import { style } from '@vanilla-extract/css';

import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';

export const container = style({
  paddingTop: '5rem', // SiteHeader 고정 높이 보상
  paddingLeft: vars.spacing.pagePadMobile,
  paddingRight: vars.spacing.pagePadMobile,
  paddingBottom: '3rem',
  maxWidth: '80rem',
  margin: '0 auto',
  '@media': {
    [bp.md]: {
      paddingLeft: vars.spacing.pagePad,
      paddingRight: vars.spacing.pagePad,
    },
  },
});

export const heading = style({
  fontSize: vars.fontSize['3xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  marginBottom: '1.5rem',
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize['4xl'],
    },
  },
});

// 검색 input 래퍼
export const searchWrapper = style({
  marginBottom: '2rem',
});

export const searchInput = style({
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: vars.fontSize.base,
  color: vars.color.textPrimary,
  backgroundColor: vars.color.bgElevated,
  border: `1px solid ${vars.color.lineStrong}`,
  borderRadius: vars.radius.lg,
  outline: 'none',
  transition: 'border-color 150ms ease',

  ':focus': {
    borderColor: vars.color.accentStrong,
  },

  '::placeholder': {
    color: vars.color.textMuted,
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

// 카드 그리드 — mobile 2열, md 3열
export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
    },
  },
});

// 상태 메시지 (로딩 중, 끝, 결과 없음, 에러)
export const statusMsg = style({
  textAlign: 'center',
  padding: '2rem 0',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});

export const errorMsg = style({
  textAlign: 'center',
  padding: '2rem 0',
  color: vars.color.colorDanger,
  fontSize: vars.fontSize.sm,
  backgroundColor: vars.color.colorDangerSubtle,
  borderRadius: vars.radius.lg,
});

// 무한 스크롤 sentinel — 보이지 않는 1px 요소
export const sentinel = style({
  height: '1px',
  marginTop: '1rem',
});

// 빈 상태 안내
export const emptyState = style({
  textAlign: 'center',
  padding: '4rem 0',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
});
