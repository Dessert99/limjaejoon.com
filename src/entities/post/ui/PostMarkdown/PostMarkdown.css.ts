/** PostMarkdown prose 스타일 — 공개 상세와 editor preview가 같은 읽기 리듬을 공유한다 */
import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

/** Markdown root — prose 요소가 부모 레이아웃을 밀어내지 않게 폭을 잠근다 */
export const root = style({
  color: vars.color.fg.neutral,
  lineHeight: vars.typography.lineHeight.relaxed,
  overflowWrap: 'break-word',
});

globalStyle(`${root} > * + *`, {
  marginTop: vars.dimension.x4,
});

globalStyle(`${root} h1, ${root} h2, ${root} h3`, {
  lineHeight: 1.25,
});

globalStyle(`${root} a`, {
  color: vars.color.fg.brand,
});

globalStyle(`${root} code`, {
  fontFamily: vars.typography.fontFamily.mono,
});

globalStyle(`${root} pre`, {
  overflowX: 'auto',
  padding: vars.dimension.x4,
  borderRadius: vars.radius.r2,
  border: `1px solid ${vars.color.stroke.neutral}`,
});

globalStyle(`${root} img`, {
  maxWidth: '100%',
  height: 'auto',
});

globalStyle(`${root} table`, {
  display: 'block',
  maxWidth: '100%',
  overflowX: 'auto',
  borderCollapse: 'collapse',
});

globalStyle(`${root} th, ${root} td`, {
  padding: vars.dimension.x2,
  border: `1px solid ${vars.color.stroke.neutral}`,
});
