import { createTheme, createThemeContract } from '@vanilla-extract/css';
import { afternoon } from './themes/afternoon';
import { sunset } from './themes/sunset';
import { night } from './themes/night';
import { dawn } from './themes/dawn';

/** 토큰 컨트랙트 — 모든 테마가 채우는 색·폰트·라운드의 "모양" */
export const vars = createThemeContract({
  color: {
    background: null,
    surface: null,
    text: null,
    muted: null,
    border: null,
    accent: null,
  },
  font: {
    body: null,
    mono: null,
  },
  radius: {
    sm: null,
    md: null,
    lg: null,
  },
});

/** 오후(라이트) — 기본 적용 테마 */
export const afternoonThemeClass = createTheme(vars, afternoon);
/** 노을 */
export const sunsetThemeClass = createTheme(vars, sunset);
/** 밤 */
export const nightThemeClass = createTheme(vars, night);
/** 새벽 */
export const dawnThemeClass = createTheme(vars, dawn);
