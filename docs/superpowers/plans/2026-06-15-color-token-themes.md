# 시간대 4테마 색 토큰 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 단일 테마(`theme.css.ts`)를 "감성 카페" 무드의 시간대 4테마(오후/노을/밤/새벽) 색 토큰으로 확장한다.

**Architecture:** 테스트 가능성을 위해 **순수 색 값(plain `themes.ts`)** 과 **vanilla-extract 바인딩(`theme.css.ts`)** 을 분리한다. 값은 plain 객체라 빌드 없이 단위 테스트하고, 바인딩은 기존 `createThemeContract` 위에 `createTheme`을 1개→4개로 늘린다. 기본 적용 테마는 오후(라이트).

**Tech Stack:** TypeScript, vanilla-extract(`@vanilla-extract/css`), Vitest, Next App Router, FSD(shared 레이어).

**Spec:** [docs/superpowers/specs/2026-06-15-color-token-themes-design.md](../specs/2026-06-15-color-token-themes-design.md)

---

## File Structure

- **Create** `src/shared/styles/themes.ts` — 4테마의 순수 색 값(plain data) + 타입(`ThemeName`, `ThemeValues`). vanilla-extract 비의존.
- **Create** `src/shared/styles/themes.test.ts` — 색 값의 구조 불변식 테스트(역할 완비·hex 유효·테마 간 구분).
- **Create** `src/shared/styles/theme.css.test.ts` — 4테마 클래스가 컴파일되어 비지 않은 문자열인지 스모크 테스트.
- **Modify** `src/shared/styles/theme.css.ts` — 컨트랙트 유지, `defaultThemeClass`(단일) → 4개 `createTheme` 클래스 + `themeClasses` 레코드.
- **Modify** `src/shared/styles/index.ts` — 배럴 재노출 갱신(`defaultThemeClass` 제거, 4클래스·`themeClasses`·`ThemeName` 추가).
- **Modify** `app/layout.tsx` — `<html>` 적용 클래스 `defaultThemeClass` → `afternoonThemeClass`.

---

## Task 1: 테마 색 값 데이터 + 구조 테스트

**Files:**
- Create: `src/shared/styles/themes.ts`
- Test: `src/shared/styles/themes.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/shared/styles/themes.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { themeValues, type ThemeName } from './themes';

const names = Object.keys(themeValues) as ThemeName[];
const ROLES = ['background', 'surface', 'text', 'muted', 'border', 'accent'];

describe('themeValues', () => {
  it('시간대 4테마를 순서대로 정의한다', () => {
    expect(names).toEqual(['afternoon', 'sunset', 'night', 'dawn']);
  });

  it('모든 테마가 같은 색 역할 6개를 갖는다', () => {
    for (const name of names) {
      expect(Object.keys(themeValues[name].color).sort()).toEqual([...ROLES].sort());
    }
  });

  it('모든 색 값이 유효한 6자리 hex 다', () => {
    for (const name of names) {
      for (const value of Object.values(themeValues[name].color)) {
        expect(value).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it('테마별 background 가 서로 달라 복붙 실수를 막는다', () => {
    const backgrounds = names.map((n) => themeValues[n].color.background);
    expect(new Set(backgrounds).size).toBe(names.length);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/styles/themes.test.ts`
Expected: FAIL — `Failed to resolve import "./themes"` (파일 없음).

- [ ] **Step 3: 색 값 데이터 구현**

`src/shared/styles/themes.ts`:

```ts
/** 시간대 4테마의 순수 색 값 — vanilla-extract 바인딩(theme.css)과 분리해 빌드 없이 테스트 가능하게 둔다 */

/** 테마 키 — 하루 시간대 순서(오후→노을→밤→새벽) */
export type ThemeName = 'afternoon' | 'sunset' | 'night' | 'dawn';

/** 토큰 컨트랙트와 같은 모양의 값 — theme.css 의 vars 와 1:1 대응 */
export interface ThemeValues {
  color: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
  };
  font: { body: string; mono: string };
  radius: { sm: string; md: string; lg: string };
}

// font·radius 는 4테마 공통 — 한 번 정의해 각 테마에 펼친다(DRY)
const font = {
  body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
};
const radius = { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' };

/** 오후 — 쩅하게 밝은 대낮(라이트), accent=꿀빛 골드 */
export const afternoon: ThemeValues = {
  color: { background: '#eef4fb', surface: '#ffffff', text: '#1c2630', muted: '#5d6b7a', border: '#d8e2ee', accent: '#c79338' },
  font,
  radius,
};

/** 노을 — 저녁 6~7시 웜 더스크, accent=잉걸불 */
export const sunset: ThemeValues = {
  color: { background: '#2c2030', surface: '#3a2b3c', text: '#f6e7d6', muted: '#c2a18d', border: '#4f3b49', accent: '#e07a45' },
  font,
  radius,
};

/** 밤 — 10시 이후 검은색에 가까운 차가운 밤, accent=달빛 아이보리 */
export const night: ThemeValues = {
  color: { background: '#0a0b10', surface: '#14161e', text: '#e7eaf3', muted: '#8a93ac', border: '#232838', accent: '#d8c39a' },
  font,
  radius,
};

/** 새벽 — 남보라 트와일라잇, accent=옅은 장미 */
export const dawn: ThemeValues = {
  color: { background: '#1b2038', surface: '#262b46', text: '#e9eaf6', muted: '#a3a8cb', border: '#353b59', accent: '#cf8f86' },
  font,
  radius,
};

/** 테마 키 → 값 — 순회·전환의 단일 출처 */
export const themeValues: Record<ThemeName, ThemeValues> = { afternoon, sunset, night, dawn };
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/shared/styles/themes.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: 커밋**

```bash
git add src/shared/styles/themes.ts src/shared/styles/themes.test.ts
git commit -m "feat: 시간대 4테마 색 값 데이터·구조 테스트 추가"
```

---

## Task 2: vanilla-extract 4테마 바인딩 + 배럴 + 기본 테마 배선

**Files:**
- Modify: `src/shared/styles/theme.css.ts`
- Modify: `src/shared/styles/index.ts`
- Modify: `app/layout.tsx`
- Test: `src/shared/styles/theme.css.test.ts`

- [ ] **Step 1: 실패하는 스모크 테스트 작성**

`src/shared/styles/theme.css.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  afternoonThemeClass,
  sunsetThemeClass,
  nightThemeClass,
  dawnThemeClass,
  themeClasses,
} from './theme.css';

