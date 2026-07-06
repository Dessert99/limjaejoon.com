# 디자인 토큰 Foundation 설계

2026-07-07. SEED Design 의 Design Token / Design Token Reference 구조를 참고해 `limjaejoon.com` 웹앱용 디자인 토큰 foundation 을 만든다. 값과 구조는 SEED 를 적극 참고하되, 전체 복제는 하지 않고 이 프로젝트의 light/dark 웹앱 스킴과 green primary 방향에 맞게 재구성한다.

참고 문서:

- https://seed-design.io/docs/foundation/design-token
- https://seed-design.io/docs/foundation/design-token-reference
- https://seed-design.io/docs/foundation/motion
- https://seed-design.io/docs/foundation/spacing

## 목표

- `src/shared/styles/tokens` 아래에 color, typography, dimension/spacing, radius, motion 토큰 foundation 을 만든다.
- 토큰은 SEED 처럼 scale token 과 semantic token 을 분리한다.
- 현재 `theme.css.ts`의 단순 `color/font/radius` contract 를 새 semantic 구조로 교체한다.
- 기존 dark 기본 + light 토글 구조를 유지한다.
- `sprinkles.css.ts`와 대표 컴포넌트 일부(Button, Switch, Progress, theme reveal)가 새 토큰을 실제로 사용하게 한다.

## 비목표

- SEED 토큰 전체를 그대로 복제하지 않는다.
- 모든 `shared/ui` 컴포넌트를 한 번에 전면 리팩터링하지 않는다.
- iconography, logo, voice and tone, writing, international design 은 이번 코드 토큰 범위에 포함하지 않는다.
- 별도 디자인 문서 사이트나 토큰 reference 페이지를 구현하지 않는다.

## 접근 방식

접근 B 를 선택한다.

- 토큰 폴더와 contract 를 새로 만든다.
- `theme.css.ts`와 `sprinkles.css.ts`를 새 토큰 구조에 연결한다.
- 대표 컴포넌트만 새 토큰으로 옮겨 실제 사용 경로를 만든다.
- 나머지 컴포넌트는 이후 컴포넌트 작업이나 스타일 수정 시 점진적으로 이전한다.

토큰만 만들고 쓰지 않는 접근은 학습 효과가 약하고, 전체 `shared/ui`를 한 번에 갈아엎는 접근은 변경 범위가 너무 크다.

## 디렉터리 구조

```txt
src/shared/styles/tokens/
  color/
    palette.ts
    semantic.ts
    index.ts
  typography/
    scale.ts
    text.ts
    index.ts
  dimension/
    scale.ts
    spacing.ts
    index.ts
  radius/
    scale.ts
    semantic.ts
    index.ts
  motion/
    duration.ts
    easing.ts
    semantic.ts
    index.ts
  index.ts
```

`palette.ts`와 `scale.ts` 파일은 raw value 의 제한된 목록이다. `semantic.ts`, `text.ts`, `spacing.ts`는 실제 앱과 컴포넌트가 사용하는 의도 기반 토큰이다.

## 사용 원칙

- raw 값은 `tokens` 내부에서만 관리한다.
- 컴포넌트는 가능하면 semantic token 만 사용한다.
- `palette.green.700` 같은 palette 값은 Button 이 직접 쓰지 않는다.
- Button 은 `bg.brand`, `fg.onBrand`, `motion.controlFeedback` 같은 의미 토큰을 사용한다.
- 기존 public import 흐름은 `@/shared/styles`를 유지하고, 내부 구현만 토큰 foundation 으로 바꾼다.

## Color

색은 `palette -> semantic -> component` 흐름으로 둔다.

```ts
color.palette.*
color.fg.*
color.bg.*
color.stroke.*
```

### Palette

1차 palette 는 필요한 계열만 가져온다.

```ts
palette.gray
palette.green
palette.red
palette.yellow
palette.blue
palette.static
```

- `gray`: 텍스트, 표면, border, disabled
- `green`: brand/primary, positive 상태
- `red`: critical/error
- `yellow`: warning
- `blue`: informative
- `static`: black/white/alpha, overlay, 투명 pressed 상태

