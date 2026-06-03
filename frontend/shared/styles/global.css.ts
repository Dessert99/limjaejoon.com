import { globalStyle } from '@vanilla-extract/css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { seasonThemes } from '@/shared/styles/themes/index.css';

globalStyle('html', {
  transition: 'background-color 200ms ease, color 200ms ease',
  scrollBehavior: 'smooth',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      scrollBehavior: 'auto',
    },
  },
});

// 첫 페인트(계절 클래스 교정) 동안에는 색 전환 애니메이션을 끈다 — 깜박임 방지
globalStyle('html[data-loading]', {
  transition: 'none',
});

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('body', {
  minHeight: '100vh',
  background: color.background,
  color: color.onSurface,
  font: tokens.typescale.bodyLarge,
});

globalStyle(':focus-visible', {
  outline: `2px solid ${color.primary}`,
  outlineOffset: '2px',
});

// rehype-pretty-code 듀얼테마 브릿지 — light 계절(봄·여름·가을·겨울)은 --shiki-light,
// 밤(dark scheme)은 --shiki-dark 를 적용한다.
const lightSeasonSelectors = [
  seasonThemes.spring,
  seasonThemes.summer,
  seasonThemes.autumn,
  seasonThemes.winter,
]
  .map((cls) => {
    return `.${cls} [data-rehype-pretty-code-figure] span`;
  })
  .join(', ');

globalStyle(lightSeasonSelectors, {
  color: 'var(--shiki-light)',
});

globalStyle(`.${seasonThemes.night} [data-rehype-pretty-code-figure] span`, {
  color: 'var(--shiki-dark)',
});
