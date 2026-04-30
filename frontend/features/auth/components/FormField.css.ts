import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

// 폼 필드 전체 래퍼 — label/input/error를 수직으로 쌓는다
export const fieldWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
});

// 폼 레이블 — 소문자·뮤트 색으로 깔끔하게
export const label = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  fontWeight: 500,
});

// 필수 입력 표시 마크 — 시각 단서만 제공 (스크린리더는 aria-required로 인지)
export const requiredMark = style({
  color: vars.color.colorDanger,
  fontWeight: 600,
});

// 텍스트 입력 — 다크/라이트 양쪽에서 bgPage 기반, 포커스 시 accent 보더
export const input = style({
  width: '100%',
  padding: '0.625rem 0.75rem',
  fontSize: vars.fontSize.base,
  color: vars.color.textPrimary,
  background: vars.color.bgElevated,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.md,
  outline: 'none',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  boxSizing: 'border-box',

  // 포커스 시 accent 색 보더 + 미묘한 글로우
  ':focus': {
    borderColor: vars.color.accentStrong,
    boxShadow: `0 0 0 3px ${vars.color.accentSoft}`,
  },

  // 유효성 실패 시 danger 색 보더 (CSS 셀렉터 — aria-invalid 속성 기반)
  selectors: {
    '&[aria-invalid="true"]': {
      borderColor: vars.color.colorDanger,
    },
    '&[aria-invalid="true"]:focus': {
      boxShadow: `0 0 0 3px ${vars.color.colorDangerSubtle}`,
    },
    // disabled 상태 — 투명도 낮춤
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

// 에러 메시지 — danger 색 + xs 폰트 크기
export const errorMessage = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.colorDanger,
  lineHeight: 1.4,
});

// 헬퍼 텍스트 — 보조 설명용, 에러보다 연한 muted 색
export const helperMessage = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  lineHeight: 1.4,
});
