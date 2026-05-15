### React Hook Form + zod 컨벤션

### 스키마 / 타입

- `export xxxSchema` + `export type XxxFormValues = z.infer<typeof xxxSchema>`
- 폼 값 타입은 `z.infer` 단일 진실원, interface 별도 선언 금지
- `useForm` 제네릭: `z.input` = `z.output` 이면 `<XxxFormValues>`, 다르면 `<XxxFormInput, unknown, XxxFormValues>` 로 분리

### 필드 선택

- 단순 input / textarea / checkbox: `register('field')`
- 값 타입 변환, multi-select, 외부 라이브러리 연동: `Controller`

### 검증 진실원

- 정적 검증 (필수 / 길이 / 형식) 은 zod
- zod resolver 가 들어가면 `Controller` `rules` / `register` `validate` 무시됨
- 비동기 검증, 외부 state 의존 cross-field 는 zod 밖에서 처리 (mutation, onSubmit 가드)
- zod v4: `ctx.addIssue` 의 `code` 는 raw 문자열, `z.ZodIssueCode` 는 deprecated

### 에러 표시

- `Controller`: `render` 의 `fieldState.error?.message` 인라인 렌더 (응집)
- `register`: 부모에서 `formState.errors[field]?.message` 인라인 렌더

### Mutation 통합

- 제출은 `useXxxMutation` 으로 분리
- 제출 버튼 로딩 상태는 `mutation.isPending` 매핑

### 폼 분해

- useForm 으로 폼 생성. 자식 컴포넌트에서 폼 메서드 접근이 필요하면 FormProvider {...form} 로 감싸고 자식은 useFormContext<XxxFormValues>() 로 받음. 단일 컴포넌트로 끝나면 FormProvider 생략.

### 종속 필드 초기화

- 트리거 필드의 `Controller` `onChange` 안에서 `setValue('dependent', initialValue)`
- `useEffect` + `watch` + first-render-skip ref 트릭 금지