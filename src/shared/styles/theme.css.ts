/** 테마 토큰 바인딩 — seed-design 방식으로 :root data-theme 속성에 CSS로 묶는다 */
import {
  assignVars,
  createGlobalTheme,
  createThemeContract,
  globalStyle,
} from '@vanilla-extract/css';
import { light } from './themes/light';
import { night } from './themes/night';

/** 토큰 컨트랙트 — 모든 테마가 채우는 색·폰트·라운드의 "모양" */
export const vars = createThemeContract({
  color: {
    background: null,
    surface: null,
    text: null,
    muted: null,
    border: null,
    overlay: null,
    accent: null,
    accentForeground: null,
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

// 다크(밤) = 기본값 — data-theme 없이도 항상 유효한 토큰이 깔린다. OS 스킴은 따르지 않는다
createGlobalTheme(':root', vars, night);
// color-scheme으로 스크롤바·폼 컨트롤 같은 UA 렌더링도 테마를 따라가게 한다
globalStyle(':root', { colorScheme: 'dark' });

/** 사용자가 명시적으로 라이트를 선택한 경우 */
globalStyle(':root[data-theme="light"]', {
  vars: assignVars(vars, light),
  colorScheme: 'light',
});
