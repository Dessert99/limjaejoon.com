// TourCard 스타일 — 검색 결과 그리드 카드
import { style } from '@vanilla-extract/css';

import { vars } from '@/styles/theme.css';

// 카드 컨테이너 — relative로 위시리스트 버튼 절대 위치 기준점
export const card = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: vars.color.bgElevated,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.lineSoft}`,
  boxShadow: vars.shadow.cardSm,
  overflow: 'hidden',
  transition: 'box-shadow 150ms ease, border-color 150ms ease',
  textDecoration: 'none',
  color: 'inherit',

  ':hover': {
    boxShadow: vars.shadow.cardMd,
    borderColor: vars.color.lineStrong,
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

// 이미지 영역 — 16:9 비율 고정
export const imageWrapper = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  backgroundColor: vars.color.bgSoft,
  overflow: 'hidden',
});

// 이미지 플레이스홀더 — 이미지 없을 때 배경색으로 채움
export const imagePlaceholder = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});

// 카드 본문 영역
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
  // 두 줄 클램프 — 긴 제목이 카드 높이를 깨지 않도록
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const addr = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  // 한 줄 클램프
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

// 위시리스트 버튼 — 카드 우상단 절대 위치
export const wishlistBtn = style({
  position: 'absolute',
  top: '0.5rem',
  right: '0.5rem',
  zIndex: 1,
});
