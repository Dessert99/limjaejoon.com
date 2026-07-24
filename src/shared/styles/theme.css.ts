/** 테마 토큰 바인딩 — semantic token contract 를 :root data-theme 속성에 CSS로 묶는다 */
import {
  assignVars,
  createGlobalTheme,
  createThemeContract,
  globalStyle,
} from '@vanilla-extract/css';
import { light } from './themes/light';
import { night } from './themes/night';

/** 토큰 컨트랙트 — 모든 테마가 채우는 semantic token 의 "모양" */
export const vars = createThemeContract({
  color: {
    fg: {
      neutral: null,
      muted: null,
      brand: null,
      onBrand: null,
      critical: null,
      warning: null,
      informative: null,
      positive: null,
      disabled: null,
    },
    bg: {
      canvas: null,
      surface: null,
      surfaceMuted: null,
      brand: null,
      brandPressed: null,
      brandWeak: null,
      critical: null,
      criticalWeak: null,
      warningWeak: null,
      informativeWeak: null,
      positiveWeak: null,
      disabled: null,
      overlay: null,
    },
    stroke: {
      neutral: null,
      muted: null,
      brand: null,
      critical: null,
      warning: null,
      informative: null,
      positive: null,
    },
  },
  typography: {
    fontFamily: {
      sans: null,
      mono: null,
    },
    fontSize: {
      12: null,
      14: null,
      16: null,
      20: null,
      24: null,
      32: null,
    },
    lineHeight: {
      tight: null,
      normal: null,
      relaxed: null,
    },
    fontWeight: {
      regular: null,
      medium: null,
      semibold: null,
      bold: null,
    },
    text: {
      body: {
        fontFamily: null,
        fontSize: null,
        lineHeight: null,
        fontWeight: null,
      },
      bodyStrong: {
        fontFamily: null,
        fontSize: null,
        lineHeight: null,
        fontWeight: null,
      },
      caption: {
        fontFamily: null,
        fontSize: null,
        lineHeight: null,
        fontWeight: null,
      },
      label: {
        fontFamily: null,
        fontSize: null,
        lineHeight: null,
        fontWeight: null,
      },
      headingSm: {
        fontFamily: null,
        fontSize: null,
        lineHeight: null,
        fontWeight: null,
      },
      headingMd: {
        fontFamily: null,
        fontSize: null,
        lineHeight: null,
        fontWeight: null,
      },
      headingLg: {
        fontFamily: null,
        fontSize: null,
        lineHeight: null,
        fontWeight: null,
      },
      code: {
        fontFamily: null,
        fontSize: null,
        lineHeight: null,
        fontWeight: null,
      },
    },
  },
  dimension: {
    none: null,
    x0_5: null,
    x1: null,
    x1_5: null,
    x2: null,
    x2_5: null,
    x3: null,
    x3_5: null,
    x4: null,
    x5: null,
    x6: null,
    x8: null,
    x10: null,
    x12: null,
    x16: null,
  },
  spacing: {
    globalGutter: null,
    componentDefault: null,
    betweenText: null,
    sectionGap: null,
    cardPadding: null,
    controlGap: null,
  },
  radius: {
    r1: null,
    r2: null,
    r3: null,
    r4: null,
    full: null,
    control: null,
    card: null,
    panel: null,
    overlay: null,
    pill: null,
  },
  duration: {
    d1: null,
    d2: null,
    d3: null,
    d4: null,
    d5: null,
    d6: null,
  },
  easing: {
    linear: null,
    standard: null,
    enter: null,
    exit: null,
    expressive: null,
  },
  motion: {
    colorTransition: {
      duration: null,
      easing: null,
    },
    controlFeedback: {
      duration: null,
      easing: null,
    },
    overlayEnter: {
      duration: null,
      easing: null,
    },
    overlayExit: {
      duration: null,
      easing: null,
    },
    themeReveal: {
      duration: null,
      easing: null,
    },
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
