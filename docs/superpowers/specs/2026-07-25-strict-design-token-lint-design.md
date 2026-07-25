# 엄격 토큰 규율 설계 — raw 디자인 값 차단 ESLint 규칙

> **구현은 별도 플랜에서 진행한다.** 이 문서는 브레인스토밍으로 검증된 설계를 자족적으로 옮긴 스펙이다. 모든 수치는 `redesign` 브랜치 실측(2026-07-25) 기준이다.

## 배경

"황혼의 프라하" 테라코타 리테마(`2026-07-25-design-system-terracotta-retheme-design.md`)의 마지막 남은 트랙이다. 리테마로 컬러 토큰 3계층과 프리미티브 15종은 정비됐지만, 컴포넌트·페이지 스타일 코드가 토큰을 쓰도록 **강제하는 장치가 없다**. 규율이 사람의 기억에만 의존하면 다음 리테마 때 같은 비용을 다시 낸다.

## 목표

- `*.css.ts`에서 raw 디자인 값(하드코딩 치수·색)을 ESLint로 차단한다.
- 차단하려면 대안이 있어야 하므로, 비어 있는 토큰 레이어를 먼저 채운다.
- 기존 위반 101건(문자열 100 + 숫자 길이 1)을 전수 마이그레이션하고 CI에서 `error`로 고정한다.

## 비목표

- **스케일 토큰 접근 차단** — `vars.dimension.x4`, `vars.typography.fontSize[14]` 직접 사용은 허용한다. 이유는 §1.
- **`vars.dimension` → `vars.space` 개명** — 60곳 + sprinkles가 쓰고 있어 순수 churn이다. 신설 레이어를 `container`로 명명해 의미 충돌을 피한다.
- **`borderWidth` 토큰 도입** — §2.5.
- **`.tsx` 런타임 스타일 규율** — GSAP·react-spring 등은 §5 경계 참조.
- **선재 prettier 드리프트 3파일**(post.types·PostFilterForm.css·Divider.tsx) — 이 작업과 무관, 건드리지 않는다.

## 확정 결정 (브레인스토밍)

1. **규율 수준 = "표준 정합"** — 임의값만 차단하고 스케일은 최종 소비 계층으로 인정한다.
2. **결손 값 처리 = 혼합** — 타이포는 기존 스케일로 정리, 컨테이너 폭은 역할로 통합.
3. **컨테이너는 5역할** — 사용자가 고른 4역할(form·prose·page·wide)에 `dialog`를 추가. 다이얼로그 폭은 페이지 컬럼과 다른 축이라 `form`(20rem)에 넣으면 너무 좁다.
4. **`1px solid`·`2px solid` 51건은 범위 밖** — 밀도 무관 상수이지 스케일 선택 문제가 아니다.
5. **`outlineOffset` 3건은 통일 대상** — offset은 실제 간격 축이고, 이미 6곳이 `x0_5`를 쓰는데 3곳만 raw인 불일치다.

---

## 1. 원리 — semantic 레이어가 범주마다 다른 이유

alias 토큰은 **같은 값이 맥락마다 다른 것을 의미할 때만** 일한다.

- `#B4553A`는 그 자체로 의미가 없다. 다크에선 브랜드 배경, 라이트에선 다른 hex여야 한다. 안정적인 건 역할뿐이므로 이름이 필수다.
- `1rem`은 어느 테마에서든 `1rem`이다. alias가 흡수할 변동이 없고, 간접층만 하나 늘어난다.

이 프로젝트가 증거다. `themes/night.ts`와 `themes/light.ts`는 `dimension·spacing·radius·duration·easing·motion·typography`에 **동일한 객체를 그대로 주입**하고, 오직 `color`만 다르다.

업계 레퍼런스도 같은 패턴이다 — Radix Themes는 색이 완전 semantic(`--accent-9`)인데 간격은 `--space-1..9` 숫자가 최종 소비 계층이고, Material 3는 색 ref→sys→comp 3단 + 타이포 semantic 역할인데 간격은 4dp 그리드다. Tailwind·Carbon·Spectrum 모두 색·타이포조합·모션에 이름을 붙이고 spacing·sizing엔 붙이지 않는다.

### 1.1 vanilla-extract 환경에서의 강제 장치

