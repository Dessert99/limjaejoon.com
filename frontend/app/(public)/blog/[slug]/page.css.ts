import { bp } from '@/shared/styles/breakpoints';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import {
  applyHeadingAnchorStyles,
  contentLayout,
  tocAside,
} from '@/shared/styles/utils.css';
import { globalStyle, style } from '@vanilla-extract/css';

export { contentLayout, tocAside };

export const main = style({
  margin: '0 auto',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '85rem',
  paddingInline: '1rem',
  paddingBottom: '4rem',
  '@media': {
    [bp.md]: {
      paddingInline: '6rem',
    },
  },
});

export const header = style({
  marginBottom: '2.5rem',
  paddingBottom: '2rem',
  borderBottom: `1px solid ${color.outlineVariant}`,
});

export const date = style({
  font: tokens.typescale.labelLarge,
  fontFamily: tokens.typeface.mono,
  color: color.onSurfaceVariant,
  display: 'block',
  marginBottom: '1rem',
});

export const title = style({
  font: tokens.typescale.headlineMedium,
  color: color.onSurface,
  letterSpacing: '-0.02em',
  lineHeight: '1.3',
  marginBottom: '0.75rem',
  '@media': {
    [bp.md]: {
      font: tokens.typescale.displaySmall,
    },
  },
});

export const description = style({
  font: tokens.typescale.bodyLarge,
  color: color.onSurfaceVariant,
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
  font: tokens.typescale.labelSmall,
  color: color.primary,
  background: `color-mix(in oklab, ${color.primary} 12%, transparent)`,
  borderRadius: tokens.shape.small,
  paddingInline: '0.625rem',
  paddingBlock: '0.2rem',
});

// MDX 본문 prose 스타일
// globalStyle을 쓰는 이유: MDXRemote가 렌더링한 임의의 HTML 자식 요소를 스타일링해야 하기 때문
export const prose = style({
  minWidth: 0, // grid 아이템이 1fr을 무시하고 콘텐츠 크기로 늘어나는 것을 방지
  color: color.onSurfaceVariant,
  lineHeight: '1.8',
  font: tokens.typescale.bodyLarge,
});

globalStyle(`${prose} h1`, {
  font: tokens.typescale.headlineSmall,
  fontWeight: 700,
  color: color.onSurface,
  marginTop: '2rem',
  marginBottom: '0.75rem',
  letterSpacing: '-0.02em',
});
globalStyle(`${prose} h2`, {
  font: tokens.typescale.titleLarge,
  fontWeight: 600,
  color: color.onSurface,
  marginTop: '2rem',
  marginBottom: '0.75rem',
});
globalStyle(`${prose} h3`, {
  font: tokens.typescale.titleMedium,
  fontWeight: 600,
  color: color.onSurface,
  marginTop: '1.5rem',
  marginBottom: '0.5rem',
});
globalStyle(`${prose} p`, { marginBottom: '1.25rem', paddingLeft: '1rem' });
globalStyle(`${prose} ul, ${prose} ol`, {
  paddingLeft: '2.5rem',
  marginBottom: '1.25rem',
});
globalStyle(`${prose} li`, { marginBottom: '0.25rem' });
globalStyle(`${prose} strong`, {
  color: color.onSurface,
  fontWeight: 600,
});
globalStyle(`${prose} a`, {
  color: color.primary,
  textDecoration: 'underline',
});
globalStyle(`${prose} code`, {
  font: tokens.typescale.bodyMedium,
  fontFamily: tokens.typeface.mono,
  background: color.surfaceContainerHighest,
  color: color.primary,
  borderRadius: tokens.shape.extraSmall,
  paddingInline: '0.375rem',
  paddingBlock: '0.1rem',
});
globalStyle(`${prose} pre`, {
  background: color.surfaceContainerLow,
  border: `1px solid ${color.outlineVariant}`,
  borderRadius: tokens.shape.medium,
  padding: '1rem',
  overflowX: 'auto',
  marginBottom: '1.25rem',
  marginLeft: '1rem',
});
globalStyle(`${prose} pre code`, {
  background: 'transparent',
  padding: '0',
  color: color.onSurface,
  fontFamily: tokens.typeface.mono,
});

// 인용문: 브랜드의 "강조 = 2px primary 좌측 바" 모티프를 적용. pre처럼 본문(1rem)에 정렬
globalStyle(`${prose} blockquote`, {
  marginLeft: '1rem',
  marginBottom: '1.25rem',
  paddingLeft: '1rem',
  paddingBlock: '0.5rem',
  borderLeft: `2px solid ${color.primary}`,
  background: `color-mix(in oklab, ${color.primary} 8%, transparent)`,
  borderRadius: tokens.shape.small,
});
// blockquote 안의 p는 prose 기본값(paddingLeft 1rem, 끝 margin)을 상속해 이중 들여쓰기·여백이 생기므로 상쇄
globalStyle(`${prose} blockquote p`, { paddingLeft: 0 });
globalStyle(`${prose} blockquote p:last-child`, { marginBottom: 0 });

applyHeadingAnchorStyles(prose);
