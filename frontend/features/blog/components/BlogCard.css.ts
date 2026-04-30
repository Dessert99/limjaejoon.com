import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

// 카드 그리드 셀: 세로 flex로 제목·설명·메타를 배치, 메타는 marginTop:auto로 바닥 고정
export const card = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  textDecoration: 'none',
  padding: '1.125rem 1.25rem',
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.bgSurface,
  boxShadow: vars.shadow.cardSm,
  // 짧은 콘텐츠 카드도 그리드 행에서 너무 작아지지 않도록 최소 높이 보장
  minHeight: '12rem',
  transition:
    'transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 250ms ease, box-shadow 250ms ease',

  // 좌측 액센트 바: 평소 숨김, hover 시 위→아래로 펼쳐짐
  '::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '14px',
    bottom: '14px',
    width: '2px',
    background: vars.color.accentStrong,
    transform: 'scaleY(0)',
    transformOrigin: 'center',
    transition: 'transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  },

  ':hover': {
    transform: 'translateY(-2px)',
    borderColor: vars.color.accentStrong,
    boxShadow: vars.shadow.cardMd,
  },

  selectors: {
    '&:hover::before': {
      transform: 'scaleY(1)',
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: {
        '&::before': {
          transition: 'none',
        },
      },
    },
  },
});

// 제목: 2줄 클램프, hover 시 액센트 색으로 전환
export const title = style({
  fontSize: vars.fontSize.lg,
  fontWeight: 600,
  lineHeight: 1.35,
  color: vars.color.textPrimary,
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  transition: 'color 200ms ease',

  selectors: {
    [`${card}:hover &`]: {
      color: vars.color.accentStrong,
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

// 설명: 3줄 클램프
export const description = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  lineHeight: 1.6,
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

// 메타 라인: marginTop:auto로 카드 바닥에 고정, 태그·날짜를 가로 배치
export const meta = style({
  marginTop: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap',
  rowGap: '0.5rem',
});

export const tags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.25rem',
  listStyle: 'none',
});

export const tag = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.accentStrong,
  backgroundColor: vars.color.accentSoft,
  borderRadius: vars.radius.full,
  paddingInline: '0.5rem',
  paddingBlock: '0.125rem',
});

export const date = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  fontFeatureSettings: '"tnum"',
  flexShrink: 0,
  marginLeft: 'auto',
});
