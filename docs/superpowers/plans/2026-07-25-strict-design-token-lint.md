# 엄격 토큰 규율 ESLint 규칙 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `*.css.ts`에서 raw 디자인 값(하드코딩 치수·색)을 ESLint로 차단하고, 기존 위반 100건을 전수 마이그레이션한다.

**Architecture:** 먼저 빈 토큰 레이어를 채운다(`container` 5역할, `fontSize[40]`, `text.headingXl`). 그다음 로컬 ESLint 플러그인(`eslint-rules/*.mjs`)을 TDD로 만들어 `warn`으로 켠 뒤, 그룹별로 위반을 치환하고 마지막에 `error`로 승격한다.

**Tech Stack:** ESLint 9.39 flat config · vanilla-extract 1.20 · vitest + ESLint RuleTester · Node 22

**설계 스펙:** [docs/superpowers/specs/2026-07-25-strict-design-token-lint-design.md](../specs/2026-07-25-strict-design-token-lint-design.md)

## Global Constraints

- **브랜치:** `redesign`에 그대로 커밋한다. **push·브랜치 생성·파괴적 git 명령 금지** — 사용자가 직접 한다.
- **커밋:** conventional commits. 메시지 끝에 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- **태스크별 검증:** `npm run fsd && npm run lint && npm run type-check && npm run test`. **`npm run build`는 실행하지 않는다** — blog SSG가 로컬 Supabase(127.0.0.1:54321)를 요구해 미기동 시 코드와 무관하게 실패한다.
- **prettier 필수:** 커밋 전 반드시 `npx prettier --write <바뀐 파일 전부>`를 실행한다.
- **주석 규약:** 파일 헤더와 모든 export는 **단일 라인** JSDoc(`/** ... */`). 본문 안 비자명 로직만 한 줄 `//` 주석으로 WHY(의도·함정). **멀티라인 블록·`@param` 태그·코드 받아쓰기 금지.**
- **테스트 설명:** `describe`/`it` 설명문은 한국어. 고유 식별자만 영문.
- **외과적 변경:** 지정된 줄만 고친다. 인접 코드·포맷을 "개선"하지 않는다.
- **선재 이슈 — 건드리지 말 것:** `post.types`·`PostFilterForm.css`·`Divider.tsx`에 prettier 드리프트가 이미 있다. 이 작업과 무관하다.
- **`vars` import:** 마이그레이션 대상 파일은 **전부 이미 `vars`를 import 하고 있다.** import 추가가 필요한 파일은 없다.

### 공통 치환 매핑

**치수 속성**(`width`·`height`·`min/maxWidth`·`minHeight`·`padding*`·`margin*`·`outlineOffset`):

| raw        | 치환                                    |
| ---------- | --------------------------------------- |
| `'0.25rem'`  | `vars.dimension.x1`                   |
| `'0.5rem'`   | `vars.dimension.x2`                   |
| `'0.625rem'` | `vars.dimension.x2_5`                 |
| `'0.75rem'`  | `vars.dimension.x3`                   |
| `'1rem'`     | `vars.dimension.x4`                   |
| `'1.25rem'`  | `vars.dimension.x5`                   |
| `'1.5rem'`   | `vars.dimension.x6`                   |
| `'2.5rem'`   | `vars.dimension.x10`                  |
| `'2px'`      | `vars.dimension.x0_5`                 |
| `'-2px'`     | `` `calc(${vars.dimension.x0_5} * -1)` `` |

**`fontSize` 속성** — 같은 rem 값이라도 위 표가 아니라 이 표를 쓴다:

| raw          | 치환                             |
| ------------ | -------------------------------- |
| `'0.8125rem'` | `vars.typography.fontSize[14]`  |
| `'0.875rem'`  | `vars.typography.fontSize[14]`  |
| `'1rem'`      | `vars.typography.fontSize[16]`  |
| `'1.125rem'`  | `vars.typography.fontSize[20]`  |
| `'1.25rem'`   | `vars.typography.fontSize[20]`  |
| `'1.5rem'`    | `vars.typography.fontSize[24]`  |
| `'2rem'`      | `vars.typography.fontSize[32]`  |
| `'2.5rem'`    | `vars.typography.fontSize[40]`  |

**컨테이너 폭**(`maxWidth`):

| raw                    | 치환                      |
| ---------------------- | ------------------------- |
| `'20rem'`              | `vars.container.form`     |
| `'28rem'` · `'32rem'`  | `vars.container.dialog`   |
| `'42rem'` · `'48rem'`  | `vars.container.prose`    |
| `'56rem'`              | `vars.container.page`     |
| `'64rem'` · `'72rem'`  | `vars.container.wide`     |

**radius:** `'9999px'` → `vars.radius.pill`

**escape hatch 5건** — 치환하지 않고 아래 주석을 붙인다:

```ts
// eslint-disable-next-line design-tokens/no-raw-design-values -- <이유>
```

| 위치                                        | 값       | 이유 문구                  |
| ------------------------------------------- | -------- | -------------------------- |
| `Select.css.ts:19` · `:100` `minWidth`      | `10rem`  | 컴포넌트 고유 최소폭       |
| `DropdownMenu.css.ts:11` `minWidth`         | `8rem`   | 컴포넌트 고유 최소폭       |
| `lab-transition/PreviewStage.css.ts:33`     | `4.5rem` | 랩 데모 트랙 치수          |
| `lab-animation/PreviewStage.css.ts:33`      | `5.5rem` | 랩 데모 트랙 치수          |

---

### Task 1: container 토큰 신설 + 5파일 배선

**Files:**

- Create: `src/shared/styles/tokens/dimension/container.ts`
- Modify: `src/shared/styles/tokens/dimension/index.ts`
- Modify: `src/shared/styles/tokens/index.ts:26`
- Modify: `src/shared/styles/theme.types.ts`
- Modify: `src/shared/styles/theme.css.ts:141`
- Modify: `src/shared/styles/themes/night.ts`
- Modify: `src/shared/styles/themes/light.ts`
- Test: `src/shared/styles/tokens/tokens.test.ts`

**Interfaces:**

- Produces: `container` — `{ form: '20rem', dialog: '32rem', prose: '48rem', page: '56rem', wide: '72rem' }`. Task 6·7·8·9·10이 `vars.container.*`로 소비한다.

