# Design Token Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a SEED-inspired design token foundation for this web app and wire it into the current vanilla-extract theme, sprinkles, and representative motion/color consumers.

**Architecture:** Add `src/shared/styles/tokens` as the raw scale + semantic token source, then make `theme.css.ts` expose only app-facing semantic CSS variables through `vars`. The migration is intentionally broad enough to keep type-check green after the contract shape changes, but visual polish is limited to the agreed first path: theme/global/sprinkles plus Button, Switch, Progress, and theme reveal.

**Tech Stack:** Next.js 16, React 19, TypeScript, vanilla-extract, vanilla-extract sprinkles, Vitest.

---

## File Structure

Create:

- `src/shared/styles/tokens/color/palette.ts` — SEED-inspired limited raw palette.
- `src/shared/styles/tokens/color/semantic.ts` — light/dark semantic color mapping.
- `src/shared/styles/tokens/color/index.ts` — color barrel.
- `src/shared/styles/tokens/typography/scale.ts` — font family, size, line-height, weight scale.
- `src/shared/styles/tokens/typography/text.ts` — semantic text styles.
- `src/shared/styles/tokens/typography/index.ts` — typography barrel.
- `src/shared/styles/tokens/dimension/scale.ts` — SEED-style dimension scale.
- `src/shared/styles/tokens/dimension/spacing.ts` — semantic spacing aliases.
- `src/shared/styles/tokens/dimension/index.ts` — dimension barrel.
- `src/shared/styles/tokens/radius/scale.ts` — radius raw scale.
- `src/shared/styles/tokens/radius/semantic.ts` — semantic radius aliases.
- `src/shared/styles/tokens/radius/index.ts` — radius barrel.
- `src/shared/styles/tokens/motion/duration.ts` — duration scale.
- `src/shared/styles/tokens/motion/easing.ts` — easing scale.
- `src/shared/styles/tokens/motion/semantic.ts` — semantic motion aliases.
- `src/shared/styles/tokens/motion/index.ts` — motion barrel.
- `src/shared/styles/tokens/index.ts` — token foundation public barrel.
- `src/shared/styles/tokens/tokens.test.ts` — token completeness and shape tests.

Modify:

- `src/shared/styles/theme.types.ts` — replace old `ThemeValues` shape with new semantic token shape.
- `src/shared/styles/theme.css.ts` — replace old contract with semantic contract and light/dark mapping.
- `src/shared/styles/themes/base.ts` — delete after `light.ts` and `night.ts` stop importing it.
- `src/shared/styles/themes/light.ts` — export semantic light theme values from tokens.
- `src/shared/styles/themes/night.ts` — export semantic dark theme values from tokens.
- `src/shared/styles/global.css.ts` — update body/focus to semantic tokens.
- `src/shared/styles/sprinkles.css.ts` — update dimension, fg/bg/stroke, and radius props.
- `src/shared/styles/index.ts` — export the new token foundation from the shared styles public API.
- `src/shared/ui/Button/Button.css.ts` — representative component migration to semantic color/radius/motion.
- `src/shared/ui/Switch/Switch.css.ts` — representative control migration to semantic color/radius/motion.
- `src/shared/ui/Progress/Progress.css.ts` — representative progress migration to semantic color/motion.
- `src/features/theme-toggle/lib/withCircularReveal.ts` — use semantic motion values for reveal duration/easing.
- All `.css.ts` files reported by `rg "vars\\.(color|font|radius)\\." src` — mechanical compile-fix migration to new token paths.
- All files reported by `rg "sprinkles\\(\\{.*'(2|4|6|8|10|12|14|16|20|24|32|40|48|64|sm|md|lg)'" src` — mechanical sprinkles key migration where touched by type-check.

Test:

- `src/shared/styles/tokens/tokens.test.ts`
- Existing component tests around Button, Switch, Progress, and theme-toggle.

---

### Task 1: Token Foundation Data

**Files:**

