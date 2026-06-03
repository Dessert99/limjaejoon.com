# Zod 컨벤션

## 스키마 / 타입

- `export xxxSchema` + `export type XxxFormValues = z.infer<typeof xxxSchema>`
- 폼 값 타입은 `z.infer` 단일 진실원, interface 별도 선언 금지
- `useForm` 제네릭: `z.input` = `z.output` 이면 `<XxxFormValues>`, 다르면 `<XxxFormInput, unknown, XxxFormValues>` 로 분리

## 검증 진실원

- 정적 검증 (필수 / 길이 / 형식) 은 zod
- zod resolver 가 들어가면 `Controller` `rules` / `register` `validate` 무시됨
- 비동기 검증, 외부 state 의존 cross-field 는 zod 밖에서 처리 (mutation, onSubmit 가드)
- zod v4: `ctx.addIssue` 의 `code` 는 raw 문자열, `z.ZodIssueCode` 는 deprecated
