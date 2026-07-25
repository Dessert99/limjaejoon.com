# 디자인 시스템 컴포넌트 설계 컨벤션

디자인 시스템 프리미티브를 새로 만들거나 기존 `shared/ui` 컴포넌트를 재설계할 때의 판단 기준이다. 일반 React 컴포넌트 구현 규칙은 [component-convention.md](./component-convention.md)를 따르고, 이 문서는 그중 디자인 시스템 성격의 컴포넌트에만 추가로 적용한다.

규칙의 목적은 특정 라이브러리의 시각 스타일을 복제하는 것이 아니라, 컴포넌트를 일관된 순서로 해석하고 프로젝트의 언어로 다시 설계하는 것이다.

## 1. 기본 원칙

- SEED Design은 시각 스타일이 아니라 구조, 계층, 이름, 상태 모델, 문서화 방식의 참고 자료로 사용한다.
- 컴포넌트를 만들기 전에 역할을 먼저 정의한다.
- Button에서 정한 API나 구조를 다른 컴포넌트에 기계적으로 복제하지 않는다.
- 컴포넌트마다 anatomy, 상태, 접근성 요구사항이 다르므로 public API는 매번 다시 설계한다.
- 브라우저 기반 서비스의 hover, focus, pointer, responsive 조건을 모바일 앱 기준보다 우선한다.
- 시각 디테일은 프로젝트 고유의 토큰과 제품 톤으로 결정한다.

## 2. 설계 순서

디자인 시스템 컴포넌트는 구현 전에 아래 순서로 정리한다.

1. 역할: 이 컴포넌트가 사용자에게 제공하는 핵심 행동이나 정보는 무엇인가.
2. 사용 시나리오: 어디에서 반복적으로 쓰이고, 호출처가 무엇을 제어해야 하는가.
3. anatomy: root, trigger, content, indicator, icon 같은 내부 부품이 필요한가.
4. 상태 모델: open, selected, checked, invalid, disabled, loading 같은 상태를 어떻게 분리할 것인가.
5. public API: 호출처가 알아야 하는 prop과 숨겨야 하는 내부 구현은 무엇인가.
6. 접근성: aria 속성, label, role, keyboard interaction, focus 이동이 필요한가.
7. 토큰 연결: palette, semantic, component 토큰 중 어느 계층을 사용할 것인가.
8. 인터랙션: hover, active, focus-visible, motion, reduced motion을 어느 계층에서 처리할 것인가.
9. Storybook: 변형, 상태, 조합, edge case를 어떤 story로 보여줄 것인가.
10. 테스트: 프로젝트 코드가 책임지는 public 계약은 무엇이고, 외부 primitive가 이미 보장하는 영역은 무엇인가.

## 3. SEED 참고 방식

SEED를 볼 때는 "무엇을 따라 할 것인가"보다 "왜 그렇게 나눴는가"를 먼저 본다.

참고할 수 있는 것:

- 컴포넌트 이름과 prop 이름이 표현하는 의도
- primitive, recipe, slot, state의 분리 방식
- layout, size, variant 같은 축을 나누는 기준
- loading, disabled, selected처럼 의미가 다른 상태를 섞지 않는 방식
- 문서에서 anatomy, usage, accessibility를 설명하는 순서

참고하지 않을 것:

- 색상, radius, 그림자, 밀도, 브랜드 톤
- 당근 서비스의 제품 맥락에 묶인 visual detail
- 모바일 앱 전제를 그대로 가져온 interaction
- 특정 컴포넌트의 API를 다른 컴포넌트에 그대로 복사하는 방식

## 4. 상태 설계

상태는 시각 효과가 아니라 의미를 기준으로 나눈다.

- `disabled`는 사용자가 상호작용할 수 없는 상태다.
- `loading`은 작업이 진행 중이라는 상태이며, 항상 `disabled`와 같은 뜻은 아니다.
- `open`, `checked`, `selected`, `pressed`는 서로 다른 상호작용 모델이다.
- 상태 스타일링이 필요하면 `data-state`, `data-disabled`, `data-loading`처럼 의미가 드러나는 속성을 우선한다.
- controlled와 uncontrolled가 모두 필요한 컴포넌트는 외부 제어 prop과 기본값 prop을 분리한다.

Button처럼 단일 action을 수행하는 컴포넌트와 Accordion처럼 여러 item의 disclosure 상태를 관리하는 컴포넌트는 상태 모델이 다르다. 공통 원칙은 공유하되 API 구조는 컴포넌트별로 다시 결정한다.

