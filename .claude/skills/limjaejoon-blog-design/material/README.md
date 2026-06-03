# Material Design 3 × 5계절 — Vanilla Extract 패턴

이 폴더는 **연습용 레퍼런스**입니다. 실제 `limjaejoon.com`(Next.js + vanilla-extract)에
그대로 옮겨 쓸 수 있도록, 중급~대규모 프로젝트에서 권장되는 **레이어드 토큰 구조**로
MD3 색 역할(color roles)과 5계절 테마를 구성했습니다. 브라우저 프리뷰(`/colors_and_type.css`,
`/preview/*`, `/ui_kits/*`)와 **완전히 동일한 값**을 갖습니다 — CSS는 같은 oklch 값을 손으로
펼친 것이고, 여기 `.css.ts`는 빌드 타임에 그 값을 생성합니다.

## 왜 이렇게 나누는가 (레이어)

```
tokens.css.ts          ── 계절과 무관한 정적 토큰 (createGlobalTheme → :root)
  │                       타입스케일 · shape · state layer · elevation · motion
  │
theme-contract.css.ts  ── 계절마다 바뀌는 "색 역할"의 모양만 (createThemeContract)
  │                       primary / onPrimary / surface / ... 값 없이 형태만 선언
  │
themes/*.css.ts        ── 계절별 실제 값 (createTheme(color, { ... }))
  │                       spring · summer · autumn · winter · night
  │
themes/index.css.ts    ── seasonThemes 레지스트리 + 헬퍼 (월→계절, 메타)
  │
sprinkles.css.ts       ── 반응형 atomic props + 색 역할 바인딩 (createSprinkles)
recipes.css.ts         ── 컴포넌트 변형 (recipe): button · card · chip + state layer
```

**핵심 아이디어 = 간접 참조(indirection).** 컴포넌트는 `color.primary`만 참조합니다.
어떤 계절 클래스가 조상에 걸려 있느냐에 따라 그 변수의 실제 값이 바뀝니다. 그래서
컴포넌트 코드를 한 줄도 고치지 않고 5개 테마를 갈아끼울 수 있습니다 — 이것이 MD3
"color roles"를 vanilla-extract `createThemeContract`로 구현하는 정석입니다.

- **정적 vs 동적 분리**: 타입·간격·elevation은 모든 계절이 공유 → `createGlobalTheme`.
  색만 계절별로 → `createThemeContract` + `createTheme`. 불필요하게 모든 토큰을 테마에
  넣지 않는 것이 대규모에서 빌드 산출물을 가볍게 유지하는 비결.
- **sprinkles**: 일회성 `style({})` 남발 대신 타입 안전한 atomic 유틸. 반응형 조건
  (mobile/tablet/desktop)과 색 역할을 prop으로.
- **recipes**: MD3 컴포넌트 스펙(버튼 5종, 카드 3종, 칩 4종)을 변형으로. `compoundVariants`로
  "filter chip이 selected일 때"처럼 조합 상태를 표현.

## 테마 적용

```ts
import { seasonThemes } from '@/material/themes';            // 레지스트리
// 활성 계절 클래스를 루트에 부여 (다크/라이트 대신 5계절 중 하나)
document.documentElement.className = seasonThemes['night'];  // 밤 = 사실상 다크
```

세그먼트 스위처(봄·여름·가을·겨울·밤 칩) UI는 `/ui_kits/blog/`와 `/preview/season-switcher.html`
에서 확인할 수 있습니다.

## CSS 프리뷰와의 매핑

| `.css.ts` (이 폴더)              | CSS 프리뷰 (`/colors_and_type.css`)        |
|---------------------------------|--------------------------------------------|
| `tokens.css.ts`                 | `:root { --md-sys-typescale-* / shape / elevation … }` |
| `theme-contract.css.ts`         | (역할 이름) `--md-sys-color-*`              |
| `themes/spring.css.ts` …        | `.theme-spring { --md-sys-color-* } …`     |
| `recipes.button(...)`           | `/preview/buttons.html`의 `.btn-*` 클래스   |

> 패키지: `@vanilla-extract/css`, `@vanilla-extract/sprinkles`, `@vanilla-extract/recipes`.
> 이 파일들은 타입 참조용이며 이 프로젝트에서 직접 컴파일되지는 않습니다.
