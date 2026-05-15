// /tour/[contentId] 상세 페이지 스타일
import { globalStyle, style } from '@vanilla-extract/css';

import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';

export const container = style({
  paddingTop: '5rem',
  paddingLeft: vars.spacing.pagePadMobile,
  paddingRight: vars.spacing.pagePadMobile,
  paddingBottom: '3rem',
  maxWidth: '56rem',
  margin: '0 auto',
  '@media': {
    [bp.md]: {
      paddingLeft: vars.spacing.pagePad,
      paddingRight: vars.spacing.pagePad,
    },
  },
});

// 상단 이미지 영역 — 가로 전체, 16:9 비율
export const imageWrapper = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: vars.radius.xl,
  overflow: 'hidden',
  backgroundColor: vars.color.bgSoft,
  marginBottom: '1.5rem',
});

export const imagePlaceholder = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});

// 제목 + 위시리스트 버튼 행
export const titleRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '0.75rem',
  marginBottom: '0.5rem',
});

export const title = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  flex: 1,
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize['3xl'],
    },
  },
});

export const addr = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  marginBottom: '1.5rem',
});

// 구분선
export const divider = style({
  borderTop: `1px solid ${vars.color.lineSoft}`,
  marginBottom: '1.5rem',
});

// overview HTML 렌더 영역 — 외부 API HTML 그대로 표시
export const overview = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textSecondary,
  lineHeight: 1.8,
});

export const homepage = style({
  marginTop: '1rem',
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

// 외부 API가 주입하는 <a> 태그(우리 소유 클래스 아님)를 스타일링 — globalStyle로 descendant 셀렉터 표현
// vanilla-extract의 `selectors`는 자기 자신을 `&`에 두는 규칙만 허용해서 외부 HTML 자식 스타일은 globalStyle 필수
globalStyle(`${overview} a, ${homepage} a`, {
  color: vars.color.accentStrong,
  textDecoration: 'underline',
});

// intro raw 섹션 구분선 — 위 divider와 분리 위해 marginTop 보강
export const introDivider = style({
  borderTop: `1px solid ${vars.color.lineSoft}`,
  marginBottom: '1.5rem',
  marginTop: '1.5rem',
});

// intro raw 항목 — contentTypeId별 키-값 한 줄 표시
export const introItem = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  marginBottom: '0.5rem',
});
