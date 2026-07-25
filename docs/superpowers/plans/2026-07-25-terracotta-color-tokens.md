# 테라코타 컬러 토큰 재정립 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 설계 근거: `specs/2026-07-25-design-system-terracotta-retheme-design.md` (§1 컬러 시스템). 이 플랜은 그 스펙의 **플랜 1(컬러 토큰 재정립)** 만 다룬다. 모션·재질·컴포넌트 리스타일(플랜 2), 나머지 프리미티브(플랜 3), blog:import 은퇴, ESLint 토큰 규율은 별도 플랜.

**Goal:** raw 팔레트를 "황혼의 프라하" 테라코타 램프로 교체하고 시맨틱(라이트=대낮/다크=밤)을 재매핑해, 전 컴포넌트가 `vars.color.*` 경유로 자동 재도색되게 한다.

**Architecture:** 컴포넌트는 이미 `vars.color.{fg,bg,stroke}.*`(semantic)만 참조한다 — `palette`(raw) 직접 소비처는 `tokens/index.ts` 재노출뿐. 따라서 `palette.ts`(램프) + `semantic.ts`(매핑) 두 파일만 바꾸면 전역 색이 갈린다. 유일한 컨트랙트 확장은 `bg.critical` 1개(브랜드=테라코타라 `onBrand`가 크림이 되며 기존 `criticalSolid`가 `fg.critical`을 배경으로 쓰던 패턴이 깨짐 — 스펙 §1.4).

**Tech Stack:** vanilla-extract(`createThemeContract`/`createGlobalTheme`/`assignVars`), TypeScript, Vitest.

## Global Constraints

