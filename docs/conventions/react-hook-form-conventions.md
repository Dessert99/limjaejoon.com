# react-hook-form 규칙

### 1. 폼 상태는 `useForm`

- 입력 필드 ≥ 2개인 모든 폼은 `useForm` 사용, raw `useState` 다중 관리 금지
- 제네릭으로 도메인 타입 명시 (예: `useForm<LoginRequest>()`)

### 2. 검증은 `register` 내장 룰 우선

- `register('field', { required, pattern, minLength })`로 인라인 검증, `message`에 한국어 직접 작성
- zod/yup resolver는 schema 재사용·복잡 검증이 필요할 때만 도입

### 3. 에러는 RHF `errors`로 단일 통로

- 백엔드 에러도 `onError`에서 `setError()`로 주입 — 클라·서버 에러를 한 곳에서 표시
- 필드 매핑 가능 시 해당 필드명(예: `'email'`), 불가 시 `'root'