이 스택의 표준 강제 장치는 ESLint가 아니라 **sprinkles**다. sprinkles는 토큰 레코드를 받아 닫힌 집합의 atomic 클래스를 만들므로, 임의값 사용이 타입 시스템 차원에서 불가능하다.

```ts
sprinkles({ p: 'x4' }); // 통과
sprinkles({ p: '4px' }); // 컴파일 에러 — 토큰 레코드의 key가 아님
```

실측이 이를 뒷받침한다. **raw 리터럴 100건 중 대부분이 sprinkles가 닿지 않는 속성**(`fontSize`·`width`·`height`·`min/maxWidth`·`minHeight`)에 몰려 있다. sprinkles가 커버하는 `gap`·`padding`·`margin`·`borderRadius`·색 계열은 이미 깨끗하다.

**따라서 ESLint의 역할은 sprinkles가 닿지 않는 영역의 임의값 차단으로 한정한다.**

### 1.2 실측 기준선 (2026-07-25, `redesign`)

토큰·테마 정의부를 제외한 `*.css.ts` 45개 기준.

| 항목                                       | 수치        | 판정                |
| ------------------------------------------ | ----------- | ------------------- |
| 단독 px/rem 문자열 리터럴 (`'1px'` 2건 제외) | **100**   | 차단 → 마이그레이션 |
| 단독 `'1px'` 헤어라인                      | 2           | 면제 (§2.5)         |
| hex / rgb() / hsl()                        | 0           | 차단 (순수 래칫)    |
| `palette` import                           | 0           | 차단 (순수 래칫)    |
| unitless 숫자 길이값 (`maxWidth: 360`)      | **1**       | 차단 → 마이그레이션 |
| `Npx solid` 복합 문자열                    | 51          | 허용 (§2.5)         |
| 단독 `em` 리터럴                           | 3           | 허용                |
| `vars.dimension.*` 접근                    | 60          | 허용                |
| sprinkles 간격 prop (`p: 'x4'` 등)         | ~160 / 36파일 | 허용              |
| `vars.typography.{fontSize,fontWeight,lineHeight}` | 26  | 허용                |
| `vars.radius.{r1..r4,full}`                | 12          | 허용                |

---

## 2. 토큰 레이어 보강 (규칙보다 선행)

### 2.1 `vars.container` 신설 — 페이지 폭 8종 → 역할 5종

컨테이너 폭은 현재 토큰 레이어가 **아예 없어서** 페이지마다 값이 갈렸다. 역할이 5개인데 값이 8개다.

| 역할     | 값    | 흡수 대상                                                 |
| -------- | ----- | --------------------------------------------------------- |
| `form`   | 20rem | LoginForm · BezierEditor                                   |
| `dialog` | 32rem | Dialog · **AlertDialog(28→32)**                            |
| `prose`  | 48rem | BlogPostPage · **HeroSection(42→48)**                      |
| `page`   | 56rem | BlogPage · LabPage · AdminPostsPage                        |
| `wide`   | 72rem | AnimationLabPage · TransitionLabPage · **AdminPostEditorPage(64→72)** |

어드민 에디터는 좁히는 대신 넓히는 쪽으로 흡수한다 — 편집 화면은 넓을수록 유리하다.

**배선은 5개 파일을 함께 고쳐야 한다** (코덱스 리뷰 반영 — 3개만 고치면 타입이 깨진다):

| 파일                              | 작업                                            |
| --------------------------------- | ----------------------------------------------- |
| `tokens/dimension/container.ts`   | 신설 — 값 정의                                  |
| `tokens/dimension/index.ts`       | `container` 재노출                              |
| `tokens/index.ts`                 | `export { dimension, spacing }` → `container` 추가 |
| `theme.types.ts`                  | `ThemeValues`에 `container: typeof container` 추가 |
| `theme.css.ts`                    | `createThemeContract`의 `vars`에 `container` 그룹 추가 |

`tokens/index.ts`와 `theme.types.ts`는 **최상위 그룹을 명시적으로 열거**하는 구조라, 빠뜨리면 `night.ts`·`light.ts`가 excess property 에러를 내거나 import가 안 풀린다. `night.ts`·`light.ts`는 동일 `container` 객체를 주입한다(테마 불변).

### 2.2 타이포 정리

