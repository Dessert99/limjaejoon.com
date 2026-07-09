/** PostEditorForm 스타일 — metadata 입력, Markdown 편집, preview 를 한 흐름에 배치한다 */
import { style } from '@vanilla-extract/css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';

/** editor form root — 긴 글 작성 화면이라 세로 리듬을 넉넉히 둔다 */
export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x5' }),
]);

/** metadata grid — 반복 입력 필드를 넓은 화면에서 병렬 배치한다 */
export const grid = style([
  sprinkles({ display: 'grid', gap: 'x3' }),
  {
    gridTemplateColumns: '1fr',
    '@media': {
      'screen and (min-width: 768px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
    },
  },
]);

/** form field — label 과 control 을 붙여 빠르게 훑게 한다 */
export const field = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x1' }),
]);

/** field label — editor control 의 의미를 짧게 고정한다 */
export const label = style({
  color: vars.color.fg.muted,
  fontSize: '0.875rem',
  fontWeight: 600,
});

/** text input — admin form 의 기본 입력 모양 */
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

/** Markdown editor shell — CodeMirror 자체 높이를 화면 흐름에 맞춘다 */
export const editor = style({
  overflow: 'hidden',
  border: `1px solid ${vars.color.stroke.neutral}`,
  borderRadius: vars.radius.r2,
});

/** preview 영역 — 공개 renderer 와 같은 결과를 admin 에서 확인한다 */
export const preview = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x3' }),
  {
    padding: '1rem',
    border: `1px solid ${vars.color.stroke.neutral}`,
    borderRadius: vars.radius.r2,
    background: vars.color.bg.surface,
  },
]);

/** submit row — 저장 명령과 결과 상태를 같은 줄에 둔다 */
export const actions = style([
  sprinkles({ display: 'flex', alignItems: 'center', gap: 'x3' }),
]);

/** save button — editor 의 primary command */
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

/** submit status — 저장 요청 결과를 form 안에서만 알린다 */
export const status = style({
  color: vars.color.fg.muted,
  fontSize: '0.875rem',
});