- Create: `src/shared/styles/tokens/color/palette.ts`
- Create: `src/shared/styles/tokens/color/semantic.ts`
- Create: `src/shared/styles/tokens/color/index.ts`
- Create: `src/shared/styles/tokens/typography/scale.ts`
- Create: `src/shared/styles/tokens/typography/text.ts`
- Create: `src/shared/styles/tokens/typography/index.ts`
- Create: `src/shared/styles/tokens/dimension/scale.ts`
- Create: `src/shared/styles/tokens/dimension/spacing.ts`
- Create: `src/shared/styles/tokens/dimension/index.ts`
- Create: `src/shared/styles/tokens/radius/scale.ts`
- Create: `src/shared/styles/tokens/radius/semantic.ts`
- Create: `src/shared/styles/tokens/radius/index.ts`
- Create: `src/shared/styles/tokens/motion/duration.ts`
- Create: `src/shared/styles/tokens/motion/easing.ts`
- Create: `src/shared/styles/tokens/motion/semantic.ts`
- Create: `src/shared/styles/tokens/motion/index.ts`
- Create: `src/shared/styles/tokens/index.ts`
- Test: `src/shared/styles/tokens/tokens.test.ts`

- [ ] **Step 1: Write the failing token shape test**

Create `src/shared/styles/tokens/tokens.test.ts`:

```ts
/** 디자인 토큰 foundation 계약 테스트 — light/dark semantic shape 누락을 막는다 */
import {
  darkColor,
  lightColor,
  typography,
  dimension,
  spacing,
  radius,
  duration,
  easing,
  motion,
} from '.';

const flattenKeys = (
  value: Record<string, unknown>,
  prefix = ''
): string[] => {
  return Object.entries(value).flatMap(([key, nested]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return flattenKeys(nested as Record<string, unknown>, path);
    }
    return [path];
  });
};

describe('design tokens', () => {
  it('light와 dark color semantic이 같은 key를 가진다', () => {
    expect(flattenKeys(lightColor)).toEqual(flattenKeys(darkColor));
  });

  it('green brand와 positive semantic을 둘 다 제공한다', () => {
    expect(lightColor.fg.brand).toMatch(/^#/);
    expect(lightColor.fg.positive).toMatch(/^#/);
    expect(darkColor.bg.brand).toMatch(/^#/);
    expect(darkColor.bg.positiveWeak).toMatch(/^#/);
  });

  it('typography semantic text style은 CSS text 속성을 가진다', () => {
    expect(typography.text.body).toMatchObject({
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize[16],
      lineHeight: typography.lineHeight.normal,
      fontWeight: typography.fontWeight.regular,
    });
    expect(typography.text.code.fontFamily).toBe(typography.fontFamily.mono);
  });

  it('dimension scale과 semantic spacing을 분리한다', () => {
    expect(dimension.x0_5).toBe('0.125rem');
    expect(dimension.x4).toBe('1rem');
    expect(spacing.globalGutter).toBe(dimension.x4);
    expect(spacing.cardPadding).toBe(dimension.x6);
  });

  it('radius와 motion semantic alias를 제공한다', () => {
    expect(radius.control).toBe(radius.r2);
    expect(radius.pill).toBe(radius.full);
    expect(motion.colorTransition.duration).toBe(duration.d3);
    expect(motion.controlFeedback.easing).toBe(easing.enter);
    expect(motion.themeReveal.duration).toBe('2000ms');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npx vitest run src/shared/styles/tokens/tokens.test.ts
```

Expected: FAIL because `src/shared/styles/tokens/index.ts` does not exist.

- [ ] **Step 3: Create color palette**

Create `src/shared/styles/tokens/color/palette.ts`:

