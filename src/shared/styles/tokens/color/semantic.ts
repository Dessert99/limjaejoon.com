/** semantic color tokens — light(대낮 프라하)/dark(밤)가 같은 의미 이름을 공유한다 */
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
    critical: string;
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

/** light theme(대낮 프라하) semantic color 값 */
export const lightColor = {
  fg: {
    neutral: palette.sand[1000],
    muted: palette.sand[600],
    brand: palette.clay[700],
    onBrand: palette.sand['00'],
    critical: palette.critical[800],
    warning: '#7A5312',
    informative: '#3C5568',
    positive: '#3B6154',
    disabled: palette.sand[400],
  },
  bg: {
    canvas: palette.sand[100],
    surface: palette.sand['00'],
    surfaceMuted: palette.sand[200],
    brand: '#A64C34',
    brandPressed: palette.clay[700],
    brandWeak: palette.clay[100],
    critical: palette.critical[500],
    criticalWeak: palette.critical[100],
    warningWeak: '#FBEFCF',
    informativeWeak: '#E7EEF2',
    positiveWeak: '#DFEAE4',
    disabled: palette.sand[200],
    overlay: 'rgba(42, 40, 35, 0.45)',
  },
  stroke: {
    neutral: palette.sand[300],
    muted: palette.sand[200],
    brand: palette.clay[500],
    critical: palette.critical[600],
    warning: palette.amber[700],
    informative: palette.river[500],
    positive: palette.verdigris[500],
  },
} satisfies SemanticColor;

/** dark theme(밤) semantic color 값 — 대낮 팔레트의 명도만 낮춘다 */
export const darkColor = {
  fg: {
    neutral: palette.sand[100],
    muted: palette.sand[300],
    brand: palette.clay[300],
    onBrand: palette.sand['00'],
    critical: palette.critical[200],
    warning: palette.amber[300],
    informative: palette.river[300],
    positive: palette.verdigris[300],
    disabled: palette.sand[500],
  },
  bg: {
    canvas: palette.sand[900],
    surface: palette.sand[800],
    surfaceMuted: palette.sand[700],
    brand: '#A64C34',
    brandPressed: palette.clay[700],
    brandWeak: '#4A2E24',
    critical: palette.critical[500],
    criticalWeak: palette.critical[1000],
    warningWeak: '#453518',
    informativeWeak: palette.river[900],
    positiveWeak: palette.verdigris[900],
    disabled: palette.sand[700],
    overlay: 'rgba(18, 12, 9, 0.55)',
  },
  stroke: {
    neutral: palette.sand[600],
    muted: palette.sand[700],
    brand: palette.clay[600],
    critical: palette.critical[700],
    warning: palette.amber[700],
    informative: palette.river[700],
    positive: palette.verdigris[700],
  },
} satisfies SemanticColor;
