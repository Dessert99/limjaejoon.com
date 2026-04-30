import { style } from '@vanilla-extract/css';

import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';

// 페이지 컨테이너 — 모바일은 좌우 패딩만, md 이상은 가운데 정렬 + max-width
export const container = style({
  width: '100%',
  padding: '2rem 1.5rem',

  '@media': {
    [bp.md]: {
      maxWidth: '720px',
      margin: '0 auto',
      padding: '3rem 2rem',
    },
  },
});

// 페이지 제목
export const title = style({
  fontSize: vars.fontSize['3xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  marginBottom: '2rem',
  marginTop: 0,
});

// 정보 항목들의 컨테이너 — dl 시맨틱
export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  margin: 0,
  padding: 0,
});

// label-value 한 행 — 모바일은 column, md 이상은 row
export const row = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: '1rem',
  background: vars.color.bgElevated,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.md,

  '@media': {
    [bp.md]: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: '1.5rem',
    },
  },
});

// 항목 이름 (dt) — 보조 색상
export const label = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.textMuted,
  margin: 0,

  '@media': {
    [bp.md]: {
      minWidth: '100px',
    },
  },
});

// 항목 값 (dd) — 본문 톤
export const value = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textPrimary,
  margin: 0,
});