| 결손        | 건수 | 처리                                          |
| ----------- | ---- | --------------------------------------------- |
| `0.8125rem` (13px) | 7 | `fontSize[14]`로 흡수                    |
| `1.125rem` (18px)  | 3 | `fontSize[20]`로 흡수                    |
| `2.5rem` (40px)    | 5 | `fontSize[40]` 신설 + `text.headingXl` 신설 |

`headingXl`은 페이지 h1 전용이다. 조합은 기존 `headingLg`와 동일하되 `fontSize[40]`을 쓴다 — `fontFamily.sans` · `lineHeight.tight` · `fontWeight.bold`.

`fontSize` 스케일은 12·14·16·20·24·32·**40** 7종이 된다. 배선은 `tokens/typography/{scale,text}.ts`와 `theme.css.ts` contract(`fontSize`·`text` 키를 명시 열거함) 두 곳 + `tokens.test.ts`다. `night`·`light`·`theme.types.ts`는 `typography` 객체를 통째로 넘기므로 자동 반영된다 — §2.1의 `container`와 달리 최상위 그룹이 늘지 않기 때문이다.

### 2.3 `dimension`은 그대로 둔다

스케일이 최종 소비 계층이므로 개명·차단 모두 하지 않는다. raw로 쓰인 컨트롤 치수는 **이미 스케일에 다 있으므로 치환만 하면 된다**.

```
2.5rem → x10    1.25rem → x5     1.5rem  → x6
1rem   → x4     0.625rem → x2_5  0.5rem  → x2     0.25rem → x1
```

### 2.4 `'9999px'` 5건 → `vars.radius.pill`

이미 존재하는 토큰을 안 쓴 케이스다. 신설 없음.

### 2.5 `borderWidth` 토큰은 만들지 않는다

`1px solid`(40회)·`2px solid`(11회)는 **밀도 무관 상수**다. 1px 헤어라인은 어떤 화면에서도 1px이고, "15개 중 무엇을 고를까"라는 스케일 선택 문제가 아니다. Tailwind·Radix Themes도 리터럴로 둔다.

규칙이 복합 문자열을 검사하지 않으므로 51건은 **구조적으로** 범위 밖이 된다.

**단독 `'1px'`도 규칙이 면제한다** (코덱스 리뷰 반영). `Divider.css.ts`의 `[dividerThickness]: '1px'`와 `DropdownMenu.css.ts`의 `height: '1px'`가 여기 해당한다. 둘 다 위 51건과 **똑같은 헤어라인 개념**인데 값이 단독으로 놓였을 뿐이다. 문법적 위치라는 우연으로 규율이 갈리면 안 되므로, 규칙이 `'1px'` 리터럴 하나를 명시적으로 통과시킨다. `dimension` 스케일 최솟값이 `x0_5`(2px)라 대체 토큰도 없다.

`'2px'`는 계속 차단한다 — 대응 토큰(`x0_5`)이 있고, 실제 용례가 border 두께가 아니라 `outlineOffset`(간격 축)이기 때문이다.

**`outlineOffset` 4건은 토큰으로 통일한다** — 이미 6곳이 `vars.dimension.x0_5`를 쓰는데 4곳만 raw인 불일치다.

| 위치                          | 현재      | 처리                                    |
| ----------------------------- | --------- | --------------------------------------- |
| 3곳                           | `'2px'`   | `vars.dimension.x0_5` (동일 값)         |
| `Accordion.css.ts:96`         | `'-2px'`  | `` calc(${vars.dimension.x0_5} * -1) `` |

음수 offset(안쪽 포커스 링)은 음수 토큰을 새로 만들지 않고 `calc()`로 뒤집는다 — `calc()`는 규칙 통과 대상이고 토큰 연결도 유지된다. 셋 다 값이 같아 시각 변화가 없다.

### 2.6 escape hatch로 남기는 5건

| 위치                              | 값             | 이유                       |
| --------------------------------- | -------------- | -------------------------- |
| Select `minWidth` ×2              | 10rem          | 컴포넌트 고유 최소폭       |
| DropdownMenu `minWidth`           | 8rem           | 컴포넌트 고유 최소폭       |
| lab-transition PreviewStage `minHeight` | 4.5rem   | 랩 데모 트랙 치수          |
| lab-animation PreviewStage `minHeight`  | 5.5rem   | 랩 데모 트랙 치수          |

