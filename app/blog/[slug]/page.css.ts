import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import {
  applyHeadingAnchorStyles,
  contentLayout,
  tocAside,
} from '@/styles/utils.css';
import { globalStyle, style } from '@vanilla-extract/css';

export { contentLayout, tocAside };

export const main = style({
  margin: '0 auto',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '85rem',
  paddingLeft: vars.spacing.pagePadMobile,
  paddingRight: vars.spacing.pagePadMobile,
  paddingBottom: '4rem',
  '@media': {
    [bp.md]: {
      paddingLeft: vars.spacing.pagePad,
      paddingRight: vars.spacing.pagePad,
    },
  },
});

export const header = style({
  marginBottom: '2.5rem',
  paddingBottom: '2rem',
  borderBottom: `1px solid ${vars.color.lineSoft}`,
});

export const date = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  display: 'block',
  marginBottom: '1rem',
});

export const title = style({
  fontSize: vars.fontSize['3xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  letterSpacing: '-0.025em',
  lineHeight: '1.3',
  marginBottom: '0.75rem',
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize['4xl'],
    },
  },
});

export const description = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textSecondary,
  lineHeight: '1.6',
  marginBottom: '1rem',
});

export const tags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.375rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const tag = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.accentStrong,
  backgroundColor: vars.color.accentSoft,
  borderRadius: vars.radius.full,
  paddingInline: '0.625rem',
  paddingBlock: '0.2rem',
});

// MDX 본문 prose 스타일
// globalStyle을 쓰는 이유: MDXRemote가 렌더링한 임의의 HTML 자식 요소를 스타일링해야 하기 때문
export const prose = style({
  color: vars.color.textSecondary,
  lineHeight: '1.8',
  fontSize: vars.fontSize.lg,
});

globalStyle(`${prose} h1`, {
  fontSize: vars.fontSize['3xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  marginTop: '2rem',
  marginBottom: '0.75rem',
  letterSpacing: '-0.02em',
});
globalStyle(`${prose} h2`, {
  fontSize: vars.fontSize['2xl'],
  fontWeight: 600,
  color: vars.color.textPrimary,
  marginTop: '2rem',
  marginBottom: '0.75rem',
});
globalStyle(`${prose} h3`, {
  fontSize: vars.fontSize.xl,
  fontWeight: 600,
  color: vars.color.textPrimary,
  marginTop: '1.5rem',
  marginBottom: '0.5rem',
});
globalStyle(`${prose} p`, { marginBottom: '1.25rem' });
globalStyle(`${prose} ul, ${prose} ol`, {
  paddingLeft: '1.5rem',
  marginBottom: '1.25rem',
});
globalStyle(`${prose} li`, { marginBottom: '0.25rem' });
globalStyle(`${prose} strong`, {
  color: vars.color.textPrimary,
  fontWeight: 600,
});
globalStyle(`${prose} a`, {
  color: vars.color.accentStrong,
  textDecoration: 'underline',
});
globalStyle(`${prose} code`, {
  fontSize: vars.fontSize.sm,
  backgroundColor: vars.color.bgSoft,
  color: vars.color.accentStrong,
  borderRadius: vars.radius.md,
  paddingInline: '0.375rem',
  paddingBlock: '0.1rem',
});
globalStyle(`${prose} pre`, {
  backgroundColor: vars.color.bgElevated,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.lg,
  padding: '1rem',
  overflowX: 'auto',
  marginBottom: '1.25rem',
});
globalStyle(`${prose} pre code`, {
  backgroundColor: 'transparent',
  padding: '0',
  color: vars.color.textPrimary,
});

applyHeadingAnchorStyles(prose);