```ts
/** 제한된 raw color palette — SEED 값을 웹앱 foundation 용으로 선별 */
export const palette = {
  gray: {
    '00': '#ffffff',
    100: '#f7f8f9',
    200: '#f3f4f5',
    300: '#eeeff1',
    400: '#dcdee3',
    500: '#d1d3d8',
    600: '#b0b3ba',
    700: '#868b94',
    800: '#555d6d',
    900: '#2a3038',
    1000: '#1a1c20',
  },
  green: {
    100: '#edfaf6',
    200: '#d9f6e9',
    300: '#b9e9d2',
    400: '#7ddcb3',
    500: '#42c593',
    600: '#10ab7d',
    700: '#079171',
    800: '#00745f',
    900: '#075445',
    1000: '#0a2b24',
  },
  red: {
    100: '#fdf0f0',
    200: '#fde7e7',
    700: '#fa342c',
    800: '#ca1d13',
    900: '#921708',
  },
  yellow: {
    100: '#fff7de',
    200: '#fdefb9',
    300: '#fbdc65',
    700: '#9b7821',
    900: '#4f3e1f',
  },
  blue: {
    100: '#eff6ff',
    200: '#e2edfc',
    700: '#217cf9',
    800: '#135fcd',
    900: '#0b4596',
  },
  static: {
    black: '#000000',
    white: '#ffffff',
    transparent: '#00000000',
    blackAlpha100: '#00000007',
    blackAlpha200: '#0000000c',
    blackAlpha500: '#0000002c',
    blackAlpha700: '#00000074',
    whiteAlpha100: '#ffffff17',
    whiteAlpha200: '#ffffff20',
    whiteAlpha500: '#ffffff60',
    whiteAlpha700: '#ffffffb3',
  },
} as const;
```

- [ ] **Step 4: Create semantic color mapping**

Create `src/shared/styles/tokens/color/semantic.ts`:

```ts
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

/** light color scheme — green을 brand/primary로 사용한다 */
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

/** dark color scheme — 같은 semantic 이름에 어두운 배경용 값을 주입한다 */
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
```

- [ ] **Step 5: Create color barrel**

Create `src/shared/styles/tokens/color/index.ts`:

```ts
/** color token exports */
export { palette } from './palette';
export { lightColor, darkColor } from './semantic';
export type { SemanticColor } from './semantic';
```

- [ ] **Step 6: Create typography tokens**

Create `src/shared/styles/tokens/typography/scale.ts`:

```ts
/** typography scale tokens — text semantic 의 재료 */
export const fontFamily = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
} as const;

export const fontSize = {
  12: '0.75rem',
  14: '0.875rem',
  16: '1rem',
  20: '1.25rem',
  24: '1.5rem',
  32: '2rem',
} as const;

export const lineHeight = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.7',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
```

Create `src/shared/styles/tokens/typography/text.ts`:

```ts
/** semantic text styles — 반복되는 UI 텍스트 조합을 고정한다 */
import { fontFamily, fontSize, fontWeight, lineHeight } from './scale';

export const text = {
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[16],
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.regular,
  },
  bodyStrong: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[16],
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[12],
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.regular,
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[14],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.medium,
  },
  headingSm: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[20],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  headingMd: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[24],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  headingLg: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[32],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize[14],
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.regular,
  },
} as const;
```

Create `src/shared/styles/tokens/typography/index.ts`:

```ts
/** typography token exports */
import { fontFamily, fontSize, fontWeight, lineHeight } from './scale';
import { text } from './text';

export { fontFamily, fontSize, fontWeight, lineHeight, text };

export const typography = {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  text,
} as const;
```

- [ ] **Step 7: Create dimension and spacing tokens**

Create `src/shared/styles/tokens/dimension/scale.ts`:

```ts
/** dimension scale tokens — spacing, padding, margin, gap 의 raw 재료 */
export const dimension = {
  none: '0',
  x0_5: '0.125rem',
  x1: '0.25rem',
  x1_5: '0.375rem',
  x2: '0.5rem',
  x2_5: '0.625rem',
  x3: '0.75rem',
  x3_5: '0.875rem',
  x4: '1rem',
  x5: '1.25rem',
  x6: '1.5rem',
  x8: '2rem',
  x10: '2.5rem',
  x12: '3rem',
  x16: '4rem',
} as const;
```

Create `src/shared/styles/tokens/dimension/spacing.ts`:

```ts
/** semantic spacing tokens — 레이아웃 의도를 이름으로 고정한다 */
import { dimension } from './scale';

export const spacing = {
  globalGutter: dimension.x4,
  componentDefault: dimension.x3,
  betweenText: dimension.x1_5,
  sectionGap: dimension.x8,
  cardPadding: dimension.x6,
  controlGap: dimension.x2,
} as const;
```

Create `src/shared/styles/tokens/dimension/index.ts`:

```ts
/** dimension and spacing token exports */
export { dimension } from './scale';
export { spacing } from './spacing';
```

- [ ] **Step 8: Create radius tokens**