토큰으로 승격할 만큼 반복되지 않는다. `design-system-component.md` §6의 "같은 예외가 반복되면 승격을 재판단한다" 원칙에 따라, 향후 3회 이상 반복되면 승격을 다시 검토한다.

---

## 3. ESLint 규칙 명세

**규칙 ID: `design-tokens/no-raw-design-values`**

### 3.1 차단 대상

| 방문 노드                | 검사                                                              | messageId       |
| ------------------------ | ----------------------------------------------------------------- | --------------- |
| `Literal` (string)       | `^-?\d*\.?\d+(px\|rem)$` — **단 `'1px'`은 면제**(§2.5)            | `rawDimension`  |
| `Literal` (string)       | 아래 색 패턴 포함                                                 | `rawColor`      |
| `TemplateLiteral` quasis | 아래 색 패턴 포함                                                 | `rawColor`      |
| `ImportDeclaration`      | **`palette` 라는 이름을 import** (source 무관)                    | `paletteImport` |

**색 패턴:** `#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b` 또는 `rgb(`/`rgba(`/`hsl(`/`hsla(`

4자리 `#RGBA` 형식을 포함한다(코덱스 리뷰 반영) — CSS 유효 문법인데 3·6·8자리만 보면 `'#fff8'` 같은 값이 통과한다.

**palette 검사는 경로가 아니라 import 되는 이름으로 한다**(코덱스 리뷰 반영). `palette`는 `tokens/color/index.ts` → `tokens/index.ts` → `shared/styles/index.ts`(`export *`)로 3단 재노출돼 있어, 경로 접미사만 보면 `@/shared/styles`·`@/shared/styles/tokens`·`@/shared/styles/tokens/color` 세 경로가 전부 우회로가 된다. 바인딩 이름을 보면 한 번에 막히고 향후 배럴이 늘어나도 안전하다.

템플릿 리터럴에서 **px/rem은 검사하지 않는다** — 거기 있는 값은 전부 `1px solid ${...}` 같은 복합값이고 §2.5 결정에 따라 허용한다. 색만 검사하는 것은 `` `1px solid #fff` `` 형태의 회귀를 막는 순수 래칫이다(현재 0건).

### 3.2 통과시키는 것 — 인터랙티브 작업 보호

`em` · `%` · `vw`/`vh`/`dvh`/`svh` · `cqw`/`cqh` · `fr` · `auto`/`fit-content`/`inherit` · `'0'` · `'1px'`(§2.5) · `calc()`/`min()`/`max()`/`clamp()`/`var()` · 복합 문자열 · `vars.*` 전 계층 · `createVar()` 결과

`transform`·`animation`·`transition`·`boxShadow`·`filter`는 값이 전부 복합 문자열이라 **구조적으로 규칙에 걸리지 않는다**. 속성별 예외 목록을 두지 않는 이유다.

