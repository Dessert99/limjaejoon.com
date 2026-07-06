/** semantic color tokens — light/dark 테마가 같은 의미 이름을 공유한다 */
import { palette } from './palette';

/** 앱과 컴포넌트가 사용하는 semantic color shape */
export interface SemanticColor {
  fg: {
    neutral: string;
    muted: string;
    brand: string;
    onBrand: string;
    critical: string;
    warning: string;
    informative: string;
    positive: string;
    disabled: string;
  };
  bg: {
    canvas: string;
    surface: string;
    surfaceMuted: string;
    brand: string;
    brandPressed: string;
    brandWeak: string;
    criticalWeak: string;
    warningWeak: string;
    informativeWeak: string;
    positiveWeak: string;
    disabled: string;
    overlay: string;
  };
  stroke: {
    neutral: string;
    muted: string;
    brand: string;
    critical: string;
    warning: string;
    informative: string;
    positive: string;
  };
}

/** light theme semantic color 값 */
export const lightColor = {
  fg: {
    neutral: palette.gray[1000],
    muted: palette.gray[800],
    brand: palette.green[700],
    onBrand: palette.static.white,
    critical: palette.red[700],
    warning: palette.yellow[700],
    informative: palette.blue[700],
    positive: palette.green[700],
    disabled: palette.gray[500],
  },
  bg: {
    canvas: palette.gray[100],
    surface: palette.gray['00'],
    surfaceMuted: palette.gray[200],
    brand: palette.green[700],
    brandPressed: palette.green[800],
    brandWeak: palette.green[100],
    criticalWeak: palette.red[100],
    warningWeak: palette.yellow[100],
    informativeWeak: palette.blue[100],
    positiveWeak: palette.green[100],
    disabled: palette.gray[200],
    overlay: palette.static.blackAlpha700,
  },
  stroke: {
    neutral: palette.gray[400],
    muted: palette.gray[300],
    brand: palette.green[700],
    critical: palette.red[700],
    warning: palette.yellow[700],
    informative: palette.blue[700],
    positive: palette.green[700],
  },
} satisfies SemanticColor;

/** dark theme semantic color 값 */
export const darkColor = {
  fg: {
    neutral: palette.gray['00'],
    muted: palette.gray[600],
    brand: palette.green[500],
    onBrand: palette.gray[1000],
    critical: palette.red[200],
    warning: palette.yellow[300],
    informative: palette.blue[200],
    positive: palette.green[300],
    disabled: palette.gray[700],
  },
  bg: {
    canvas: palette.gray[1000],
    surface: palette.gray[900],
    surfaceMuted: palette.gray[800],
    brand: palette.green[500],
    brandPressed: palette.green[400],
    brandWeak: palette.green[1000],
    criticalWeak: palette.red[900],
    warningWeak: palette.yellow[900],
    informativeWeak: palette.blue[900],
    positiveWeak: palette.green[1000],
    disabled: palette.gray[800],
    overlay: palette.static.blackAlpha700,
  },
  stroke: {
    neutral: palette.gray[800],
    muted: palette.gray[900],
    brand: palette.green[500],
    critical: palette.red[200],
    warning: palette.yellow[300],
    informative: palette.blue[200],
    positive: palette.green[300],
  },
} satisfies SemanticColor;
