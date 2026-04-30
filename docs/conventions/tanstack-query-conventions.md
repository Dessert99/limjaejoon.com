# TanStack Query 규칙

### 1. queryKey 관리

- queryKey는 `features/<domain>/constants/keys.ts`에 팩토리로 정의 (예: `authKeys.me()`)
- hook·mutation에서 inline 배열(`['auth','me']`) 직접 사용 금지 — 키 변경 시 누락 위험

### 2. 전역 default 존중

- `providers/queryClient.ts`의 default를 hook 단에서 동일 값으로 재정의 금지
- 정책 변경은 단일 출처(`queryClient.ts`)에서만, hook은 다른 값이 정말 필요할 때만 override

### 3. 타입 추론 우선

- `useMutation`/`useQuery`는 mutationFn·queryFn 시그니처에서 자동 추론, 제네릭 명시 금지
- 예외: 커스텀 에러 타입(`AxiosError<AuthErrorResponse>`)이 필요할 때만 명시

### 4. hook 반환은 객체 네임스페이스로 보관

- destructure 대신 `const <domain>Mutation = useXxx()` / `const <domain>Query = useYyy()` 변수로 보관
- 사용 시 `loginMutation.mutate(data)`, `meQuery.isLoading` — 식별자 충돌·혼동 방지, 새 필드 접근 시 추가 destructure 불필요