describe('theme classes', () => {
  it('4테마 클래스가 모두 비지 않은 문자열로 컴파일된다', () => {
    for (const cls of [afternoonThemeClass, sunsetThemeClass, nightThemeClass, dawnThemeClass]) {
      expect(typeof cls).toBe('string');
      expect(cls.length).toBeGreaterThan(0);
    }
  });

  it('themeClasses 레코드가 4테마 키를 모두 노출한다', () => {
    expect(Object.keys(themeClasses).sort()).toEqual(['afternoon', 'dawn', 'night', 'sunset']);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/styles/theme.css.test.ts`
Expected: FAIL — `afternoonThemeClass` 등이 export 되지 않음.

- [ ] **Step 3: `theme.css.ts` 를 4테마로 교체**

`src/shared/styles/theme.css.ts` 전체를 다음으로 교체(컨트랙트는 유지, 단일 `defaultThemeClass` 제거):

```ts
import { createTheme, createThemeContract } from '@vanilla-extract/css';
import { afternoon, sunset, night, dawn, type ThemeName } from './themes';

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

/** 테마 키 → 클래스명 — 전환 시 단일 출처 */
export const themeClasses: Record<ThemeName, string> = {
  afternoon: afternoonThemeClass,
  sunset: sunsetThemeClass,
  night: nightThemeClass,
  dawn: dawnThemeClass,
};
```

- [ ] **Step 4: 배럴 `index.ts` 갱신**

`src/shared/styles/index.ts` 전체를 다음으로 교체:

```ts
export { bp } from './breakpoints';
export { sprinkles } from './sprinkles.css';
export {
  vars,
  afternoonThemeClass,
  sunsetThemeClass,
  nightThemeClass,
  dawnThemeClass,
  themeClasses,
} from './theme.css';
export type { ThemeName } from './themes';
```

- [ ] **Step 5: `app/layout.tsx` 기본 테마 교체**

`app/layout.tsx`의 import 와 `<html>` className 두 줄을 교체:

기존:
```tsx
import { defaultThemeClass } from '@/shared/styles/theme.css';
```
→ 변경:
```tsx
import { afternoonThemeClass } from '@/shared/styles/theme.css';
```

기존:
```tsx
    <html
      lang='ko'
      className={defaultThemeClass}>
```
→ 변경:
```tsx
    <html
      lang='ko'
      className={afternoonThemeClass}>
```

- [ ] **Step 6: 스모크 테스트 + 타입체크 통과 확인**

Run: `npx vitest run src/shared/styles/theme.css.test.ts && npm run type-check`
Expected: 테스트 PASS(2) + 타입체크 에러 없음(`defaultThemeClass` 잔존 참조 0건).

- [ ] **Step 7: 커밋**

```bash
git add src/shared/styles/theme.css.ts src/shared/styles/theme.css.test.ts src/shared/styles/index.ts app/layout.tsx
git commit -m "feat: 단일 테마를 시간대 4테마(오후/노을/밤/새벽)로 확장"
```

---

## Task 3: 전체 CI 검증

**Files:** 없음(검증 전용)

- [ ] **Step 1: 전체 파이프라인 실행**

Run: `npm run ci`
Expected: `fsd → lint → type-check → test → build` 전부 PASS.

- [ ] **Step 2: 실패 시 처리**

- `npm run fsd`(Steiger)가 배럴 미사용 export 를 지적하면, `index.ts`에서 실제로 소비되지 않는 항목만 제거한다(최소 유지: `vars`, `afternoonThemeClass`, `themeClasses`, `ThemeName`).
- 그 외 실패는 메시지대로 수정 후 `npm run ci` 재실행.

- [ ] **Step 3: (이미 모두 커밋됨)**

Task 1·2에서 커밋 완료. Task 3에서 수정이 발생했을 때만 추가 커밋:

```bash
git add -A
git commit -m "fix: 4테마 토큰 CI 통과 보정"
```

---

## Self-Review

- **Spec coverage:**
  - 컨트랙트 6역할 + radius + font → Task 2 `vars` 유지. ✓
  - 4테마 hex 값 → Task 1 `themes.ts`(스펙 §4 표와 일치). ✓
  - `createTheme` 1→4개, 기본=오후 → Task 2 Step 3·5. ✓
  - 비범위(이펙트) → 토큰에 그림자·hover·glass 역할 미추가. ✓
- **Placeholder scan:** TBD/“적절히 처리” 등 없음. 모든 스텝에 실제 코드·명령. ✓
- **Type consistency:** `ThemeName`/`ThemeValues`/`themeValues`(themes.ts) ↔ `afternoonThemeClass`·`sunsetThemeClass`·`nightThemeClass`·`dawnThemeClass`·`themeClasses`(theme.css.ts) 이름이 Task 1·2·배럴·layout 전반에서 일치. ✓
- **비고:** `vars`·`sprinkles` 소비처(global.css·sprinkles.css·*.css.ts)는 컨트랙트 모양이 안 바뀌므로 무변경. `defaultThemeClass` 제거의 유일한 잔존 참조는 layout(Task 2 Step 5)·배럴(Step 4)이며 둘 다 동일 태스크에서 갱신.