green 은 프로젝트의 brand/primary 색이다. positive 도 green 계열을 쓰지만 semantic 이름으로 의미를 분리한다.

### Semantic

1차 color semantic 은 웹앱 기본 상태를 포함한다.

```ts
color.fg.neutral
color.fg.muted
color.fg.brand
color.fg.onBrand
color.fg.critical
color.fg.warning
color.fg.informative
color.fg.positive
color.fg.disabled

color.bg.canvas
color.bg.surface
color.bg.surfaceMuted
color.bg.brand
color.bg.brandPressed
color.bg.brandWeak
color.bg.criticalWeak
color.bg.warningWeak
color.bg.informativeWeak
color.bg.positiveWeak
color.bg.disabled
color.bg.overlay

color.stroke.neutral
color.stroke.muted
color.stroke.brand
color.stroke.critical
color.stroke.warning
color.stroke.informative
color.stroke.positive
```

`pressed`, `weak`, `disabled` 상태는 1차에서는 color semantic 안에 둔다. 별도 `state` 토큰은 상태 표현이 더 커질 때 분리한다.

### Theme Mapping

light/dark 는 같은 semantic 이름을 유지하고 값만 다르게 주입한다.

```ts
// light 예시
fg.neutral = palette.gray.1000
bg.canvas = palette.gray.100
bg.surface = palette.gray.00
bg.brand = palette.green.700

// dark 예시
fg.neutral = palette.gray.00
bg.canvas = palette.gray.1000
bg.surface = palette.gray.900
bg.brand = palette.green.500
```

컴포넌트는 테마를 알지 않는다.

## Typography

typography 는 scale 과 semantic text style 을 함께 둔다. scale 은 재료이고, 실제 컴포넌트 사용은 semantic text style 을 우선한다.

```ts
typography.fontFamily.sans
typography.fontFamily.mono

typography.fontSize.*
typography.lineHeight.*
typography.fontWeight.*

typography.text.body
typography.text.bodyStrong
typography.text.caption
typography.text.label
typography.text.headingSm
typography.text.headingMd
typography.text.headingLg
typography.text.code
```

`text.body`나 `text.label`은 `fontSize`, `lineHeight`, `fontWeight`, `fontFamily` 조합이다. 페이지나 컴포넌트가 매번 size/weight 를 직접 조합하면 편차가 생기므로, 반복되는 UI 텍스트는 text semantic 을 사용한다.

## Dimension / Spacing

간격은 SEED 처럼 raw dimension scale 과 semantic spacing 을 분리한다.

```ts
dimension.x0_5 // 2px
dimension.x1   // 4px
dimension.x1_5 // 6px
dimension.x2   // 8px
dimension.x3   // 12px
dimension.x4   // 16px
dimension.x5   // 20px
dimension.x6   // 24px
dimension.x8   // 32px
dimension.x10  // 40px
dimension.x12  // 48px
dimension.x16  // 64px
```

semantic spacing 은 레이아웃 의도를 표현한다.

```ts
spacing.globalGutter
spacing.componentDefault
spacing.betweenText
spacing.sectionGap
spacing.cardPadding
spacing.controlGap
```

`dimension`은 padding, margin, gap 의 재료다. `spacing`은 화면 좌우 여백, 카드 내부 여백, 텍스트 사이 간격처럼 "왜 이 간격인지"를 표현한다.

## Radius

radius 는 scale 과 semantic 을 함께 둔다.

```ts
radius.r1
radius.r2
radius.r3
radius.r4
radius.full

radius.control
radius.card
radius.panel
radius.overlay
radius.pill
```

- `control`: Button, Input, Select 같은 조작 요소
- `card`: 반복 카드, 콘텐츠 블록
- `panel`: 페이지 안 큰 패널
- `overlay`: Dialog, Popover, Toast 같은 떠 있는 UI
- `pill`: Badge, segmented item, 둥근 상태 표시

## Motion

motion 은 duration/easing scale 과 semantic alias 를 함께 둔다.

```ts
duration.d1
duration.d2
duration.d3
duration.d4
duration.d5
duration.d6

easing.linear
easing.standard
easing.enter
easing.exit
easing.expressive

motion.colorTransition
motion.controlFeedback
motion.overlayEnter
motion.overlayExit
motion.themeReveal
```