Create `src/shared/styles/tokens/radius/scale.ts`:

```ts
/** radius scale tokens — 실제 둥글기 값 */
export const radiusScale = {
  r1: '0.25rem',
  r2: '0.5rem',
  r3: '0.75rem',
  r4: '1rem',
  full: '9999px',
} as const;
```

Create `src/shared/styles/tokens/radius/semantic.ts`:

```ts
/** semantic radius tokens — UI 역할별 둥글기 */
import { radiusScale } from './scale';

export const radius = {
  ...radiusScale,
  control: radiusScale.r2,
  card: radiusScale.r3,
  panel: radiusScale.r4,
  overlay: radiusScale.r3,
  pill: radiusScale.full,
} as const;
```

Create `src/shared/styles/tokens/radius/index.ts`:

```ts
/** radius token exports */
export { radiusScale } from './scale';
export { radius } from './semantic';
```

- [ ] **Step 9: Create motion tokens**

Create `src/shared/styles/tokens/motion/duration.ts`:

```ts
/** duration scale tokens — SEED motion scale 를 웹앱 기준으로 사용 */
export const duration = {
  d1: '50ms',
  d2: '100ms',
  d3: '150ms',
  d4: '200ms',
  d5: '250ms',
  d6: '300ms',
} as const;
```

Create `src/shared/styles/tokens/motion/easing.ts`:

```ts
/** easing tokens — CSS transition/animation timing-function 재료 */
export const easing = {
  linear: 'cubic-bezier(0, 0, 1, 1)',
  standard: 'cubic-bezier(0.35, 0, 0.35, 1)',
  enter: 'cubic-bezier(0, 0, 0.15, 1)',
  exit: 'cubic-bezier(0.35, 0, 1, 1)',
  expressive: 'cubic-bezier(0.03, 0.4, 0.1, 1)',
} as const;
```

Create `src/shared/styles/tokens/motion/semantic.ts`:

```ts
/** semantic motion tokens — 실제 UI 피드백 의도를 이름으로 고정한다 */
import { duration } from './duration';
import { easing } from './easing';

export const motion = {
  colorTransition: {
    duration: duration.d3,
    easing: easing.standard,
  },
  controlFeedback: {
    duration: duration.d3,
    easing: easing.enter,
  },
  overlayEnter: {
    duration: duration.d4,
    easing: easing.enter,
  },
  overlayExit: {
    duration: duration.d3,
    easing: easing.exit,
  },
  themeReveal: {
    duration: '2000ms',
    easing: 'ease-in-out',
  },
} as const;
```

Create `src/shared/styles/tokens/motion/index.ts`:

```ts
/** motion token exports */
export { duration } from './duration';
export { easing } from './easing';
export { motion } from './semantic';
```

- [ ] **Step 10: Create root token barrel**

Create `src/shared/styles/tokens/index.ts`:

```ts
/** design token foundation exports */
export { palette, lightColor, darkColor } from './color';
export type { SemanticColor } from './color';
export {
  typography,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  text,
} from './typography';
export { dimension, spacing } from './dimension';
export { radiusScale, radius } from './radius';
export { duration, easing, motion } from './motion';
```

- [ ] **Step 11: Run token test to verify it passes**

Run:

```bash
npx vitest run src/shared/styles/tokens/tokens.test.ts
```

Expected: PASS.

- [ ] **Step 12: Commit token data**

```bash
git add src/shared/styles/tokens
git commit -m "feat(styles): 디자인 토큰 foundation 추가"
```

---

### Task 2: Theme Contract and Global Styles

**Files:**

- Modify: `src/shared/styles/theme.types.ts`
- Modify: `src/shared/styles/themes/light.ts`
- Modify: `src/shared/styles/themes/night.ts`
- Modify: `src/shared/styles/theme.css.ts`
- Modify: `src/shared/styles/global.css.ts`
- Modify: `src/shared/styles/index.ts`
- Test: `src/shared/styles/tokens/tokens.test.ts`

- [ ] **Step 1: Update theme value type**

Replace `src/shared/styles/theme.types.ts` with:

```ts
/** 테마 시스템 타입 — theme.css contract 와 semantic token 값이 공유하는 모양 계약 */
import type { SemanticColor } from './tokens';
import type { dimension, spacing, typography, radius, duration, easing, motion } from './tokens';

/** 토큰 컨트랙트와 같은 모양의 값 — theme.css 의 vars 와 1:1 대응 */
export interface ThemeValues {
  color: SemanticColor;
  typography: typeof typography;
  dimension: typeof dimension;
  spacing: typeof spacing;
  radius: typeof radius;
  duration: typeof duration;
  easing: typeof easing;
  motion: typeof motion;
}
```

If lint rejects the long type import line, rewrite only the imports as:

```ts
import type { SemanticColor } from './tokens';
import type {
  dimension,
  spacing,
  typography,
  radius,
  duration,
  easing,
  motion,
} from './tokens';
```

- [ ] **Step 2: Update light and dark theme values**

Replace `src/shared/styles/themes/light.ts` with:

```ts
/** light theme values — semantic token contract 에 light 값을 주입 */
import { dimension, duration, easing, lightColor, motion, radius, spacing, typography } from '../tokens';
import type { ThemeValues } from '../theme.types';

/** light theme — green brand 기반 밝은 웹앱 스킴 */
export const light: ThemeValues = {
  color: lightColor,
  typography,
  dimension,
  spacing,
  radius,
  duration,
  easing,
  motion,
};
```

Replace `src/shared/styles/themes/night.ts` with:

```ts
/** dark theme values — semantic token contract 에 dark 값을 주입 */
import { darkColor, dimension, duration, easing, motion, radius, spacing, typography } from '../tokens';
import type { ThemeValues } from '../theme.types';

/** dark theme — data-theme 없이 적용되는 기본 웹앱 스킴 */
export const night: ThemeValues = {
  color: darkColor,
  typography,
  dimension,
  spacing,
  radius,
  duration,
  easing,
  motion,
};
```

After replacing both theme files, run `npm run format -- src/shared/styles/themes/light.ts src/shared/styles/themes/night.ts` to normalize import wrapping.

- [ ] **Step 3: Replace vanilla-extract contract**

Replace `src/shared/styles/theme.css.ts` with:

```ts
/** 테마 토큰 바인딩 — semantic design token 을 :root data-theme 속성에 CSS 변수로 묶는다 */
import {
  assignVars,
  createGlobalTheme,
  createThemeContract,
  globalStyle,
} from '@vanilla-extract/css';
import { light } from './themes/light';
import { night } from './themes/night';

/** 토큰 컨트랙트 — 모든 테마가 채우는 semantic token 의 모양 */
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
    fontFamily: { sans: null, mono: null },
    fontSize: {
      12: null,
      14: null,
      16: null,
      20: null,
      24: null,
      32: null,
    },
    lineHeight: { tight: null, normal: null, relaxed: null },
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
    colorTransition: { duration: null, easing: null },
    controlFeedback: { duration: null, easing: null },
    overlayEnter: { duration: null, easing: null },
    overlayExit: { duration: null, easing: null },
    themeReveal: { duration: null, easing: null },
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
```

- [ ] **Step 4: Update global styles**

In `src/shared/styles/global.css.ts`, replace the body and focus-visible token references with:

```ts
globalStyle('body', {
  minHeight: '100vh',
  background: vars.color.bg.canvas,
  color: vars.color.fg.neutral,
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize[16],
  lineHeight: vars.typography.lineHeight.normal,
});

globalStyle(':focus-visible', {
  outline: `2px solid ${vars.color.stroke.brand}`,
  outlineOffset: '2px',
});
```

Keep the other global styles unchanged.

- [ ] **Step 5: Export tokens from shared styles**

Replace `src/shared/styles/index.ts` with:

```ts
export { bp } from './breakpoints';
export { sprinkles } from './sprinkles.css';
export { vars } from './theme.css';
export * from './tokens';
```

- [ ] **Step 6: Run focused token and type checks**

Run:

```bash
npx vitest run src/shared/styles/tokens/tokens.test.ts
npm run type-check
```

Expected: token test PASS. `npm run type-check` may FAIL because `sprinkles.css.ts` and existing `.css.ts` files still reference old `vars.color.*`, `vars.font.*`, and `vars.radius.*`. The expected failures should point to old token paths only.

