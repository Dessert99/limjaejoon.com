# API + TanStack Query 컨벤션

## API

### 파일 배치
- 조회 엔드포인트: `api/queries/{endpoint}.ts`
- 변경 엔드포인트: `api/mutations/{endpoint}.ts`
- 파일은 엔드포인트 단위로 묶는다. 같은 엔드포인트의 API 함수, 타입, query/mutation hook 은 한 파일에 둔다.
- 여러 엔드포인트를 한 파일에 합치지 않는다. 단, 같은 엔드포인트의 작은 보조 타입/헬퍼는 함께 둘 수 있다.

### 응답 처리
- 백엔드 응답을 변환 없이 위임 (`apiClient.xxx(...)` 한 줄)
- unwrap, 평탄화, 필드 추출은 API 함수에서 하지 않는다. 화면 소비 형태 변환은 TQ 훅의 `select` 에서 한다.
- try-catch 를 API 단에서 씌우지 않음 (호출처에서 처리)

## TanStack Query

### 1. 훅 명명
- Query: 동사 생략. 기본형 `use{Resource}Query`, 변형이 있으면 `use{Resource}{Variant}Query`
- Mutation: 동사 유지. `use{Verb}{Resource}Mutation`
- Suspense: `use{Resource}SuspenseQuery`
- 훅은 `useQuery` / `useMutation` 의 얇은 래퍼. 비즈니스 로직은 API 함수와 컴포넌트에 둠

### 2. 파일 배치
- 조회 훅: 해당 엔드포인트의 `api/queries/{endpoint}.ts`
- 변경 훅: 해당 엔드포인트의 `api/mutations/{endpoint}.ts`

### 3. queryKey 관리
- query key 는 엔드포인트 파일이나 slice 의 `model/` 에 팩토리로 정의한다.
- 훅·뮤테이션에서 inline 배열 (`['problems','list']`) 을 여러 곳에 흩뿌리지 않는다.

### 4. 전역 default 존중
- `providers/queryClient.ts` 의 default 를 훅 단에서 동일 값으로 재정의 금지
- 정책 변경은 `queryClient.ts` 단일 출처에서만. 훅은 정말 다른 값이 필요할 때만 override

### 5. 타입 추론 우선
- `useQuery` / `useMutation` 은 `queryFn` / `mutationFn` 시그니처에서 자동 추론. 제네릭 명시 금지

### 6. 훅 반환은 객체 네임스페이스로 보관
- query/mutation 이 여러 개이거나 식별자 충돌 가능성이 있으면 destructure 대신 변수로 보관한다.
  - `const problemQuery = useProblemQuery(id)`
- 사용: `problemQuery.isPending`, `updateMutation.mutate(data)`

### 7. 로딩 상태는 `isPending` (v5)
- `useMutation`: `isLoading` deprecated → `isPending`
- `useQuery`: `isPending` 사용 (데이터 없음 상태). `isLoading` 은 `isPending && isFetching` 이라 `enabled: false` 일 때 false 가 되어 혼란

### 8. 옵션 매개변수는 실제 주입 시점에 추가
- 단일 호출처에서 옵션을 쓰지 않으면 `options?: Omit<UseQueryOptions, ...>` 를 미리 열지 않는다.
- 재사용 가능성이 명확하거나 호출처가 실제 옵션을 넘기면 그때 추가한다.

### 9. 응답 가공은 `select` 에서
- 컴포넌트는 가공된 도메인 형태만 소비. 응답을 풀거나 가공하지 않음
- `select` 결과는 v5 의 구조적 공유로 참조 안정성 보장 — `useMemo` 불필요