`tokens/index.ts`와 `theme.types.ts`는 최상위 그룹을 **명시적으로 열거**한다. 둘 중 하나라도 빠뜨리면 `night.ts`·`light.ts`가 excess property 에러를 낸다.

- [ ] **Step 1: 실패하는 테스트 작성**

`src/shared/styles/tokens/tokens.test.ts`의 import 블록에 `container`를 추가하고(`spacing,` 다음 줄), `'dimension scale과 semantic spacing을 분리한다'` it 블록 **아래**에 다음을 넣는다.

```ts
it('container semantic 폭을 역할별로 제공한다', () => {
  expect(container.form).toBe('20rem');
  expect(container.dialog).toBe('32rem');
  expect(container.prose).toBe('48rem');
  expect(container.page).toBe('56rem');
  expect(container.wide).toBe('72rem');
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/styles/tokens/tokens.test.ts`
Expected: FAIL — `container`가 `.`에서 export되지 않아 import 에러.

- [ ] **Step 3: container 토큰 정의**

Create `src/shared/styles/tokens/dimension/container.ts`:

```ts
/** semantic container tokens — 페이지·오버레이 폭을 역할로 고정한다 */

/** container width aliases — 값 8종으로 갈렸던 폭을 역할 5종으로 통합한다 */
export const container = {
  form: '20rem',
  dialog: '32rem',
  prose: '48rem',
  page: '56rem',
  wide: '72rem',
} as const;
```

- [ ] **Step 4: 배럴 2단 재노출**

`src/shared/styles/tokens/dimension/index.ts` 끝에 추가:

```ts
/** semantic container 재노출 */
export { container } from './container';
```

`src/shared/styles/tokens/index.ts`의 `export { dimension, spacing } from './dimension';`를 다음으로 교체:

```ts
export { dimension, spacing, container } from './dimension';
```

- [ ] **Step 5: 테마 타입·컨트랙트 배선**

`src/shared/styles/theme.types.ts` — import 목록의 `spacing,` 다음에 `container,`를 넣고, `ThemeValues`의 `spacing: typeof spacing;` 다음 줄에 추가:

```ts
  container: typeof container;
```

`src/shared/styles/theme.css.ts` — `spacing: { ... },` 블록 **뒤**에 추가:

```ts
  container: {
    form: null,
    dialog: null,
    prose: null,
    page: null,
    wide: null,
  },
```

- [ ] **Step 6: 두 테마에 주입**

`src/shared/styles/themes/night.ts`와 `src/shared/styles/themes/light.ts` **양쪽 모두** 아래 두 곳을 고친다. 두 테마가 **동일 객체**를 주입한다(테마 불변).

- `from '../tokens'` import 목록 **맨 앞**에 `container,`를 넣는다 — 기존 목록이 알파벳 순이고 `container` < `darkColor` < `dimension`이다.
- 객체 리터럴의 `spacing,` 다음 줄에 `container,`를 추가한다.

`night.ts` 결과 예시:

```ts
import {
  container,
  darkColor,
  dimension,
  duration,
  easing,
  motion,
  radius,
  spacing,
  typography,
} from '../tokens';
```

- [ ] **Step 7: 테스트 통과 확인**

Run: `npx vitest run src/shared/styles/tokens/tokens.test.ts && npm run type-check`
Expected: 테스트 PASS, type-check 통과. `type-check`가 통과하면 5파일 배선이 빠짐없이 됐다는 뜻이다.

- [ ] **Step 8: 검증 + 커밋**