**숫자 리터럴은 길이 속성에서만 검사한다** (코덱스 체크포인트 #1 반영). vanilla-extract는 unitless 숫자를 `px`로 직렬화하므로 `maxWidth: 360`은 `max-width: 360px`이 된다 — 문자열 `'360px'`과 똑같은 raw 치수인데 따옴표만 없는 셈이다.

초안은 이 검사를 뺐고 근거로 "실측 0건"을 들었으나 **그 측정이 틀렸다.** 측정 정규식이 `(width|height|padding|…)[A-Za-z]*` 형태라 접두어가 붙은 `maxWidth`·`minHeight` 등을 통째로 놓쳤다. 재측정 결과 실제 위반은 `AdminLoginPage.css.ts:9`의 `maxWidth: 360` **1건**이다.

blanket 숫자 검사를 피한다는 판단 자체는 유효하다 — unitless 숫자 ~80곳 중 `lineHeight`·`fontWeight`·`zIndex`·`opacity`·`flexGrow`·`flexShrink`·`flex`·`strokeWidth`는 전부 정당하다. 그래서 **길이 속성 allowlist**로 좁혀서 검사한다(denylist가 아니라 allowlist라 오탐이 구조적으로 불가능하다).

```
width · height · minWidth · maxWidth · minHeight · maxHeight
top · right · bottom · left · inset
gap · rowGap · columnGap
padding{,Top,Right,Bottom,Left,Inline,Block}
margin{,Top,Right,Bottom,Left,Inline,Block}
fontSize · borderRadius · outlineOffset · outlineWidth · borderWidth · flexBasis
```

`0`은 면제한다 — 단위 없는 0은 CSS 관용이고 스케일 선택 문제가 아니다.

`lineHeight`·`fontWeight`는 길이가 아니므로 이 검사 밖이다. `fontWeight: 700`(13곳)·`lineHeight: 1.1`(다수)에 대응 토큰이 일부 있긴 하지만, 사용자가 승인한 차단 범위는 "치수"이고 `lineHeight` 1.1·1.2·1.3·1.6은 스케일에 없는 값이라 새 토큰 결정이 필요하다. **후속 과제로 남긴다.**

### 3.3 escape hatch

```ts
// eslint-disable-next-line design-tokens/no-raw-design-values -- 랩 데모 전용 임의 치수
minHeight: '4.5rem',
```

`--` 뒤 이유 서술은 관례로 강제한다(리뷰에서 확인). `require-description`을 위한 추가 플러그인은 도입하지 않는다 — 예외가 5건뿐이라 의존성을 늘릴 값이 없다.

---

## 4. 규칙 배선·테스트

### 4.1 파일 배치

```
eslint-rules/
  index.mjs                        # 플러그인 객체 { rules: { ... } }
  no-raw-design-values.mjs         # 규칙 구현
  no-raw-design-values.test.mjs    # RuleTester 테스트
```

- **`src/` 밖에 두는 이유:** `npm run fsd`(`steiger ./src`)가 FSD 레이어 위반으로 잡는다. 린트 규칙은 앱 소스가 아니라 툴링이다.
- **`.mjs`인 이유:** `eslint.config.mjs`가 빌드 스텝 없이 직접 import한다. `.mts`는 로더(jiti)가 필요한데 미설치다. 선례는 `scripts/set-admin-role.mjs`.
- **감수하는 대가:** `tsconfig.json`의 include가 `.mjs`를 포함하지 않아 **규칙 코드는 `type-check` 대상 밖**이다. RuleTester 테스트가 계약을 대신 보증한다.

### 4.2 flat config 배선

경로 필터는 규칙 코드가 아니라 flat config가 담당한다 — 규칙 안에 경로 분기를 넣지 않는다. 아래는 P6 승격 후의 최종 형태이고, P1~P5 동안 severity는 `'warn'`이다(§7).

```js
{
  files: ['**/*.css.ts'],
  ignores: ['src/shared/styles/tokens/**', 'src/shared/styles/themes/**'],
  plugins: { 'design-tokens': designTokens },
  rules: { 'design-tokens/no-raw-design-values': 'error' },
}
```

토큰·테마 정의부가 allowlist인 이유는 **raw 값이 살아야 하는 유일한 곳**이기 때문이다.

### 4.3 테스트

vitest 기본 include(`**/*.test.?(c|m)[jt]s`)가 `.test.mjs`를 잡는다. RuleTester에 vitest의 `describe`/`it`을 주입한다 — ESLint 9.39의 `rule-tester.js`가 `this.constructor.describe`를 호출하므로 정적 할당이 유효하다(스파이크 검증 완료).

`describe`/`it` 설명문은 한국어로 쓴다(`tdd-convention.md` 6절). RuleTester가 생성하는 하위 케이스 이름은 코드 스니펫이므로 예외다.

테스트 케이스:

- **valid** — `vars.*` 참조 · `'100%'` · `'90vw'` · `'1em'` · `'auto'` · `'0'` · **`'1px'`(§2.5 면제)** · `calc()`/`var()` · `` `1px solid ${vars.color.stroke.neutral}` `` · `'translateY(-2px)'` · `createVar()`
- **invalid** — `'1rem'` · `'0.875rem'` · `'2px'` · `'-2px'` · `'0px'` · `'9999px'` · `'#FF0000'` · **`'#fff8'`(4자리)** · `'rgba(0,0,0,.5)'` · `` `1px solid #fff` `` · palette import **3경로 전부**(`…/tokens/color/palette` · `@/shared/styles/tokens` · `@/shared/styles`)

마지막 두 묶음이 코덱스 리뷰로 추가된 케이스다 — 4자리 hex와 배럴 경유 palette import는 원래 명세로는 통과해버린다.

---

## 5. 모션 라이브러리 경계

규칙은 `*.css.ts` **정적 분석**이다. GSAP(설치됨, `src/shared/lib/gsap/index.ts`에 배선)·react-spring 같은 런타임 애니메이션은 `.tsx`에서 인라인 스타일을 쓰므로 **규칙 범위 밖**이다.

```tsx
gsap.to(el, { y: -120, duration: 1.2, ease: 'power2.out' }); // 규칙 대상 아님
```

파랄랙스 오프셋·stagger·스크롤 진행률은 토큰이 아니라 코드 상수다. 토큰화하지 않는다.

**권장 패턴은 `createVar()` 브리지다** — 이 레포가 이미 쓰고 있다(`--lab-duration`, `--gt-index` 등 10개).

```ts
// .css.ts — 계약 선언 + 기본값은 토큰으로
const parallaxY = createVar();
export const layer = style({
  transform: `translate3d(0, ${parallaxY}, 0)`,
  vars: { [parallaxY]: '0px' },
});
```

```tsx
// .tsx — JS는 변수만 움직인다
gsap.to(el, { [parallaxY]: '-120px', ease: 'none', scrollTrigger: {} });
```

이 패턴을 권하는 이유:

- 초기 페인트 값이 CSS에 있어 SSR·하이드레이션 전에도 레이아웃이 맞는다(App Router에서 중요).
- 정적 구조는 `.css.ts`, 동적 값만 JS — 경계가 명확해진다.
- 기본값에 테마 토큰을 섞을 수 있다(`vars: { [parallaxY]: vars.dimension.x16 }`).

`vars: { [parallaxY]: '0px' }`의 `'0px'`은 규칙에 걸린다. `'0'`을 쓰거나 escape hatch로 처리한다.

---

## 6. 마이그레이션 분해 — 101건 / 32파일

| 그룹                    | 건수 | 파일 | 주요 작업                                             |
| ----------------------- | ---- | ---- | ----------------------------------------------------- |
| shared/ui 프리미티브    | 28   | 9    | `container.dialog` · `radius.pill` · `dimension` 치환 · Accordion `-2px`→`calc()` |
| pages/lab-\*            | 37   | 12   | fontSize 대부분. 두 랩이 거의 미러 구조               |
| pages (blog·admin·home) | 18   | 5    | `container.*` · `text.headingXl`                      |
| features·entities       | 16   | 4    | 폼 컨트롤 높이 `2.5rem` → `x10`                       |
| shared/styles/global    | 1    | 1    | `outlineOffset '2px'` → `x0_5`                        |

shared/ui가 30→28, 파일이 10→9인 것은 `'1px'` 면제(§2.5)로 Divider가 통째로 빠지고 DropdownMenu가 1건 줄기 때문이다.

파일별 상위: Slider 8 · PostEditorForm 7 · RadioGroup 6 · BlogPage 6 · (5건 5파일) · …

### 페이즈

```
P0  토큰 보강      container 5역할(5파일 배선, §2.1) · fontSize[40] · text.headingXl
                   theme.css contract · tokens/index · theme.types · tokens.test 동기화
P1  규칙 작성      RuleTester 테스트(RED) → 규칙 구현(GREEN) → flat config에 warn 배선
P2  shared/ui + global (29건)
P3  lab 2세트 (37건)
P4  pages (18건)
P5  features·entities (16건)
P6  error 승격 + 컨벤션 문서 반영 + 최종 검증
```

P0가 P2~P5보다 반드시 먼저다 — 치환할 토큰이 있어야 한다. P1은 P0와 독립이므로 순서를 바꿔도 되지만, `warn`으로 먼저 켜두면 페이즈마다 남은 건수가 실시간으로 보인다.

---

## 7. CI·검증

**warn-first 래칫**으로 도입한다.

1. P1에서 `warn`으로 켜서 baseline 을 확인한다(문자열 100, 숫자 길이 검사 추가 후 101). 빌드를 빨갛게 만들지 않고 시작한다.
2. P2~P5 각 페이즈 후 warning 수 감소를 확인한다 — 진행률이 측정 가능해진다.
3. 0 도달 시 P6에서 `error`로 승격한다. `npm run ci`에 이미 `lint`가 있어 추가 배선은 불필요하다.

**페이즈별 검증 명령:**

```sh
npm run fsd && npm run lint && npm run type-check && npm run test
npx prettier --write <바뀐 파일>
```

`npm run build`는 제외한다 — blog SSG가 로컬 Supabase(127.0.0.1:54321)를 요구해서, 미기동 시 코드와 무관하게 build만 실패한다.

---

## 8. 회귀 영향

**값이 바뀌는 곳은 14건뿐이고, 나머지 87건은 표현만 바뀐다.**

| 대상                    | 변화     | 확인 화면              |
| ----------------------- | -------- | ---------------------- |
| AlertDialog `maxWidth`  | 28→32rem | 파괴 확인 다이얼로그   |
| HeroSection `maxWidth`  | 42→48rem | 홈 히어로              |
| AdminPostEditorPage     | 64→72rem | 어드민 글 편집         |
| AdminLoginPage `maxWidth`  | 360px→20rem | 어드민 로그인 |
| fontSize 13px → 14px    | 7곳      | 랩 컨트롤·레퍼런스 표 · DropdownMenu · PostFilterForm |
| fontSize 18px → 20px    | 3곳      | BlogPostPage · Dialog 제목 · AlertDialog 제목 |

`Accordion`의 `outlineOffset: '-2px'` → `calc(…* -1)`은 계산 결과가 같아 시각 변화가 없다(§2.5).

토큰 contract에 키를 추가하므로 `tokens.test.ts`의 컨트랙트 충족 검증이 함께 갱신돼야 한다. `night`·`light` 양쪽에 `container`·`fontSize[40]`·`text.headingXl`을 빠짐없이 채우지 않으면 `type-check`가 잡는다.

---

## 9. 성공 기준

- `eslint-rules/no-raw-design-values.test.mjs`가 valid/invalid 케이스를 전부 통과한다 — §4.3의 배럴 경유 palette import 3경로와 4자리 hex 포함.
- `npm run lint`가 `design-tokens/no-raw-design-values` **error 0건**으로 통과한다.
- escape hatch는 §2.6의 5건 + §5에서 불가피한 경우로 한정되고, 각각 이유 주석을 단다.
- `npm run fsd && npm run lint && npm run type-check && npm run test` 전부 통과.
- §8의 14개 시각 변화 지점을 육안 확인한다.
- 새 컴포넌트를 만들 때 raw 값을 쓰면 **에디터에서 즉시 빨간 줄이 뜬다** — 이 규칙의 실질 목표다.

---

## 10. 리뷰 반영 결정

초안(커밋 `e95f32c7`)에 대한 코덱스 리뷰 5건을 모두 검증하고 반영했다. 다섯 건 모두 **"규칙을 켜면 zero-error에 도달할 수 없다"** 는 실행 가능성 결함이었다.

| # | 지적                                          | 결정                                                       |
| - | --------------------------------------------- | ---------------------------------------------------------- |
| 1 | 단독 `'1px'` 2건에 토큰도 예외도 없음         | 규칙이 `'1px'` 리터럴을 면제 (§2.5). baseline 102→100       |
| 2 | `Accordion`의 `'-2px'`에 계획 없음            | `` calc(${vars.dimension.x0_5} * -1) `` (§2.5)              |
| 3 | palette가 배럴 3경로로 우회 가능              | 경로 대신 **import 바인딩 이름**으로 검사 (§3.1)            |
| 4 | 4자리 `#RGBA` hex가 매처를 통과                | 색 패턴에 `{3,4}` 포함 (§3.1)                               |
| 5 | `container` 배선이 `tokens/index`·`theme.types` 누락 | P0 배선을 5파일로 명시 (§2.1)                        |

1번은 §2.5의 "1px 헤어라인은 밀도 무관 상수" 논리를 규칙이 실제로 구현하게 만든 것이다. 초안은 복합 문자열(`1px solid`)이 우연히 통과하는 데 기댔는데, 같은 개념이 단독으로 놓이면 걸리는 비일관을 리뷰가 짚었다.