## 5. 접근성 설계

접근성은 구현 후 보완하는 항목이 아니라 anatomy와 API를 정할 때 함께 결정한다.

- icon-only UI는 접근 가능한 이름을 요구한다.
- trigger와 content가 연결되는 컴포넌트는 `aria-controls`, `aria-expanded`, `id` 연결이 필요한지 확인한다.
- 선택 상태를 표현하는 컴포넌트는 `aria-selected`, `aria-checked`, `aria-pressed` 중 실제 의미에 맞는 속성을 고른다.
- 키보드 이동이 핵심인 컴포넌트는 arrow key, Home, End, Escape 같은 기대 동작을 먼저 정리한다.
- focus-visible 스타일은 keyboard 사용자에게 식별 가능해야 한다.

## 6. 토큰과 스타일 경계

디자인 시스템 컴포넌트는 raw 색상이나 임의 수치를 직접 반복하지 않는다.

- 색상은 가능한 한 `palette -> semantic -> component` 흐름으로 연결한다.
- 컴포넌트가 반복적으로 쓰는 값은 component token이나 recipe 변수로 승격한다.
- 한 화면에서만 필요한 예외 스타일은 호출처의 `className` escape hatch로 처리할 수 있다.
- 같은 예외가 반복되면 shared variant나 semantic token으로 승격할지 다시 판단한다.
- 시각 스타일은 SEED의 결과물을 복제하지 않고 프로젝트 제품 톤에 맞게 새로 정의한다.
- raw 치수·색은 `design-tokens/no-raw-design-values` ESLint 규칙이 `*.css.ts`에서 차단한다. 스케일 토큰(`vars.dimension`·`vars.typography.fontSize`)은 최종 소비 계층으로 허용하고, 임의 리터럴만 막는다. 예외는 `// eslint-disable-next-line design-tokens/no-raw-design-values -- <이유>`로 이유를 남긴다.
- GSAP·react-spring 같은 런타임 모션은 `.tsx` 인라인 스타일이라 이 규칙 밖이다. 값은 `createVar()`로 `.css.ts`에 계약을 선언하고 JS가 그 변수만 움직이는 브리지 패턴을 쓴다. 설계 근거와 예시는 [토큰 규율 스펙](../superpowers/specs/2026-07-25-strict-design-token-lint-design.md) §5 참고.

## 7. 인터랙션과 motion 계층

인터랙션은 컴포넌트의 public API와 내부 구현 계층을 구분한다.

- hover는 `(hover: hover) and (pointer: fine)` 조건을 고려한다.
- touch 환경에서는 hover에 의존하지 않고 active, focus, selected 상태를 별도로 고려한다.
- motion은 가능한 한 컴포넌트 내부 구현으로 숨기고, public API는 `variant`, `size`, `state`처럼 디자인 시스템 언어로 유지한다.
- motion이 상태 이해를 돕는 경우에만 사용하고, 장식 목적만으로 기본 적용하지 않는다.
- `prefers-reduced-motion`을 고려한다.
- loading indicator, disclosure height animation, focus transition처럼 컴포넌트마다 필요한 motion은 개별 컴포넌트 설계에서 결정한다.

## 8. Storybook과 테스트

Storybook은 디자인 시스템 컴포넌트의 문서이자 회귀 확인 표면이다.

- 기본 사용 예시를 먼저 둔다.
- variant, size, state, composition을 분리해서 보여준다.
- 접근성이나 keyboard behavior가 중요한 컴포넌트는 사용자가 확인할 수 있는 story를 둔다.
- 테스트는 외부 primitive가 보장하는 동작보다 프로젝트 wrapper가 추가한 계약을 검증한다.
- loading, icon-only label, className 병합, asChild, controlled/uncontrolled 연결처럼 프로젝트 코드가 책임지는 분기를 우선 테스트한다.

## 9. 설계 산출물 형식

새 디자인 시스템 컴포넌트를 시작할 때는 최소한 아래 내용을 먼저 정리한다.

```md
## 역할

## SEED에서 참고할 점

## SEED에서 가져오지 않을 점

## Anatomy

## 상태 모델

## Public API

## 접근성

## 토큰/스타일 경계

## 인터랙션과 motion

## Storybook 시나리오

## 테스트 범위

## 이번 작업에서 제외할 것
```
