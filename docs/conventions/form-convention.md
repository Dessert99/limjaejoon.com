# 폼 컨벤션

스택: `react-hook-form` + `zod 4` + `@hookform/resolvers`

폼 관련 상태와 로직은 최대한 라이브러리(RHF / zod) 안에서 처리한다.

## 스키마 / 검증 진실원

- 스키마를 단일 진실 공급원(SSOT)으로, 타입은 추론만 한다 — Zod 스키마를
  먼저 정의하고 타입은 `z.infer`로 뽑는다. interface 별도 선언 금지.
- 정적 검증(필수 / 길이 / 형식)은 이 스키마 한 곳에서만 한다. resolver를
  쓰면 Controller `rules` / register `validate`는 호출되지 않으니, 필드
  레벨 rules로 검증을 끼워넣지 마라.
- zod v4: `ctx.addIssue`의 `code`는 raw 문자열이고 `z.ZodIssueCode`는
  deprecated. (superRefine 등으로 커스텀 이슈를 낼 때 주의)
- 파일 이름은 `{domain}Schema.ts`, 위치는 [폴더 컨벤션](folder-structure.md).

## register vs Controller

- 단순 input / textarea / checkbox → `register('field')`.
- 값 타입 변환, multi-select, 외부 라이브러리 연동 → `Controller`.

## 제출 / 상태

- 제출은 항상 `handleSubmit` 경유 — "검증 통과 → onSubmit" 순서를 보장한다.
- 제출 로직은 `useXxxMutation`으로 분리하고, 제출 버튼 로딩 상태는
  `mutation.isPending`에 매핑한다.
- `defaultValues`를 모든 필드에 명시해 undefined 필드·uncontrolled→controlled
  경고를 막는다. 비동기로 채워지는 값은 `values` prop(또는 `reset()`)으로.

## 폼 분해

- `useForm`으로 폼을 만든다. 자식 컴포넌트에서 폼 메서드 접근이 필요하면
  `FormProvider {...form}`로 감싸고 자식은 `useFormContext<XxxFormValues>()`로
  받는다. 단일 컴포넌트로 끝나면 FormProvider는 생략.

## 종속 필드 초기화

- 부모 필드 변경으로 종속 필드를 초기화할 때는, 그 필드의 변경 핸들러
  (Controller의 `onChange` 또는 register의 `onChange`) 안에서
  `setValue('dependent', initial)`로 처리한다.
- 이 용도로 `useEffect + watch + first-render-skip ref` 트릭은 쓰지 않는다
  — 마운트 초기화·전체 리렌더·setValue 루프 위험.
