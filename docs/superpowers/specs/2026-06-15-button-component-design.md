# Button 공용 컴포넌트 설계

`shared/ui` 디자인 프리미티브 레이어의 **첫 컴포넌트 Button**을 만든다. 목적은 Button 하나를 완성하는 것을 넘어, 앞으로 다른 공용 컴포넌트(Dialog·Tooltip 등)가 그대로 복제할 **파이프라인 템플릿**을 확립하는 것이다: Radix(headless) + vanilla-extract recipe + 토큰 + Storybook + TDD. 이번 산출물은 Button 한 개와 그 주변 배선뿐이다.

## 1. 목표와 비목표

**목표**

- `shared/ui/Button`을 만들고, 이후 컴포넌트가 복제할 표준 구조(파일·스타일·테스트·스토리·public API)를 세운다.
- Radix Primitives를 headless로 도입한다. Button에선 `Slot`으로 `asChild` 합성을 지원한다.
- variant×size 매트릭스를 `@vanilla-extract/recipes`로 타입 안전하게 표현한다.
- 색은 `vars.color.*` 토큰만 참조하고, sprinkles는 기존 컨벤션대로 간격/레이아웃/라운드를 담당한다.

**비목표**

- Button 외 다른 컴포넌트 구현(후속).
- hover·active의 색·그림자·전환 같은 **연출 이펙트** — 사용자가 직접 만든다(메모리: 이펙트는 사용자 몫, deferred).
- 테마 전환 UI·자동 전환 메커니즘.
- 새 타이포 스케일 신설.

## 2. 거주지와 파일 구조

FSD에서 `shared/ui`가 디자인 프리미티브 자리다. 컴포넌트가 스타일·테스트·스토리를 동반하므로 단일 파일이 아닌 폴더 형태로 둔다([folder-structure.md](../../conventions/folder-structure.md) §2).

```
src/shared/ui/
├── Button/
│   ├── Button.tsx          # 컴포넌트 본체 (Radix Slot + recipe className 병합, forwardRef)
│   ├── Button.css.ts       # recipe() variant 정의
│   ├── Button.test.tsx     # RTL 행동 테스트
│   ├── Button.stories.tsx  # variant×size 매트릭스 + a11y (public API 비노출)
│   └── index.ts            # Button, ButtonProps 재노출 (slice public API)
└── index.ts                # shared/ui 배럴 → Button 재노출 (Steiger 요구)
```

- `Button.css.ts`는 Button 내부 파일이므로 `Button.tsx`가 **상대경로**로 import 한다. styles deep-import 예외(컨벤션 §3)는 `shared/styles`에만 해당하고 여기엔 관여하지 않는다.
- `Button.stories.tsx`는 문서화용이라 어떤 public API에서도 export 하지 않는다(컨벤션 §5).

## 3. 추가 의존성

```sh
npm i radix-ui
npm i -D @vanilla-extract/recipes
```

- `radix-ui` — 통합(one-package) Radix. 이번엔 `Slot`만 사용한다. 정확한 import 표면(`Slot` 네임스페이스 형태)은 설치된 버전 기준으로 구현 단계에서 확인한다.
- `@vanilla-extract/recipes` — `recipe()`, 타입 추론용 `RecipeVariants`. `@vanilla-extract/css`와 별도 패키지.

## 4. 토큰 변경 — `accentForeground` 추가

solid 변형은 accent 위에 글자를 올린다. 현재 컨트랙트엔 accent 위 전경색이 없어, accent 4개가 모두 밝은 톤이라 어두운 글자가 필요하다. 컨트랙트에 역할 토큰 하나를 더한다(이건 연출 이펙트가 아니라 **구조적 색**이라 토큰에 둔다).

[theme.css.ts](../../../src/shared/styles/theme.css.ts)의 `createThemeContract`에 `color.accentForeground: null`을 추가하고, 4테마 파일에 각각 어두운 값을 채운다(권장값 — 구현 시 대비 확인 후 미세조정).

| 테마 | accent | accentForeground(권장) |
|---|---|---|
| `afternoon` | `#c79338` | `#1c2630` |
| `sunset` | `#e07a45` | `#2c2030` |
| `night` | `#d8c39a` | `#14161e` |
| `dawn` | `#cf8f86` | `#1b2038` |

