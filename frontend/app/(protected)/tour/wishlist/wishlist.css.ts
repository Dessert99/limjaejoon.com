// /tour/wishlist 페이지 스타일
import { style } from '@vanilla-extract/css';

import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';

export const container = style({
  paddingTop: '5rem',
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

// 위시리스트 카드 그리드 — mobile 2열, md 3열
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

// 개별 위시리스트 카드
export const card = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: vars.color.bgElevated,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.lineSoft}`,
  boxShadow: vars.shadow.cardSm,
  overflow: 'hidden',
});

export const imageWrapper = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  backgroundColor: vars.color.bgSoft,
  overflow: 'hidden',
});

export const imagePlaceholder = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
});

export const body = style({
  padding: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  flex: 1,
});

export const title = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.textPrimary,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const addr = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

// 삭제 버튼 — 카드 우상단 절대 위치
export const removeBtn = style({
  position: 'absolute',
  top: '0.5rem',
  right: '0.5rem',
  zIndex: 1,
});

// 빈 상태 안내
export const emptyState = style({
  textAlign: 'center',
  padding: '4rem 0',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
});

// 스켈레톤 로딩 — Suspense fallback용
export const skeletonGrid = style({
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

export const skeletonCard = style({
  borderRadius: vars.radius.xl,
  backgroundColor: vars.color.bgElevated,
  aspectRatio: '3 / 4',
  // 반짝이는 skeleton 애니메이션
  backgroundImage: `linear-gradient(90deg, ${vars.color.bgElevated} 25%, ${vars.color.bgSoft} 50%, ${vars.color.bgElevated} 75%)`,
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.5s infinite',
});