- [ ] **Step 7: Commit theme contract**

```bash
git add src/shared/styles/theme.types.ts src/shared/styles/themes/light.ts src/shared/styles/themes/night.ts src/shared/styles/theme.css.ts src/shared/styles/global.css.ts src/shared/styles/index.ts
git commit -m "feat(styles): semantic theme contract 적용"
```

---

### Task 3: Sprinkles Token Migration

**Files:**

- Modify: `src/shared/styles/sprinkles.css.ts`
- Modify: call sites using `sprinkles({ ... })` with old numeric spacing and old `sm/md/lg` radius keys.

- [ ] **Step 1: Update sprinkles configuration**

Replace `src/shared/styles/sprinkles.css.ts` with:

```ts
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { vars } from './theme.css';

// SPRINKLES — 빌드 타임 atomic·반응형 유틸 prop. 레이아웃/간격/색의 "리듬"을 담당한다.
// style({}) 안에서도 합성된다: style([sprinkles({ display: 'flex', p: 'x4' }), { ...고유 연출 }]).
// 치수(width/height)·위치(position)·타이포·애니메이션은 sprinkles 영역이 아니라 style() 에 남긴다.

const margins = { ...vars.dimension, auto: 'auto' } as const;

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    display: [
      'none',
      'flex',
      'grid',
      'block',
      'inline-flex',
      'inline-block',
      'contents',
    ],
    flexDirection: ['row', 'column'],
    flexWrap: ['wrap', 'nowrap'],
    alignItems: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    justifyContent: [
      'flex-start',
      'center',
      'flex-end',
      'space-between',
      'space-around',
    ],
    gap: vars.dimension,
    padding: vars.dimension,
    paddingTop: vars.dimension,
    paddingBottom: vars.dimension,
    paddingLeft: vars.dimension,
    paddingRight: vars.dimension,
    paddingInline: vars.dimension,
    paddingBlock: vars.dimension,
    margin: margins,
    marginTop: margins,
    marginBottom: margins,
    marginLeft: margins,
    marginRight: margins,
    marginInline: margins,
    borderRadius: vars.radius,
  },
  shorthands: {
    p: ['padding'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    m: ['margin'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    r: ['borderRadius'],
  },
});

const colorProperties = defineProperties({
  properties: {
    background: vars.color.bg,
    color: vars.color.fg,
    borderColor: vars.color.stroke,
  },
  shorthands: {
    bg: ['background'],
    c: ['color'],
  },
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);
```

- [ ] **Step 2: Mechanically migrate sprinkles spacing and radius keys**

Use this exact replacement table in every `sprinkles({ ... })` call that TypeScript reports:

```txt
'2'  -> 'x0_5'
'4'  -> 'x1'
'6'  -> 'x1_5'
'8'  -> 'x2'
'10' -> 'x2_5'
'12' -> 'x3'
'14' -> 'x3_5'
'16' -> 'x4'
'20' -> 'x5'
'24' -> 'x6'
'32' -> 'x8'
'40' -> 'x10'
'48' -> 'x12'
'64' -> 'x16'

r: 'sm' -> r: 'r1'
r: 'md' -> r: 'r2'
r: 'lg' -> r: 'r3'
```

Examples:

```ts
sprinkles({ display: 'flex', gap: '8' })
```

becomes:

```ts
sprinkles({ display: 'flex', gap: 'x2' })
```

```ts
sprinkles({ px: '16', py: '12', r: 'md' })
```

becomes:

```ts
sprinkles({ px: 'x4', py: 'x3', r: 'r2' })
```

- [ ] **Step 3: Run type-check to find remaining sprinkles errors**

Run:

```bash
npm run type-check
```

Expected: FAIL is acceptable only for old `vars.color.*`, `vars.font.*`, or `vars.radius.*` references. There should be no errors saying spacing keys like `"8"` or radius keys like `"md"` are invalid for sprinkles.

- [ ] **Step 4: Commit sprinkles migration**

```bash
git add src/shared/styles/sprinkles.css.ts src
git commit -m "refactor(styles): sprinkles 토큰 key 전환"
```

Before committing, run:

```bash
git diff --cached --name-only
```

