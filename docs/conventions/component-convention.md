# 컴포넌트 컨벤션

프로젝트 전반의 React 컴포넌트 작성 기준이다. 위치·명명·테스트/스토리 위치는 [folder-structure.md](./folder-structure.md), 책임 분리와 Storybook 대상 기준은 [architecture-convention.md](./architecture-convention.md)를 따른다. 이 문서는 그 위에서 컴포넌트 내부 구현의 기본값만 정한다.

규칙은 필요한 만큼만 적용한다. 단순한 컴포넌트를 규칙에 맞추려고 불필요한 props, wrapper, 파일 분리를 만들지 않는다.

## 1. 컴포넌트의 책임

컴포넌트는 렌더링과 사용자 이벤트 연결을 우선한다.

- props를 화면에 표시한다.
- click/change/select 같은 이벤트는 callback prop으로 올린다.
- 짧은 표시용 분기와 렌더 헬퍼는 컴포넌트 안에 둬도 된다.

API 응답 shape 해석, 저장 payload 조립, 정렬·필터 같은 도메인 규칙이 길어지면 `model/` 또는 `lib/`로 분리한다. 위치 판단은 architecture-convention.md가 우선이다.

## 2. props와 렌더링

props는 호출처가 예측하기 쉽게 둔다.

- `children`을 렌더하는 컴포넌트는 구조분해 후 `{children}`로 명시 렌더한다.
- 외부 `className`을 받는 컴포넌트는 내부 클래스와 병합하고 덮어쓰지 않는다.
- DOM 속성을 그대로 받을 때는 실제 렌더 요소에 맞는 React 속성 타입을 확장한다.

```tsx
function Card({ className, children, ...props }: CardProps) {
  return (
    <section
      className={[card, className].filter(Boolean).join(' ')}
      {...props}>
      {children}
    </section>
  );
}
```

## 3. ref와 합성

`ref`는 필요한 컴포넌트에만 노출한다. focus, measurement, animation처럼 호출처가 실제 DOM에 접근해야 하는 저수준 컴포넌트가 대상이다.

Button처럼 외형을 다른 요소에 입혀야 하는 wrapper형 컴포넌트는 `asChild + Slot.Root`를 쓸 수 있다. Input처럼 고유 DOM 의미와 속성이 강한 컴포넌트에는 기본으로 넣지 않는다.

wrapper나 ref 합성 컴포넌트에는 디버깅을 위해 `displayName`을 둔다.

## 4. shared/ui 프리미티브

`shared/ui`는 Button, Input, Badge 같은 도메인 없는 디자인 프리미티브다. 현재 참고 구현은 [Button](../../src/shared/ui/Button/)이다.

- 한 프리미티브는 한 폴더를 기본으로 한다.
- 컴포넌트별 배럴(`Button/index.ts`)은 두지 않는다.
- 새 프리미티브를 추가하면 `src/shared/ui/index.ts`에서 컴포넌트와 필요한 public type을 export한다.
- Button 전용 요구사항(`asChild`, button 속성 등)을 다른 프리미티브에 기계적으로 복제하지 않는다.