```bash
npx prettier --write src/shared/styles/tokens/dimension/container.ts src/shared/styles/tokens/dimension/index.ts src/shared/styles/tokens/index.ts src/shared/styles/theme.types.ts src/shared/styles/theme.css.ts src/shared/styles/themes/night.ts src/shared/styles/themes/light.ts src/shared/styles/tokens/tokens.test.ts
npm run fsd && npm run lint && npm run type-check && npm run test
git add src/shared/styles
git commit -m "feat(tokens): add semantic container widths

페이지·오버레이 폭 8종을 역할 5종(form·dialog·prose·page·wide)으로 통합.
tokens/index·theme.types 가 최상위 그룹을 명시 열거하므로 함께 배선한다.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: fontSize[40] + text.headingXl

**Files:**

- Modify: `src/shared/styles/tokens/typography/scale.ts:8-15`
- Modify: `src/shared/styles/tokens/typography/text.ts`
- Modify: `src/shared/styles/theme.css.ts` (contract의 `typography.fontSize`·`typography.text`)
- Test: `src/shared/styles/tokens/tokens.test.ts`

**Interfaces:**

- Consumes: 없음 (Task 1과 독립).
- Produces: `fontSize[40] = '2.5rem'`, `text.headingXl`. Task 7·8·9가 `vars.typography.fontSize[40]`로 소비한다.

`night`·`light`·`theme.types.ts`는 `typography` 객체를 통째로 넘기므로 **자동 반영된다** — Task 1과 달리 최상위 그룹이 늘지 않기 때문이다.

- [ ] **Step 1: 실패하는 테스트 작성**

`src/shared/styles/tokens/tokens.test.ts`의 `'typography semantic text style은 CSS text 속성을 가진다'` it 블록 **아래**에 추가:

```ts
it('페이지 h1용 headingXl과 40px 스케일을 제공한다', () => {
  expect(typography.fontSize[40]).toBe('2.5rem');
  expect(typography.text.headingXl).toMatchObject({
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize[40],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/styles/tokens/tokens.test.ts`
Expected: FAIL — `typography.fontSize[40]`이 `undefined`.

- [ ] **Step 3: 스케일과 semantic text 확장**

`src/shared/styles/tokens/typography/scale.ts`의 `fontSize` 객체에서 `32: '2rem',` 다음 줄에 추가:

```ts
  40: '2.5rem',
```

`src/shared/styles/tokens/typography/text.ts`의 `text` 객체에서 `headingLg` 블록 **뒤**에 추가:

```ts
  headingXl: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[40],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
```

- [ ] **Step 4: 컨트랙트 확장**

`src/shared/styles/theme.css.ts`의 `typography.fontSize`에서 `32: null,` 다음 줄에 `40: null,`을 추가하고, `typography.text`의 `headingLg` 블록 뒤에 추가:

```ts
      headingXl: {
        fontFamily: null,
        fontSize: null,
        lineHeight: null,
        fontWeight: null,
      },
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/styles/tokens/tokens.test.ts && npm run type-check`
Expected: PASS + type-check 통과.

- [ ] **Step 6: 검증 + 커밋**

```bash
npx prettier --write src/shared/styles/tokens/typography/scale.ts src/shared/styles/tokens/typography/text.ts src/shared/styles/theme.css.ts src/shared/styles/tokens/tokens.test.ts
npm run fsd && npm run lint && npm run type-check && npm run test
git add src/shared/styles
git commit -m "feat(tokens): add fontSize 40 and text.headingXl

페이지 h1(2.5rem)이 5곳에서 raw 로 쓰이던 걸 스케일·semantic 으로 승격.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: ESLint 규칙 — raw 치수 차단

**Files:**

- Create: `eslint-rules/no-raw-design-values.mjs`
- Create: `eslint-rules/index.mjs`
- Test: `eslint-rules/no-raw-design-values.test.mjs`

**Interfaces:**

- Produces: default export 규칙 객체(`meta` + `create`), messageId `rawDimension`. `eslint-rules/index.mjs`는 `{ rules: { 'no-raw-design-values': rule } }`를 default export한다. Task 4가 같은 파일에 색 검사를 추가하고, Task 5가 플러그인을 flat config에 배선한다.

`eslint-rules/`를 `src/` 밖에 두는 이유는 `npm run fsd`(`steiger ./src`)가 FSD 레이어 위반으로 잡기 때문이다. `.mjs`인 이유는 `eslint.config.mjs`가 빌드 스텝 없이 직접 import하기 위해서다.

**주의:** 이 레포의 flat config 공통 룰(`curly: all`, `arrow-body-style: always`, `brace-style` 단일라인 금지)이 `eslint-rules/*.mjs`에도 적용된다. 화살표 함수는 반드시 블록 바디, 모든 `if`는 중괄호.

- [ ] **Step 1: 실패하는 테스트 작성**

Create `eslint-rules/no-raw-design-values.test.mjs`:

```js
/** no-raw-design-values 규칙 테스트 — RuleTester 를 vitest 러너에 물린다 */
import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-raw-design-values.mjs';

// RuleTester 가 this.constructor.describe/it 을 호출한다 — 주입해야 케이스가 개별 테스트로 뜬다
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

describe('raw 치수 리터럴 차단', () => {
  ruleTester.run('no-raw-design-values', rule, {
    valid: [
      { code: 'const a = { padding: vars.dimension.x4 };' },
      { code: "const a = { width: '100%' };" },
      { code: "const a = { width: '90vw' };" },
      { code: "const a = { width: '1em' };" },
      { code: "const a = { height: 'auto' };" },
      { code: "const a = { inset: '0' };" },
      { code: "const a = { maxHeight: 'calc(100dvh - 2rem)' };" },
      { code: "const a = { transform: 'translateY(-2px)' };" },
      { code: "const a = { border: '1px solid transparent' };" },
      // 헤어라인 1px 은 대응 토큰이 없는 밀도 무관 상수라 면제한다
      { code: "const a = { height: '1px' };" },
    ],
    invalid: [
      {
        code: "const a = { padding: '1rem' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { fontSize: '0.875rem' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { outlineOffset: '2px' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { outlineOffset: '-2px' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { borderRadius: '9999px' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { top: '0px' };",
        errors: [{ messageId: 'rawDimension' }],
      },
    ],
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run eslint-rules/no-raw-design-values.test.mjs`
Expected: FAIL — `no-raw-design-values.mjs` 모듈이 없다.

- [ ] **Step 3: 규칙 구현**

Create `eslint-rules/no-raw-design-values.mjs`:

```js
/** raw 디자인 값 차단 규칙 — css.ts 에서 semantic·scale 토큰만 쓰게 한다 */

// 헤어라인 1px 은 밀도 무관 상수라 dimension 스케일(최솟값 2px)에 대응 토큰이 없다
const HAIRLINE = '1px';

// 단독 치수만 잡는다 — '1px solid …' 같은 복합 문자열은 매칭되지 않아 border 관용구가 살아남는다
const RAW_DIMENSION = /^-?\d*\.?\d+(?:px|rem)$/;

/** ESLint 규칙 — raw 치수·색 리터럴과 palette 직접 import 를 막는다 */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'raw 디자인 값 대신 semantic·scale 토큰을 쓰게 한다',
    },
    messages: {
      rawDimension:
        "raw 치수 '{{value}}' 대신 vars.dimension·vars.container·vars.typography 토큰을 쓰세요.",
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') {
          return;
        }
        if (node.value === HAIRLINE) {
          return;
        }
        if (RAW_DIMENSION.test(node.value)) {
          context.report({
            node,
            messageId: 'rawDimension',
            data: { value: node.value },
          });
        }
      },
    };
  },
};
```

Create `eslint-rules/index.mjs`:

```js
/** design-tokens ESLint 플러그인 — 프로젝트 전용 토큰 규율 규칙 모음 */
import noRawDesignValues from './no-raw-design-values.mjs';

/** eslint.config.mjs 의 plugins 에 배선하는 플러그인 객체 */
export default {
  rules: { 'no-raw-design-values': noRawDesignValues },
};
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run eslint-rules/no-raw-design-values.test.mjs`
Expected: PASS — valid 10건, invalid 6건.

`import { RuleTester } from 'eslint'`가 해석되지 않으면 `from 'eslint/lib/api.js'`로 바꾼다(eslint 패키지의 `exports["."]`가 `./lib/api.js`를 가리킨다).

- [ ] **Step 5: 검증 + 커밋**

```bash
npx prettier --write eslint-rules/no-raw-design-values.mjs eslint-rules/index.mjs eslint-rules/no-raw-design-values.test.mjs
npm run fsd && npm run lint && npm run type-check && npm run test
git add eslint-rules
git commit -m "feat(lint): add no-raw-design-values rule for raw dimensions

단독 px/rem 문자열 리터럴을 차단한다. 복합 문자열('1px solid …')과
헤어라인 '1px' 은 구조적·명시적으로 면제한다.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: ESLint 규칙 — raw 색 + palette import 차단

**Files:**

- Modify: `eslint-rules/no-raw-design-values.mjs`
- Test: `eslint-rules/no-raw-design-values.test.mjs`

**Interfaces:**

- Consumes: Task 3의 규칙 객체.
- Produces: messageId `rawColor`·`paletteImport` 추가.

palette 검사는 **경로가 아니라 import 바인딩 이름**으로 한다. `palette`는 `tokens/color/index.ts` → `tokens/index.ts` → `shared/styles/index.ts`(`export *`)로 3단 재노출돼 있어, 경로 접미사만 보면 세 경로가 전부 우회로가 된다.

- [ ] **Step 1: 실패하는 테스트 작성**

`eslint-rules/no-raw-design-values.test.mjs` 끝에 두 번째 `describe` 블록을 추가한다.

```js
describe('raw 색과 palette import 차단', () => {
  ruleTester.run('no-raw-design-values', rule, {
    valid: [
      { code: 'const a = { color: vars.color.fg.neutral };' },
      { code: "const a = { background: 'transparent' };" },
      { code: "const a = { borderColor: 'currentColor' };" },
      // 실제 코드의 지배적 관용구 — 템플릿 안 '1px solid ' quasi 에는 색이 없다
      {
        code: 'const a = { border: `1px solid ${vars.color.stroke.neutral}` };',
      },
      { code: "import { vars } from '@/shared/styles/theme.css';" },
      { code: "import { finish, shadow } from '@/shared/styles/tokens';" },
    ],
    invalid: [
      {
        code: "const a = { color: '#FF0000' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { color: '#f00' };",
        errors: [{ messageId: 'rawColor' }],
      },
      // 4자리 #RGBA 는 CSS 유효 문법 — 3·6·8자리만 보면 새어나간다
      {
        code: "const a = { color: '#fff8' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { background: 'rgba(0, 0, 0, 0.5)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { background: 'hsl(0, 0%, 0%)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: 'const a = { border: `1px solid #fff` };',
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "import { palette } from '@/shared/styles/tokens/color/palette';",
        errors: [{ messageId: 'paletteImport' }],
      },
      {
        code: "import { palette } from '@/shared/styles/tokens';",
        errors: [{ messageId: 'paletteImport' }],
      },
      {
        code: "import { palette } from '@/shared/styles';",
        errors: [{ messageId: 'paletteImport' }],
      },
    ],
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run eslint-rules/no-raw-design-values.test.mjs`
Expected: FAIL — `rawColor`·`paletteImport` messageId가 없다.

- [ ] **Step 3: 색·import 검사 추가**

`eslint-rules/no-raw-design-values.mjs`의 `RAW_DIMENSION` 상수 아래에 추가:

```js
// 8·6·4·3자리 hex 를 긴 것부터 시도한다 — 4자리(#RGBA)도 CSS 유효 문법이라 포함한다
const RAW_COLOR =
  /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b|\b(?:rgba?|hsla?)\(/;
```

`meta.messages`에 두 줄 추가:

```js
      rawColor: "raw 색 '{{value}}' 대신 vars.color semantic 토큰을 쓰세요.",
      paletteImport:
        'palette 직접 import 금지 — vars.color semantic 토큰을 쓰세요.',
```

`create(context)`의 `return` 문을 통째로 교체:

```js
    return {
      Literal(node) {
        if (typeof node.value !== 'string') {
          return;
        }
        if (RAW_COLOR.test(node.value)) {
          context.report({
            node,
            messageId: 'rawColor',
            data: { value: node.value },
          });
          return;
        }
        if (node.value === HAIRLINE) {
          return;
        }
        if (RAW_DIMENSION.test(node.value)) {
          context.report({
            node,
            messageId: 'rawDimension',
            data: { value: node.value },
          });
        }
      },
      TemplateElement(node) {
        // 템플릿 안 치수는 전부 '1px solid …' 같은 복합값이라 색만 본다
        if (RAW_COLOR.test(node.value.raw)) {
          context.report({
            node,
            messageId: 'rawColor',
            data: { value: node.value.raw.trim() },
          });
        }
      },
      ImportDeclaration(node) {
        // 경로가 아니라 바인딩 이름으로 잡는다 — palette 는 배럴 3경로로 재노출된다
        const importsPalette = node.specifiers.some((specifier) => {
          return (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.name === 'palette'
          );
        });
        if (importsPalette) {
          context.report({ node, messageId: 'paletteImport' });
        }
      },
    };
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run eslint-rules/no-raw-design-values.test.mjs`
Expected: PASS — 두 describe 블록 전부.

- [ ] **Step 5: 검증 + 커밋**

```bash
npx prettier --write eslint-rules/no-raw-design-values.mjs eslint-rules/no-raw-design-values.test.mjs
npm run fsd && npm run lint && npm run type-check && npm run test
git add eslint-rules
git commit -m "feat(lint): block raw colors and palette imports

hex(3·4·6·8자리)·rgb·hsl 을 문자열과 템플릿 양쪽에서 잡는다.
palette 는 배럴 3경로로 재노출되므로 경로 대신 import 바인딩 이름으로 검사한다.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: flat config 배선 (warn) + baseline 확인

**Files:**

- Modify: `eslint.config.mjs`

**Interfaces:**

- Consumes: `eslint-rules/index.mjs`의 default export.
- Produces: `design-tokens/no-raw-design-values` 규칙이 `**/*.css.ts`에 `warn`으로 적용된 상태. Task 6~10이 이 warning 수를 줄여나간다.

`warn`으로 시작하는 이유는 빌드를 빨갛게 만들지 않고 페이즈별 진행률을 측정하기 위해서다. Task 11에서 `error`로 승격한다.

- [ ] **Step 1: 플러그인 import 추가**

`eslint.config.mjs` 상단, `import nextTs from 'eslint-config-next/typescript';` 다음 줄에 추가:

```js
// 프로젝트 전용 디자인 토큰 규율 플러그인을 가져옵니다.
import designTokens from './eslint-rules/index.mjs';
```

- [ ] **Step 2: 규칙 블록 추가**

`eslint.config.mjs`의 `globalIgnores([...])` **바로 앞**에 블록을 추가한다.

```js
  // 디자인 토큰 규율 — 스타일 코드에서 raw 값을 막는다. 토큰·테마 정의부는 raw 값이 살아야 하는 유일한 곳이라 제외
  {
    files: ['**/*.css.ts'],
    ignores: [
      'src/shared/styles/tokens/**',
      'src/shared/styles/themes/**',
    ],
    plugins: { 'design-tokens': designTokens },
    rules: {
      // 마이그레이션 중에는 warn — 전수 치환 후 error 로 승격한다
      'design-tokens/no-raw-design-values': 'warn',
    },
  },
```

- [ ] **Step 3: baseline 확인**

Run: `npx eslint 'src/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **100**

숫자가 100이 아니면 멈추고 보고한다 — 규칙 로직이나 스펙 계측 중 하나가 틀린 것이다.

- [ ] **Step 4: 검증 + 커밋**

```bash
npx prettier --write eslint.config.mjs
npm run fsd && npm run lint && npm run type-check && npm run test
git add eslint.config.mjs
git commit -m "chore(lint): wire no-raw-design-values as warn

baseline 100건. 전수 마이그레이션 후 error 로 승격한다.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: 마이그레이션 — shared/ui + global (29건)

**Files:** 아래 9개 `.css.ts` + `src/shared/styles/global.css.ts`

**Interfaces:**

- Consumes: Task 1의 `vars.container`, Task 2의 `vars.typography.fontSize[40]`(이 태스크에선 미사용), Task 5의 warn 배선.

**정확한 치환 목록** — 각 줄의 값만 바꾼다:

| 파일:줄                        | 현재                        | 치환 후                          |
| ------------------------------ | --------------------------- | -------------------------------- |
| `AlertDialog.css.ts:69`        | `maxWidth: '28rem'`         | `maxWidth: vars.container.dialog` |
| `AlertDialog.css.ts:100`       | `fontSize: '1.125rem'`      | `fontSize: vars.typography.fontSize[20]` |
| `Dialog.css.ts:69`             | `maxWidth: '32rem'`         | `maxWidth: vars.container.dialog` |
| `Dialog.css.ts:100`            | `fontSize: '1.125rem'`      | `fontSize: vars.typography.fontSize[20]` |
| `Switch.css.ts:9`              | `width: '2.5rem'`           | `width: vars.dimension.x10`      |
| `Switch.css.ts:10`             | `height: '1.5rem'`          | `height: vars.dimension.x6`      |
| `Switch.css.ts:27`             | `width: '1.25rem'`          | `width: vars.dimension.x5`       |
| `Switch.css.ts:28`             | `height: '1.25rem'`         | `height: vars.dimension.x5`      |
| `Accordion.css.ts:96`          | `outlineOffset: '-2px'`     | `` outlineOffset: `calc(${vars.dimension.x0_5} * -1)` `` |
| `DropdownMenu.css.ts:45`       | `fontSize: '0.8125rem'`     | `fontSize: vars.typography.fontSize[14]` |
| `Slider.css.ts:12`             | `height: '1.25rem'`         | `height: vars.dimension.x5`      |
| `Slider.css.ts:22`             | `height: '0.25rem'`         | `height: vars.dimension.x1`      |
| `Slider.css.ts:23`             | `borderRadius: '9999px'`    | `borderRadius: vars.radius.pill` |
| `Slider.css.ts:31`             | `borderRadius: '9999px'`    | `borderRadius: vars.radius.pill` |
| `Slider.css.ts:38`             | `width: '1rem'`             | `width: vars.dimension.x4`       |
| `Slider.css.ts:39`             | `height: '1rem'`            | `height: vars.dimension.x4`      |
| `Slider.css.ts:40`             | `borderRadius: '9999px'`    | `borderRadius: vars.radius.pill` |
| `Slider.css.ts:46`             | `outlineOffset: '2px'`      | `outlineOffset: vars.dimension.x0_5` |
| `RadioGroup.css.ts:13`         | `width: '1.25rem'`          | `width: vars.dimension.x5`       |
| `RadioGroup.css.ts:14`         | `height: '1.25rem'`         | `height: vars.dimension.x5`      |
| `RadioGroup.css.ts:20`         | `borderRadius: '9999px'`    | `borderRadius: vars.radius.pill` |
| `RadioGroup.css.ts:48`         | `width: '0.625rem'`         | `width: vars.dimension.x2_5`     |
| `RadioGroup.css.ts:49`         | `height: '0.625rem'`        | `height: vars.dimension.x2_5`    |
| `RadioGroup.css.ts:50`         | `borderRadius: '9999px'`    | `borderRadius: vars.radius.pill` |
| `Progress.css.ts:10`           | `height: '0.5rem'`          | `height: vars.dimension.x2` (줄 끝 주석 유지) |
| `global.css.ts:44`             | `outlineOffset: '2px'`      | `outlineOffset: vars.dimension.x0_5` |

**escape hatch 3건** — 값은 그대로 두고 바로 윗줄에 주석 추가:

- `Select.css.ts:19`·`:100` `minWidth: '10rem'` → `// eslint-disable-next-line design-tokens/no-raw-design-values -- 컴포넌트 고유 최소폭`
- `DropdownMenu.css.ts:11` `minWidth: '8rem'` → 같은 주석

- [ ] **Step 1: 치환 적용**

위 표대로 26줄을 치환하고 escape hatch 3건에 주석을 단다. **줄 번호는 편집하면서 밀리므로 값으로 찾는다.** 인접 코드는 건드리지 않는다.

- [ ] **Step 2: 위반 0 확인**

Run: `npx eslint 'src/shared/ui/**/*.css.ts' 'src/shared/styles/global.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **0**

- [ ] **Step 3: 전체 잔여 확인**

Run: `npx eslint 'src/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **71** (100 − 29)

- [ ] **Step 4: 검증 + 커밋**

```bash
npx prettier --write src/shared/ui/AlertDialog/AlertDialog.css.ts src/shared/ui/Dialog/Dialog.css.ts src/shared/ui/Switch/Switch.css.ts src/shared/ui/Accordion/Accordion.css.ts src/shared/ui/DropdownMenu/DropdownMenu.css.ts src/shared/ui/Slider/Slider.css.ts src/shared/ui/RadioGroup/RadioGroup.css.ts src/shared/ui/Progress/Progress.css.ts src/shared/ui/Select/Select.css.ts src/shared/styles/global.css.ts
npm run fsd && npm run lint && npm run type-check && npm run test
git add src/shared
git commit -m "refactor(shared-ui): replace raw values with design tokens

프리미티브 9종 + global 의 raw 치수 26건을 토큰으로 치환.
Accordion 의 음수 outlineOffset 은 calc() 로 뒤집어 토큰 연결을 유지한다.
컴포넌트 고유 최소폭 3건은 escape hatch.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: 마이그레이션 — lab-transition + LabPage (21건)

**Files:** `src/pages/lab/ui/LabPage.css.ts` + `src/pages/lab-transition/ui/**` 6개

| 파일:줄                             | 현재                     | 치환 후                                  |
| ----------------------------------- | ------------------------ | ---------------------------------------- |
| `LabPage.css.ts:14`                 | `maxWidth: '56rem'`      | `maxWidth: vars.container.page`          |
| `LabPage.css.ts:23`                 | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `LabPage.css.ts:27`                 | `fontSize: '2.5rem'`     | `fontSize: vars.typography.fontSize[40]` |
| `LabPage.css.ts:56`                 | `fontSize: '1.25rem'`    | `fontSize: vars.typography.fontSize[20]` |
| `CodePanel.css.ts:26`               | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `TransitionReference.css.ts:11`     | `fontSize: '1.5rem'`     | `fontSize: vars.typography.fontSize[24]` |
| `TransitionReference.css.ts:17`     | `fontSize: '1rem'`       | `fontSize: vars.typography.fontSize[16]` |
| `TransitionReference.css.ts:39`     | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `TransitionReference.css.ts:60`     | `fontSize: '0.8125rem'`  | `fontSize: vars.typography.fontSize[14]` |
| `TransitionReference.css.ts:72`     | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `TransitionControls.css.ts:15`      | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `TransitionControls.css.ts:27`      | `fontSize: '0.8125rem'`  | `fontSize: vars.typography.fontSize[14]` |
| `TransitionLabPage.css.ts:14`       | `maxWidth: '72rem'`      | `maxWidth: vars.container.wide`          |
| `TransitionLabPage.css.ts:23`       | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `TransitionLabPage.css.ts:27`       | `fontSize: '2.5rem'`     | `fontSize: vars.typography.fontSize[40]` |
| `BezierEditor.css.ts:8`             | `maxWidth: '20rem'`      | `maxWidth: vars.container.form`          |
| `BezierEditor.css.ts:47`            | `outlineOffset: '2px'`   | `outlineOffset: vars.dimension.x0_5`     |
| `PreviewStage.css.ts:26`            | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `PreviewStage.css.ts:42`            | `width: '2.5rem'`        | `width: vars.dimension.x10`              |
| `PreviewStage.css.ts:43`            | `height: '2.5rem'`       | `height: vars.dimension.x10`             |

**escape hatch 1건:** `lab-transition/PreviewStage.css.ts:33` `minHeight: '4.5rem'` → 윗줄에 `// eslint-disable-next-line design-tokens/no-raw-design-values -- 랩 데모 트랙 치수`

- [ ] **Step 1: 치환 적용**

위 표대로 20줄 치환 + escape hatch 1건.

- [ ] **Step 2: 위반 0 확인**

Run: `npx eslint 'src/pages/lab/**/*.css.ts' 'src/pages/lab-transition/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **0**

- [ ] **Step 3: 전체 잔여 확인**

Run: `npx eslint 'src/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **50** (71 − 21)

- [ ] **Step 4: 검증 + 커밋**

```bash
npx prettier --write src/pages/lab/ui/LabPage.css.ts src/pages/lab-transition/ui/CodePanel/CodePanel.css.ts src/pages/lab-transition/ui/TransitionReference/TransitionReference.css.ts src/pages/lab-transition/ui/TransitionControls/TransitionControls.css.ts src/pages/lab-transition/ui/TransitionLabPage/TransitionLabPage.css.ts src/pages/lab-transition/ui/BezierEditor/BezierEditor.css.ts src/pages/lab-transition/ui/PreviewStage/PreviewStage.css.ts
npm run fsd && npm run lint && npm run type-check && npm run test
git add src/pages/lab src/pages/lab-transition
git commit -m "refactor(lab-transition): replace raw values with design tokens

랩 허브·transition 랩의 raw 치수 20건을 토큰으로 치환.
13px·18px 은 스케일에 없어 14px·20px 로 흡수한다.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: 마이그레이션 — lab-animation (16건)

**Files:** `src/pages/lab-animation/ui/**` 5개

| 파일:줄                            | 현재                     | 치환 후                                  |
| ---------------------------------- | ------------------------ | ---------------------------------------- |
| `CodePanel.css.ts:26`              | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `AnimationLabPage.css.ts:14`       | `maxWidth: '72rem'`      | `maxWidth: vars.container.wide`          |
| `AnimationLabPage.css.ts:23`       | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `AnimationLabPage.css.ts:27`       | `fontSize: '2.5rem'`     | `fontSize: vars.typography.fontSize[40]` |
| `PreviewStage.css.ts:26`           | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `PreviewStage.css.ts:43`           | `fontSize: '0.8125rem'`  | `fontSize: vars.typography.fontSize[14]` |
| `PreviewStage.css.ts:75`           | `width: '2.5rem'`        | `width: vars.dimension.x10`              |
| `PreviewStage.css.ts:76`           | `height: '2.5rem'`       | `height: vars.dimension.x10`             |
| `AnimationReference.css.ts:11`     | `fontSize: '1.5rem'`     | `fontSize: vars.typography.fontSize[24]` |
| `AnimationReference.css.ts:17`     | `fontSize: '1rem'`       | `fontSize: vars.typography.fontSize[16]` |
| `AnimationReference.css.ts:39`     | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `AnimationReference.css.ts:60`     | `fontSize: '0.8125rem'`  | `fontSize: vars.typography.fontSize[14]` |
| `AnimationReference.css.ts:72`     | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `AnimationControls.css.ts:15`      | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `AnimationControls.css.ts:27`      | `fontSize: '0.8125rem'`  | `fontSize: vars.typography.fontSize[14]` |

**escape hatch 1건:** `lab-animation/PreviewStage.css.ts:33` `minHeight: '5.5rem'` → 윗줄에 `// eslint-disable-next-line design-tokens/no-raw-design-values -- 랩 데모 트랙 치수`

- [ ] **Step 1: 치환 적용**

위 표대로 15줄 치환 + escape hatch 1건. Task 7의 lab-transition과 거의 미러 구조지만 **줄 번호가 다르다** — 값으로 찾아 바꾼다.

- [ ] **Step 2: 위반 0 확인**

Run: `npx eslint 'src/pages/lab-animation/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **0**

- [ ] **Step 3: 전체 잔여 확인**

Run: `npx eslint 'src/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **34** (50 − 16)

- [ ] **Step 4: 검증 + 커밋**

```bash
npx prettier --write src/pages/lab-animation/ui/CodePanel/CodePanel.css.ts src/pages/lab-animation/ui/AnimationLabPage/AnimationLabPage.css.ts src/pages/lab-animation/ui/PreviewStage/PreviewStage.css.ts src/pages/lab-animation/ui/AnimationReference/AnimationReference.css.ts src/pages/lab-animation/ui/AnimationControls/AnimationControls.css.ts
npm run fsd && npm run lint && npm run type-check && npm run test
git add src/pages/lab-animation
git commit -m "refactor(lab-animation): replace raw values with design tokens

animation 랩의 raw 치수 15건을 토큰으로 치환.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: 마이그레이션 — pages (18건)

**Files:** `blog` · `blog-post` · `admin-posts` · `home` 5개

| 파일:줄                           | 현재                     | 치환 후                                  |
| --------------------------------- | ------------------------ | ---------------------------------------- |
| `BlogPage.css.ts:15`              | `maxWidth: '56rem'`      | `maxWidth: vars.container.page`          |
| `BlogPage.css.ts:26`              | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `BlogPage.css.ts:30`              | `fontSize: '2.5rem'`     | `fontSize: vars.typography.fontSize[40]` |
| `BlogPage.css.ts:55`              | `fontSize: '1.25rem'`    | `fontSize: vars.typography.fontSize[20]` |
| `BlogPage.css.ts:67`              | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `BlogPage.css.ts:72`              | `padding: '1.5rem'`      | `padding: vars.dimension.x6`             |
| `BlogPostPage.css.ts:15`          | `maxWidth: '48rem'`      | `maxWidth: vars.container.prose`         |
| `BlogPostPage.css.ts:26`          | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `BlogPostPage.css.ts:30`          | `fontSize: '2.5rem'`     | `fontSize: vars.typography.fontSize[40]` |
| `BlogPostPage.css.ts:38`          | `fontSize: '1.125rem'`   | `fontSize: vars.typography.fontSize[20]` |
| `BlogPostPage.css.ts:45`          | `fontSize: '0.875rem'`   | `fontSize: vars.typography.fontSize[14]` |
| `AdminPostsPage.css.ts:17`        | `maxWidth: '56rem'`      | `maxWidth: vars.container.page`          |
| `AdminPostsPage.css.ts:24`        | `fontSize: '2rem'`       | `fontSize: vars.typography.fontSize[32]` |
| `AdminPostsPage.css.ts:33`        | `paddingBlock: '0.625rem'` | `paddingBlock: vars.dimension.x2_5`    |
| `AdminPostsPage.css.ts:34`        | `paddingInline: '1rem'`  | `paddingInline: vars.dimension.x4`       |
| `AdminPostEditorPage.css.ts:17`   | `maxWidth: '64rem'`      | `maxWidth: vars.container.wide`          |
| `AdminPostEditorPage.css.ts:24`   | `fontSize: '2rem'`       | `fontSize: vars.typography.fontSize[32]` |
| `HeroSection.css.ts:39`           | `maxWidth: '42rem'`      | `maxWidth: vars.container.prose`         |

escape hatch 없음.

- [ ] **Step 1: 치환 적용**

위 표대로 18줄 치환.

- [ ] **Step 2: 위반 0 확인**

Run: `npx eslint 'src/pages/blog/**/*.css.ts' 'src/pages/blog-post/**/*.css.ts' 'src/pages/admin-posts/**/*.css.ts' 'src/pages/home/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **0**

- [ ] **Step 3: 전체 잔여 확인**

Run: `npx eslint 'src/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **16** (34 − 18)

- [ ] **Step 4: 검증 + 커밋**

```bash
npx prettier --write src/pages/blog/ui/BlogPage.css.ts src/pages/blog-post/ui/BlogPostPage.css.ts src/pages/admin-posts/ui/AdminPostsPage/AdminPostsPage.css.ts src/pages/admin-posts/ui/AdminPostEditorPage/AdminPostEditorPage.css.ts src/pages/home/ui/HeroSection/HeroSection.css.ts
npm run fsd && npm run lint && npm run type-check && npm run test
git add src/pages/blog src/pages/blog-post src/pages/admin-posts src/pages/home
git commit -m "refactor(pages): replace raw values with container and type tokens

페이지 폭 5종을 container 역할 토큰으로, h1 40px 을 fontSize[40] 으로.
Hero 42→48rem, 어드민 에디터 64→72rem 은 역할 통합에 따른 의도된 변화.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: 마이그레이션 — features·entities (16건)

**Files:** `post-editor` · `post-filter` · `auth` · `post` 4개

| 파일:줄                          | 현재                       | 치환 후                                  |
| -------------------------------- | -------------------------- | ---------------------------------------- |
| `PostEditorForm.css.ts:32`       | `fontSize: '0.875rem'`     | `fontSize: vars.typography.fontSize[14]` |
| `PostEditorForm.css.ts:39`       | `minHeight: '2.5rem'`      | `minHeight: vars.dimension.x10`          |
| `PostEditorForm.css.ts:40`       | `paddingInline: '0.75rem'` | `paddingInline: vars.dimension.x3`       |
| `PostEditorForm.css.ts:59`       | `padding: '1rem'`          | `padding: vars.dimension.x4`             |
| `PostEditorForm.css.ts:73`       | `minHeight: '2.5rem'`      | `minHeight: vars.dimension.x10`          |
| `PostEditorForm.css.ts:74`       | `paddingInline: '1rem'`    | `paddingInline: vars.dimension.x4`       |
| `PostEditorForm.css.ts:86`       | `fontSize: '0.875rem'`     | `fontSize: vars.typography.fontSize[14]` |
| `PostFilterForm.css.ts:35`       | `fontSize: '0.8125rem'`    | `fontSize: vars.typography.fontSize[14]` |
| `PostFilterForm.css.ts:42`       | `minHeight: '2.5rem'`      | `minHeight: vars.dimension.x10`          |
| `PostFilterForm.css.ts:43`       | `paddingInline: '0.75rem'` | `paddingInline: vars.dimension.x3`       |
| `PostFilterForm.css.ts:53`       | `minHeight: '2.5rem'`      | `minHeight: vars.dimension.x10`          |
| `PostFilterForm.css.ts:54`       | `paddingInline: '1rem'`    | `paddingInline: vars.dimension.x4`       |
| `LoginForm.css.ts:9`             | `maxWidth: '20rem'`        | `maxWidth: vars.container.form`          |
| `PostMarkdown.css.ts:13`         | `marginTop: '1rem'`        | `marginTop: vars.dimension.x4`           |
| `PostMarkdown.css.ts:30`         | `padding: '1rem'`          | `padding: vars.dimension.x4`             |
| `PostMarkdown.css.ts:48`         | `padding: '0.5rem'`        | `padding: vars.dimension.x2`             |

escape hatch 없음.

**주의:** `PostFilterForm.css.ts`는 **선재 prettier 드리프트가 있는 파일**이다. 지정된 줄만 고치고, prettier가 다른 줄까지 재포맷하면 그 부분은 커밋에서 제외하지 말고 그대로 둔다(포맷 정상화는 부작용이지 회귀가 아니다). 로직은 건드리지 않는다.

- [ ] **Step 1: 치환 적용**

위 표대로 16줄 치환.

- [ ] **Step 2: 위반 0 확인**

Run: `npx eslint 'src/features/**/*.css.ts' 'src/entities/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **0**

- [ ] **Step 3: 전체 잔여 확인 — 여기서 0이 돼야 한다**

Run: `npx eslint 'src/**/*.css.ts' --format compact 2>&1 | grep -c 'no-raw-design-values'`
Expected: **0**

- [ ] **Step 4: 검증 + 커밋**

```bash
npx prettier --write src/features/post-editor/ui/PostEditorForm/PostEditorForm.css.ts src/features/post-filter/ui/PostFilterForm/PostFilterForm.css.ts src/features/auth/ui/LoginForm/LoginForm.css.ts src/entities/post/ui/PostMarkdown/PostMarkdown.css.ts
npm run fsd && npm run lint && npm run type-check && npm run test
git add src/features src/entities
git commit -m "refactor(features): replace raw values with design tokens

폼 컨트롤 높이 2.5rem→x10, 본문 패딩을 dimension 스케일로.
이로써 css.ts 의 raw 디자인 값이 0 이 된다.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: error 승격 + 컨벤션 문서화 + 최종 검증

**Files:**

- Modify: `eslint.config.mjs`
- Modify: `docs/conventions/design-system-component.md` (§6 끝)

**Interfaces:**

- Consumes: Task 5~10의 결과(위반 0).

- [ ] **Step 1: warn → error 승격**

`eslint.config.mjs`에서 두 줄을 교체:

```js
      // 마이그레이션 중에는 warn — 전수 치환 후 error 로 승격한다
      'design-tokens/no-raw-design-values': 'warn',
```

를

```js
      'design-tokens/no-raw-design-values': 'error',
```

로 바꾼다(주석 줄도 함께 삭제).

- [ ] **Step 2: error 0건 확인**

Run: `npm run lint`
Expected: exit 0. `no-raw-design-values` 출력 없음.

- [ ] **Step 3: 컨벤션 문서에 규칙 기록**

`docs/conventions/design-system-component.md`의 §6 "토큰과 스타일 경계" 마지막 불릿 뒤에 추가:

```md
- raw 치수·색은 `design-tokens/no-raw-design-values` ESLint 규칙이 `*.css.ts`에서 차단한다. 스케일 토큰(`vars.dimension`·`vars.typography.fontSize`)은 최종 소비 계층으로 허용하고, 임의 리터럴만 막는다. 예외는 `// eslint-disable-next-line design-tokens/no-raw-design-values -- <이유>`로 이유를 남긴다.
- GSAP·react-spring 같은 런타임 모션은 `.tsx` 인라인 스타일이라 이 규칙 밖이다. 값은 `createVar()`로 `.css.ts`에 계약을 선언하고 JS가 그 변수만 움직이는 브리지 패턴을 쓴다. 설계 근거와 예시는 [토큰 규율 스펙](../superpowers/specs/2026-07-25-strict-design-token-lint-design.md) §5 참고.
```

- [ ] **Step 4: 전체 검증**

```bash
npm run fsd && npm run lint && npm run type-check && npm run test
```

Expected: 4개 전부 exit 0. **출력을 자르지 말고 exit code로 판정한다.** `npm run build`는 실행하지 않는다.

- [ ] **Step 5: 시각 회귀 확인 목록 보고**

아래 13곳은 값이 실제로 바뀌었다. 사용자에게 육안 확인을 요청한다.

| 대상                       | 변화     |
| -------------------------- | -------- |
| AlertDialog `maxWidth`     | 28→32rem |
| HeroSection `maxWidth`     | 42→48rem |
| AdminPostEditorPage        | 64→72rem |
| fontSize 13px → 14px       | 7곳      |
| fontSize 18px → 20px       | 3곳      |

- [ ] **Step 6: 커밋**

```bash
npx prettier --write eslint.config.mjs docs/conventions/design-system-component.md
npm run lint
git add eslint.config.mjs docs/conventions/design-system-component.md
git commit -m "chore(lint): promote no-raw-design-values to error

전수 마이그레이션 완료로 css.ts raw 값 0건. 규칙을 error 로 고정하고
컨벤션 문서에 규율과 escape hatch 사용법을 기록한다.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