Expected: `src/shared/styles/sprinkles.css.ts` and `.css.ts` files with sprinkles key changes. No docs or unrelated files.

---

### Task 4: Representative Components and Motion Tokens

**Files:**

- Modify: `src/shared/ui/Button/Button.css.ts`
- Modify: `src/shared/ui/Switch/Switch.css.ts`
- Modify: `src/shared/ui/Progress/Progress.css.ts`
- Modify: `src/features/theme-toggle/lib/withCircularReveal.ts`
- Test: `src/shared/ui/Button/Button.test.tsx`
- Test: `src/shared/ui/Switch/Switch.test.tsx` if present
- Test: `src/shared/ui/Progress/Progress.test.tsx`
- Test: `src/features/theme-toggle/lib/withCircularReveal.test.ts`

- [ ] **Step 1: Update Button styles**

Apply these semantic token changes in `src/shared/ui/Button/Button.css.ts`:

```ts
const base = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'x2',
    r: 'control',
  }),
  {
    cursor: 'pointer',
    fontWeight: vars.typography.fontWeight.semibold,
    border: '1px solid transparent',
    transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
]);
```

Use this variant mapping:

```ts
solid: {
  background: vars.color.bg.brand,
  color: vars.color.fg.onBrand,
  ':hover': { background: vars.color.bg.brandPressed },
},
outline: {
  borderColor: vars.color.stroke.neutral,
  color: vars.color.fg.neutral,
  ':hover': { background: vars.color.bg.surfaceMuted },
},
ghost: {
  color: vars.color.fg.neutral,
  ':hover': { background: vars.color.bg.surfaceMuted },
},
link: {
  color: vars.color.fg.neutral,
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
  ':hover': { color: vars.color.fg.brand },
},
```

Use this size mapping:

```ts
size: {
  sm: sprinkles({ px: 'x3', py: 'x1' }),
  md: sprinkles({ px: 'x6', py: 'x1_5' }),
  lg: sprinkles({ px: 'x10', py: 'x2' }),
},
```

- [ ] **Step 2: Update Switch styles**

In `src/shared/ui/Switch/Switch.css.ts`, replace token/motion values with:

```ts
borderRadius: vars.radius.pill,
background: vars.color.bg.disabled,
transition: `background ${vars.motion.controlFeedback.duration} ${vars.motion.controlFeedback.easing}`,
selectors: {
  '&[data-state="checked"]': { background: vars.color.bg.brand },
},
```

For the thumb:

```ts
borderRadius: vars.radius.pill,
background: vars.color.bg.surface,
transition: `transform ${vars.motion.controlFeedback.duration} ${vars.motion.controlFeedback.easing}`,
```

- [ ] **Step 3: Update Progress styles**

In `src/shared/ui/Progress/Progress.css.ts`, use:

```ts
borderRadius: vars.radius.pill,
background: vars.color.bg.surfaceMuted,
```

For the indicator:

```ts
background: vars.color.bg.brand,
transition: `transform ${vars.motion.controlFeedback.duration} ${vars.motion.controlFeedback.easing}`,
```

- [ ] **Step 4: Update theme reveal motion**

In `src/features/theme-toggle/lib/withCircularReveal.ts`, import `motion` from tokens:

```ts
import { motion } from '@/shared/styles';
```

Then replace animate options:

```ts
{
  duration: Number.parseInt(motion.themeReveal.duration, 10),
  easing: motion.themeReveal.easing,
  pseudoElement: '::view-transition-new(root)',
}
```

- [ ] **Step 5: Run focused tests**

Run:

```bash
npx vitest run src/shared/ui/Button/Button.test.tsx src/shared/ui/Progress/Progress.test.tsx src/features/theme-toggle/lib/withCircularReveal.test.ts
```

Expected: PASS. If `src/shared/ui/Switch/Switch.test.tsx` exists at execution time, include it in the same command.

- [ ] **Step 6: Commit representative component migration**

```bash
git add src/shared/ui/Button/Button.css.ts src/shared/ui/Switch/Switch.css.ts src/shared/ui/Progress/Progress.css.ts src/features/theme-toggle/lib/withCircularReveal.ts
git commit -m "refactor(styles): 대표 컴포넌트에 semantic token 적용"
```

---