`duration`과 `easing`은 재료다. `motion` alias 는 실제 사용 의도다.

- `colorTransition`: hover, focus, selected 같이 색만 바뀌는 전환
- `controlFeedback`: Button, Switch, Toggle 처럼 즉각적인 조작 피드백
- `overlayEnter`: Dialog, Popover, Toast 진입
- `overlayExit`: Dialog, Popover, Toast 퇴장
- `themeReveal`: 현재 theme-toggle 의 View Transition reveal

`prefers-reduced-motion` 대응은 기존 `withCircularReveal`처럼 사용자 선호가 있으면 부가 연출을 생략하는 방향을 유지한다.

## Vanilla Extract Contract

`theme.css.ts`는 `createThemeContract`를 계속 사용한다. 새 contract 는 대략 다음 구조가 된다.

```ts
export const vars = createThemeContract({
  color: {
    fg: { ... },
    bg: { ... },
    stroke: { ... },
  },
  typography: {
    fontFamily: { ... },
    text: { ... },
  },
  dimension: { ... },
  spacing: { ... },
  radius: { ... },
  duration: { ... },
  easing: { ... },
  motion: { ... },
});
```

palette 값은 contract 에 직접 노출하지 않는다. palette 는 semantic 값 조립의 재료이며, 런타임 CSS 변수로 노출할 필요가 생기면 별도 판단한다.

## Sprinkles

`sprinkles.css.ts`는 다음 token 을 읽도록 조정한다.

- `gap`, `padding`, `margin`: `vars.dimension`
- semantic gap/padding 이 필요한 경우: `vars.spacing`
- `borderRadius`: `vars.radius`
- `background`: `vars.color.bg`
- `color`: `vars.color.fg`
- `borderColor`: `vars.color.stroke`

기존 숫자 key(`'8'`, `'16'`)는 `x2`, `x4` 같은 dimension key 로 바뀐다. 대표 컴포넌트 전환 범위에 포함된 파일만 우선 수정한다.

## 1차 적용 범위

1차 구현은 새 토큰이 실제로 쓰이는 최소 경로를 만든다.

- `theme.css.ts`: 새 contract 와 light/dark mapping
- `global.css.ts`: body, focus-visible 을 새 semantic token 으로 교체
- `sprinkles.css.ts`: dimension/color/radius 구조 교체
- `Button.css.ts`: bg/fg/stroke/radius/motion token 적용
- `Switch.css.ts`: control feedback motion, bg/stroke token 적용
- `Progress.css.ts`: brand/positive 계열 token 과 motion 적용
- `withCircularReveal.ts`: `motion.themeReveal` 값 사용

Dialog, Select, Toast 등 나머지 `shared/ui`는 이번 변경에서 전면 수정하지 않는다. 다만 새 contract 변경 때문에 타입 오류가 나는 직접 참조는 필요한 만큼만 새 이름으로 치환한다.

## 테스트 / 검증

설계 구현 시 검증은 작은 단위에서 시작한다.

- token 데이터 테스트: light/dark 가 같은 semantic key 를 모두 채우는지 확인
- 대표 컴포넌트 테스트: 기존 Button/Switch/Progress 테스트 유지
- theme-toggle 테스트: reveal motion 값 변경 후 기존 동작 유지
- 전체 검증: `npm run fsd`, `npm run lint`, `npm run type-check`, `npm run test`

CSS 수치 자체를 과하게 단언하지 않는다. 토큰 테스트는 shape completeness 와 semantic key 누락 방지에 집중한다.

## 완료 기준

- `src/shared/styles/tokens`에 1차 foundation 이 존재한다.
- color/typography/dimension/spacing/radius/motion 의 scale/semantic 경계가 코드로 드러난다.
- green 이 brand/primary 로 쓰이고, positive 와 semantic 으로 분리된다.
- light/dark theme mapping 이 같은 contract 를 공유한다.
- `theme.css.ts`, `sprinkles.css.ts`, 대표 컴포넌트가 새 토큰을 실제로 사용한다.
- 전체 검증 명령이 통과한다.
