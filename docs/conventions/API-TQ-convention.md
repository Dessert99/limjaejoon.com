# API + TanStack Query 컨벤션

## API

### 함수 명명
- 패턴: **동사 + 도메인** (`getUser`)
- 화살표 함수로 작성

### 응답 처리
- 백엔드 응답을 변환 없이 위임 (`apiClient.xxx(...)` 한 줄)
- unwrap, 평탄화, 필드 추출 금지 — 변환은 TQ 훅의 `select` 에서
- try-catch 를 API 단에서 씌우지 않음 (호출처에서 처리)

## TanStack Query

### 1. 훅 명명
- Query: 동사 생략. 기본형 `use{Resource}Query`, 변형이 있으면 `use{Resource}{Variant}Query`
- Mutation: 동사 유지. `use{Verb}{Resource}Mutation`
- Suspense: `use{Resource}SuspenseQuery`
- 훅은 `useQuery` / `useMutation` 의 얇은 래퍼. 비즈니스 로직은 API 함수와 컴포넌트에 둠

### 2. 파일 배치
- 조회 훅: `hooks/queries/`
- 변경 훅: `hooks/mutations/`
- `hooks/` 루트: TQ 가 아닌 일반 커스텀 훅
- **1 파일 = 1 훅 = 1 API 함수**. add/remove 같은 걸 한 훅에 묶지 않음

### 3. queryKey 관리
- `constants/{domain}Keys.ts` 에 팩토리로 정의 (`problemsKeys.list(params)`)
- 훅·뮤테이션에서 inline 배열 (`['problems','list']`) 직접 사용 금지 — 키 변경 시 누락 위험

### 4. 전역 default 존중
- `providers/queryClient.ts` 의 default 를 훅 단에서 동일 값으로 재정의 금지
- 정책 변경은 `queryClient.ts` 단일 출처에서만. 훅은 정말 다른 값이 필요할 때만 override

### 5. 타입 추론 우선
- `useQuery` / `useMutation` 은 `queryFn` / `mutationFn` 시그니처에서 자동 추론. 제네릭 명시 금지
- 예외: 커스텀 에러 타입 (`AxiosError<AuthErrorResponse>` 등) 이 필요할 때만 명시

### 6. 훅 반환은 객체 네임스페이스로 보관
- destructure 대신 변수로 보관. 변수명은 훅명과 일치
  - `const problemQuery = useProblemQuery(id)`
- 사용: `problemQuery.isPending`, `updateMutation.mutate(data)`
- 식별자 충돌 방지, 새 필드 접근 시 추가 destructure 불필요

### 7. 로딩 상태는 `isPending` (v5)
- `useMutation`: `isLoading` deprecated → `isPending`
- `useQuery`: `isPending` 사용 (데이터 없음 상태). `isLoading` 은 `isPending && isFetching` 이라 `enabled: false` 일 때 false 가 되어 혼란

### 8. 옵션 매개변수는 실제 주입 시점에 추가
- `options?: Omit<UseQueryOptions, ...>` + `...options` spread 는 호출자가 실제로 옵션을 넘길 때만 추가
- 단일 호출처에 옵션 미사용이면 빼기 — 추상화 미리 만들지 않음

### 9. 응답 가공은 `select` 에서
- 컴포넌트는 가공된 도메인 형태만 소비. 응답을 풀거나 가공하지 않음
- `select` 결과는 v5 의 구조적 공유로 참조 안정성 보장 — `useMemo` 불필요