### Task 5: Compile-Fix Remaining Token References

**Files:**

- Modify: every file returned by `rg -n "vars\\.(color|font|radius)\\." src app`.
- Do not modify unrelated behavior.

- [ ] **Step 1: List remaining old token references**

Run:

```bash
rg -n "vars\\.(color|font|radius)\\." src app
```

Expected: output lists old token paths such as `vars.color.text`, `vars.color.surface`, `vars.color.border`, `vars.color.accent`, `vars.font.mono`, `vars.radius.md`.

- [ ] **Step 2: Apply exact token path mapping**

Use this mapping for direct `vars` references:

```txt
vars.color.background        -> vars.color.bg.canvas
vars.color.surface           -> vars.color.bg.surface
vars.color.text              -> vars.color.fg.neutral
vars.color.muted             -> vars.color.fg.muted
vars.color.border            -> vars.color.stroke.neutral
vars.color.overlay           -> vars.color.bg.overlay
vars.color.accent            -> vars.color.bg.brand
vars.color.accentForeground  -> vars.color.fg.onBrand
vars.font.body               -> vars.typography.fontFamily.sans
vars.font.mono               -> vars.typography.fontFamily.mono
vars.radius.sm               -> vars.radius.r1
vars.radius.md               -> vars.radius.r2
vars.radius.lg               -> vars.radius.r3
```

Context-specific exceptions:

```txt
CSS color property with old vars.color.accent       -> vars.color.fg.brand
CSS borderColor/outline with old vars.color.accent  -> vars.color.stroke.brand
Selected/checked background accent                  -> vars.color.bg.brand
Selected/checked foreground accentForeground        -> vars.color.fg.onBrand
Muted panel/background using old vars.color.background inside a card -> vars.color.bg.canvas
```

Examples:

```ts
color: vars.color.text
```

becomes:

```ts
color: vars.color.fg.neutral
```

```ts
border: `1px solid ${vars.color.border}`
```

becomes:

```ts
border: `1px solid ${vars.color.stroke.neutral}`
```

```ts
fontFamily: vars.font.mono
```

becomes:

```ts
fontFamily: vars.typography.fontFamily.mono
```

- [ ] **Step 3: Verify old references are gone**

Run:

```bash
rg -n "vars\\.(color|font|radius)\\." src app
```

Expected: no output.

- [ ] **Step 4: Run type-check**

Run:

```bash
npm run type-check
```

Expected: PASS. If it fails, errors should not be old token paths. Fix only token-migration errors in this task.

- [ ] **Step 5: Commit compile fixes**

```bash
git add src app
git commit -m "refactor(styles): semantic token 참조로 전환"
```

---

### Task 6: Verification and Formatting

**Files:**

- Modify only files formatted by Prettier if needed.

- [ ] **Step 1: Run FSD check**

Run:

```bash
npm run fsd
```

Expected: PASS.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 3: Run type-check**

Run:

```bash
npm run type-check
```

Expected: PASS.

- [ ] **Step 4: Run tests**

Run:

```bash
npm run test
```

Expected: PASS.

- [ ] **Step 5: Format changed files**

Run:

```bash
npm run format
```

Expected: Prettier completes successfully. If it changes files, review the diff before committing.

- [ ] **Step 6: Run final build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit formatting or verification fixes**

If `git status --short` shows changes after format/build fixes:

```bash
git add src app
git commit -m "chore(styles): 디자인 토큰 전환 검증 정리"
```

If `git status --short` is empty, do not create an empty commit.

---

## Self-Review

- Spec coverage: The plan creates `src/shared/styles/tokens`, defines color/typography/dimension/spacing/radius/motion scale and semantic tokens, keeps dark default + light override, wires `theme.css.ts`, `global.css.ts`, `sprinkles.css.ts`, Button, Switch, Progress, and theme reveal.
- Scope check: It does not attempt a full visual redesign of all shared UI. Remaining `.css.ts` files are only mechanically migrated enough to compile against the new contract.
- Placeholder scan: No TBD/TODO placeholders. Mechanical migrations have exact mapping tables.
- Type consistency: Token names match the spec: `color.fg/bg/stroke`, `dimension`, `spacing`, `radius`, `duration`, `easing`, `motion`.
