/** PostFilterForm 스타일 — 검색 조건을 한 줄 흐름으로 스캔하게 만든다 */
import { style } from '@vanilla-extract/css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';

/** 필터 form root — 모바일에서는 세로, 넓은 화면에서는 촘촘한 grid로 배치한다 */
export const root = style([
  sprinkles({
    display: 'grid',
    gap: 'x3',
    p: 'x4',
    r: 'r2',
  }),
  {
    gridTemplateColumns: '1fr',
    border: `1px solid ${vars.color.stroke.neutral}`,
    background: vars.color.bg.surface,
    '@media': {
      'screen and (min-width: 768px)': {
        gridTemplateColumns: 'minmax(12rem, 1.5fr) repeat(3, minmax(8rem, 1fr)) auto',
        alignItems: 'end',
      },
    },
  },
]);

/** 단일 필드 — label 과 control 을 붙여 반복 입력 시 시선을 줄인다 */
export const field = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x1' }),
]);

/** 필드 label — 작은 보조 텍스트로 컨트롤 의미만 고정한다 */
export const label = style({
  color: vars.color.fg.muted,
  fontSize: '0.8125rem',
  fontWeight: 600,
});

/** text/select control — URL form 전송용 native control 을 일관되게 보이게 한다 */
export const control = style({
  width: '100%',
  minHeight: '2.5rem',
  paddingInline: '0.75rem',
  border: `1px solid ${vars.color.stroke.neutral}`,
  borderRadius: vars.radius.r2,
  background: vars.color.bg.canvas,
  color: vars.color.fg.neutral,
  font: 'inherit',
});

/** submit button — filter form 의 유일한 명령 버튼 */
export const submit = style({
  minHeight: '2.5rem',
  paddingInline: '1rem',
  border: 0,
  borderRadius: vars.radius.r2,
  background: vars.color.bg.brand,
  color: vars.color.fg.onBrand,
  cursor: 'pointer',
  fontWeight: 700,
});