## 5. 컴포넌트 API

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost'  // 기본 'solid'
  size?: 'sm' | 'md'                        // 기본 'md'
  asChild?: boolean                         // 기본 false; true면 Slot으로 자식 엘리먼트 렌더
}
```

- `React.forwardRef<HTMLButtonElement, ButtonProps>`로 ref를 전달한다.
- `asChild`가 false면 `<button>`, true면 Radix `Slot`을 렌더해 자식(예: `<a>`)에 props·className을 합성한다.
- 외부에서 받은 `className`은 recipe 클래스 뒤에 병합한다.
- 그 외 표준 button 속성(`disabled`, `type`, `onClick` 등)은 그대로 통과한다.

## 6. 스타일링 — recipe + sprinkles 합성

컨벤션: **간격/레이아웃/라운드는 sprinkles, variant별 색·테두리 연출만 `style()`**. recipe가 이 둘을 묶는다. sprinkles는 사라지지 않고 recipe의 `base`와 `size` variant **안에서** 그대로 산다.

```ts
// Button.css.ts (형태 스케치 — 최종 값은 구현 단계)
export const button = recipe({
  base: [
    sprinkles({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8', r: 'md' }),
    { cursor: 'pointer', fontWeight: 600, border: '1px solid transparent' },
  ],
  variants: {
    size: {                                   // 치수는 고정 height 대신 padding으로 (컨벤션: width/height는 sprinkles 밖)
      sm: sprinkles({ px: '12', py: '8' }),
      md: sprinkles({ px: '16', py: '10' }),
    },
    variant: {                                // 색은 토큰 참조 style()
      solid:   { background: vars.color.accent, color: vars.color.accentForeground },
      outline: { borderColor: vars.color.border, color: vars.color.text },
      ghost:   { color: vars.color.text },
    },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
});

export type ButtonVariants = RecipeVariants<typeof button>;
```

- 포커스 링은 전역 `:focus-visible`(이미 `vars.color.accent` 참조)이 처리하므로 recipe에 넣지 않는다.
- `ButtonProps`의 `variant`/`size`는 `ButtonVariants`에서 끌어와 단일 출처로 둔다.

## 7. 상태/이펙트 경계

- **포함(구조적)**: focus-visible(전역), `cursor`, `:disabled`의 절제된 기본(`opacity` 감소 + `cursor: not-allowed`).
- **제외(사용자 손맛, deferred)**: hover/active의 색·그림자·전환. recipe에 자리만 남기고 값은 넣지 않는다.

## 8. 테스트 전략 (TDD)

[tdd-convention.md](../../conventions/tdd-convention.md)의 RED → GREEN → REFACTOR를 따른다. **행동을 검증하고 클래스명은 단언하지 않는다**(브리틀). 시각 차이는 Storybook이 담당.

- 기본 렌더: 자식 텍스트를 가진 `<button>`이 `role="button"`으로 렌더된다.
- `asChild`: `<Button asChild><a href="…">…</a></Button>`가 `<a>`로 렌더되고 children name이 보인다.
- `disabled`: 속성이 통과되어 버튼이 비활성화된다.
- ref 전달: ref가 실제 DOM 노드에 연결된다.
- props 통과: `onClick` 등 임의 속성이 전달된다.

## 9. Storybook

- 스토리: Default / Variants 매트릭스(3×2 그리드) / AsChild(링크로) / Disabled.
- a11y 애드온(`@storybook/addon-a11y`)이 axe 검사를 수행한다.

## 10. 선행 수정 (블로커)

[.storybook/preview.tsx](../../../.storybook/preview.tsx)가 직전 토큰 작업에서 이름이 바뀐 `defaultThemeClass`를 아직 import 한다(현재 export는 `afternoonThemeClass`). 이대로면 Storybook 전체가 뜨지 않아 우리 스토리도 렌더되지 않는다. `afternoonThemeClass`로 한 줄 고친다. 우리 산출물(스토리)이 동작하기 위한 선행 수정이라 이번 범위에 포함한다.

## 11. 검증 / 완료 기준

- `npm run ci`(fsd + lint + type-check + test + build) 통과.
- Button RTL 테스트 통과(위 5종).
- Storybook이 뜨고 Button 스토리의 4개 상태가 렌더되며 a11y 검사가 통과.
- `shared/ui` public API로 `Button`, `ButtonProps`가 노출되고, slice 밖에서 `@/shared/ui`로 import 가능.