- 다크(`night`)가 `:root` 기본, 라이트는 `:root[data-theme="light"]`. OS 스킴 미추종. (`theme.css.ts` 기존 구조 유지)
- 컨트랙트 모양은 `bg.critical` 1개만 추가(`bg` 12→13). `fg`(9)·`stroke`(7)·나머지 카테고리는 불변.
- raw hex는 `palette.ts`에 두고, `semantic.ts`는 팔레트 참조 + 소수의 맥락색(brand-solid·warm weak tint·overlay)만 인라인 허용(토큰 정의 파일). 컴포넌트는 절대 raw hex 금지.
- 파일 헤더·모든 export는 단일 라인 JSDoc(`/** ... */`). 멀티라인 블록·`@param`·코드 받아쓰기 금지.
- 테스트 describe/it 설명문은 한국어, 고유 식별자만 영문.
- per-task 검증에 `npm run lint` 포함. 마무리 전체 검증: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`.
- 색 대비는 스펙 §5 반영값 기준(dark muted #CDB891·brand #DE9A5E, criticalSolid=bg.critical). 값 변경 금지 — 이미 코덱스 리뷰로 AA 조정됨.

---

## Task 1: 테라코타 팔레트 + 시맨틱 + 컨트랙트

**Files:**
- Modify: `src/shared/styles/tokens/color/palette.ts` (전체 교체)
- Modify: `src/shared/styles/tokens/color/semantic.ts` (전체 교체)
- Modify: `src/shared/styles/theme.css.ts` (contract `bg` 블록에 `critical` 추가)
- Test: `src/shared/styles/tokens/tokens.test.ts` (green→terracotta 단언 교체 + bg.critical 검증 추가)

**Interfaces:**
- Consumes: 없음 (foundation).
- Produces: `palette`(램프 객체 `sand/clay/verdigris/amber/rose/river/critical/static`), `lightColor`/`darkColor`(`SemanticColor`), `SemanticColor`(인터페이스, `bg.critical` 포함). `theme.css.ts`의 `vars.color.bg.critical` 신규.

- [ ] **Step 1: 실패 테스트 작성**

`src/shared/styles/tokens/tokens.test.ts`에서 기존 `it('green brand와 positive semantic을 둘 다 제공한다', ...)` 블록을 아래 두 블록으로 교체한다(다른 `it`·`flattenKeys`·parity 테스트는 그대로 둔다):

```ts
  it('terracotta brand와 verdigris positive semantic을 제공한다', () => {
    expect(lightColor.fg.brand).toBe(palette.clay[700]);
    expect(darkColor.fg.positive).toBe(palette.verdigris[300]);
    expect(darkColor.bg.canvas).toBe(palette.sand[900]);
  });

  it('bg.critical(솔리드)이 brand와 구분되는 별도 레드다', () => {
    expect(lightColor.bg.critical).toBe(palette.critical[500]);
    expect(darkColor.bg.critical).toBe(palette.critical[500]);
    expect(darkColor.bg.critical).not.toBe(darkColor.bg.brand);
  });
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- tokens`
Expected: FAIL — `palette.clay`/`palette.verdigris`/`bg.critical` 미존재(현재 팔레트는 green/gray, `bg.critical` 없음). 타입/런타임 에러.

- [ ] **Step 3: 팔레트 교체**

`src/shared/styles/tokens/color/palette.ts` 전체를 아래로 교체:

```ts
/** raw color palette — "황혼의 프라하" 테라코타 foundation. 채도/명도 램프 */
export const palette = {
  sand: {
    '00': '#FBF7EF',
    100: '#F4EADA',
    200: '#E3D0AE',
    300: '#CDB891',
    400: '#A99A80',
    500: '#8E8577',
    600: '#6F675B',
    700: '#565049',
    800: '#46423B',
    900: '#3D3B36',
    1000: '#2A2823',
  },
  clay: {
    100: '#F1CDAD',
    300: '#DE9A5E',
    400: '#D3803A',
    500: '#B4553A',
    600: '#9C4632',
    700: '#8F3F26',
    900: '#552616',
  },
  verdigris: {
    100: '#D7E3DD',
    300: '#93B0A4',
    500: '#6D9184',
    600: '#587A6D',
    700: '#496459',
    900: '#2B3933',
  },
  amber: {
    100: '#F8E6C0',
    300: '#EFCB87',
    500: '#E0A94F',
    700: '#B27F31',
    900: '#6E4E1E',
  },
  rose: {
    100: '#EBD3CB',
    300: '#DCA99D',
    500: '#C98C7D',
    700: '#9E6355',
    900: '#5E3A31',
  },
  river: {
    100: '#DDE6EB',
    300: '#A8C0CE',
    500: '#7B96A8',
    700: '#4E687A',
    900: '#26333B',
  },
  critical: {
    100: '#FBEAE7',
    200: '#E7998F',
    500: '#A9302A',
    600: '#C0392B',
    700: '#7D2019',
    800: '#921F16',
    1000: '#3A201D',
  },
  static: {
    black: '#000000',
    white: '#ffffff',
    transparent: '#00000000',
  },
} as const;
```

- [ ] **Step 4: 시맨틱 교체**

`src/shared/styles/tokens/color/semantic.ts` 전체를 아래로 교체(인터페이스에 `bg.critical` 추가):

```ts
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
```

- [ ] **Step 5: 컨트랙트에 `bg.critical` 추가**

`src/shared/styles/theme.css.ts`의 `vars` 컨트랙트 `color.bg` 블록에서 `criticalWeak: null,` 바로 앞에 `critical: null,`를 추가한다:

```ts
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
```

- [ ] **Step 6: 테스트·타입 통과 확인**

Run: `npm test -- tokens && npx tsc --noEmit`
Expected: PASS. tokens.test의 parity 테스트가 `bg.critical`을 포함해 light/dark 동일 key 확인, 타입은 `SemanticColor`·컨트랙트·테마값 3자가 일치.

- [ ] **Step 7: 린트·fsd**

Run: `npm run lint && npm run fsd`
Expected: PASS.

- [ ] **Step 8: 커밋**

```bash
git add src/shared/styles/tokens/color/palette.ts src/shared/styles/tokens/color/semantic.ts src/shared/styles/theme.css.ts src/shared/styles/tokens/tokens.test.ts
git commit -m "feat(tokens): refound color palette on terracotta, add bg.critical"
```

---

## Task 2: criticalSolid 배경을 `bg.critical`로 재매핑

**Files:**
- Modify: `src/shared/ui/Button/Button.css.ts:170`

**Interfaces:**
- Consumes: `vars.color.bg.critical` (Task 1 신규).
- Produces: 없음 (Button 내부 스타일).

- [ ] **Step 1: criticalSolid 배경 교체**

`src/shared/ui/Button/Button.css.ts`의 `variants.variant.criticalSolid`에서 배경을 `fg.critical` → `bg.critical`로 바꾼다. 라벨(`color`)은 `fg.onBrand`(크림) 유지:

```ts
      criticalSolid: {
        background: vars.color.bg.critical,
        color: vars.color.fg.onBrand,
```

(같은 파일 하단 `compoundVariants`의 `criticalSolid`(≈358행)는 `data-loading`에서 `stroke.critical`, disabled에서 `bg.disabled`만 참조하므로 변경 없음 — 확인만 한다.)

- [ ] **Step 2: 타입·기존 Button 테스트 회귀 확인**

Run: `npx tsc --noEmit && npm test -- Button`
Expected: PASS (Button 테스트는 role/loading/asChild 계약 검증이라 색 단언 없음 — 회귀 없어야 함).

- [ ] **Step 3: 린트**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 4: 커밋**

```bash
git add src/shared/ui/Button/Button.css.ts
git commit -m "fix(button): map criticalSolid background to bg.critical for terracotta"
```

---

## Task 3: 전역 재도색 검증 + 회귀 정리

**Files:**
- (조건부) 회귀가 발견된 파일만.

**Interfaces:**
- Consumes: Task 1·2 산출물.
- Produces: 없음.

- [ ] **Step 1: 전체 검증 실행**

Run: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`
Expected: 전부 PASS. (컴포넌트가 `vars.color.*`만 참조하므로 색 변경이 타입/빌드를 깨지 않아야 함.)

- [ ] **Step 2: raw hex/구팔레트 잔재 스캔**

Run: `grep -rnE "palette\.(gray|green|red|yellow|blue)" src` 그리고 `grep -rnE "#[0-9a-fA-F]{6}" src/shared/ui src/pages src/widgets src/features`
Expected: 전자는 결과 없음(구 팔레트 참조 잔재 없음). 후자에서 나온 하드코딩 hex는 목록화 — 컴포넌트/페이지에 raw hex가 있으면 해당 의미의 `vars.color.*`로 교체(외과적으로 그 줄만). 토큰 정의 파일(`tokens/**`)·스토리·테스트의 hex는 제외.

- [ ] **Step 3: 육안 확인 (수동)**

Run: `npm run dev` 후 `/`, `/blog`, `/admin/login` 확인. 그리고 `npm run storybook`으로 Button(criticalSolid 포함)·AlertDialog·LoginForm 확인.
Expected: 다크(기본)에서 테라코타 캔버스+크림 텍스트, 삭제 버튼이 별도 레드로 읽힘, disabled/muted 텍스트가 배경과 구분됨. 라이트(`data-theme="light"`) 토글 시 대낮 톤. 깨진 대비·안 읽히는 텍스트가 있으면 Step 4.

- [ ] **Step 4: (조건부) 회귀 수정**

Step 2·3에서 발견된 것만 외과적으로 수정한다. raw hex → 의미 토큰 교체, 혹은 색 단언이 깨진 테스트가 있으면 새 팔레트 기준으로 갱신. 없으면 이 스텝은 건너뛴다.

- [ ] **Step 5: 재검증·커밋 (수정이 있었을 때만)**

Run: `npm run lint && npm run type-check && npm run test`
```bash
git add -A
git commit -m "fix(styles): replace stray raw colors with semantic tokens after retheme"
```

---

## Self-Review 결과 (스펙 §1 대비)

- **팔레트 램프(§1.1):** sand/clay/verdigris/amber/rose/river/critical 전부 Task 1 Step 3에 반영. `river`(파랑) 포함.
- **시맨틱 매핑(§1.2) dark/light:** Task 1 Step 4에 전 key 반영. 코덱스 AA 조정값(dark muted `sand300`·brand `clay300`) 반영.
- **brand-solid #A64C34(§1.3):** light/dark `bg.brand` 공통 적용.
- **criticalSolid 재매핑·bg.critical(§1.4):** 컨트랙트 추가(Task 1 Step 5) + Button 재매핑(Task 2).
- **회귀(§6):** Task 3에서 전역 검증 + raw hex 스캔.
- **범위 밖(플랜 2/3, blog 은퇴, ESLint):** 이 플랜에 미포함 — 의도적.
- 타입 일관성: `SemanticColor.bg.critical`(Task1) ↔ `vars.color.bg.critical` 컨트랙트(Task1) ↔ `bg.critical` 소비(Task2) 이름 일치.
