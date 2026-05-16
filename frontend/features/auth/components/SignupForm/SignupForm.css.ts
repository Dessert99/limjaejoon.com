import { style } from '@vanilla-extract/css';
import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';

// 폼 전체 컨테이너 — 모바일 full-width, md 이상에서 400px 고정 + 가운데 정렬
export const formContainer = style({
  width: '100%',
  padding: '2rem 1.5rem',
  background: vars.color.bgElevated,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.xl,
  boxShadow: vars.shadow.cardMd,

  '@media': {
    [bp.md]: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '2.5rem 2rem',
    },
  },
});

// 폼 제목 — 2xl 크기
export const formTitle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  marginBottom: '1.5rem',
  marginTop: 0,
});

// 폼 필드들 사이의 수직 간격
export const fieldStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '1.5rem',
});

// 폼 상단 에러 배너 — role="alert" 영역, danger 배경
export const formError = style({
  padding: '0.75rem 1rem',
  marginBottom: '1rem',
  fontSize: vars.fontSize.sm,
  color: vars.color.colorDanger,
  background: vars.color.colorDangerSubtle,
  border: `1px solid ${vars.color.colorDanger}`,
  borderRadius: vars.radius.md,
  lineHeight: 1.5,
});

// 제출 버튼 — accent 배경, 전체 너비, 포커스·호버·disabled 상태 처리
export const submitButton = style({
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: vars.fontSize.base,
  fontWeight: 600,
  color: vars.color.bgPage,
  background: vars.color.accentStrong,
  border: 'none',
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  transition: 'opacity 150ms ease',

  // 호버 시 살짝 어둡게
  ':hover': {
    opacity: 0.88,
  },

  // 포커스 링 — 키보드 내비게이션 지원
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentStrong}`,
    outlineOffset: '2px',
  },

  // pending/disabled 시 커서 변경 + 투명도 낮춤
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});
