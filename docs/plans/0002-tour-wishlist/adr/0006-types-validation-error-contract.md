# 0006. 프론트/백엔드 타입 동기화 · 입력 검증 · 에러 형상 계약

- 상태: 승인됨
- 일자: 2026-05-01

## Context

ADR 0001-0005에서 결정된 흐름이 작동하려면 다음 횡단 관심사가 명확해야 한다:

- RSC 및 클라이언트 fetch 함수가 백엔드 DTO와 같은 타입을 봐야 한다 (모노레포지만 frontend/backend workspace는 분리).
- 백엔드 입력 검증 도구를 정해야 한다 (DTO 데코레이터 기반 vs 별도 schema).
- 백엔드 예외(503/409/400/401)가 프론트 `onError`에서 어떻게 분기 가능한지 형상이 일관되어야 한다.

## Decision

### 1) 타입 동기화 — 수동 미러링 + 책임 명시

- 백엔드 DTO(`TourItemDto`, `TourDetailDto`, `WishlistItemDto`, `CreateWishlistDto`)는 `backend/src/<domain>/dto/`에 단일 출처로 정의.
- 프론트는 `features/<domain>/types.ts`에 **동일한 형태를 수동 미러링**한다. import 관계 없음.
- **페이지네이션 envelope 계약**: 백엔드 `TourService.searchByKeyword(keyword, page)`는 `{ items: TourItemDto[], page: number, hasMore: boolean }` 형태로 반환. 프론트 `useInfiniteQuery`의 `getNextPageParam`은 `(lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined`로 매칭. 이 envelope이 양쪽 단일 약속 — 변경 시 양쪽 동시 수정.
- ADR 본 문서를 동기화 책임 명시로 둔다 — 백엔드 DTO 변경 시 프론트 types.ts도 같은 PR에서 갱신. PR 설명에 "타입 동기화" 명시.
- `packages/shared-types` 같은 공용 workspace는 도입하지 않는다 (YAGNI; 학습 범위 외, frontend·backend 빌드 파이프라인 분리 유지).
- 보강 장치: 백엔드 controller 응답 타입이 명시되어 있으므로 OpenAPI(Swagger 데코레이터) 문서가 형태를 노출 — execute 단계에서 활용 가능하나 자동화는 비범위.

### 2) 입력 검증 — `class-validator` + 전역 `ValidationPipe`

- NestJS 컨벤션을 따라 `class-validator` 데코레이터 기반 DTO 사용.
- `main.ts`에 `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))` 등록.
  - `whitelist: true` — DTO에 정의되지 않은 필드 자동 제거 (의도치 않은 외부 입력 차단).
  - `forbidNonWhitelisted: true` — 알려지지 않은 필드 시 400 응답 (개발 중 오타·악의적 입력 즉시 식별).
  - `transform: true` — primitive 변환(string → number 등) 자동.
- 검증 실패는 `BadRequestException(400)`으로 통일. 응답 본문에 실패 필드 목록 포함.
- **메시지 echo 주의**: `forbidNonWhitelisted: true`의 기본 메시지는 `property <name> should not exist`로 거부된 필드명을 응답에 echo한다. 학습 dev 환경에서 실질 위험은 미미하나, **민감 필드(예: password, token)에 대한 검증 실패 메시지는 `@IsString({ message: '비밀번호 형식이 올바르지 않습니다' })` 식 고정 문자열로 명시**해 입력 값이나 필드명이 응답에 그대로 박히지 않게 한다.

### 3) 에러 형상 계약

모든 에러 응답은 NestJS `HttpExceptionFilter` 기본 형태를 따르되, 프론트가 분기하기 좋도록 다음 계약으로 정리:

```json
{
  "statusCode": 400,
  "message": "validation failed" | string | string[],
  "error": "Bad Request"
}
```

- 검증 실패(`ValidationPipe`): 400, `message`는 `string[]` (필드별 메시지 배열).
- 위시리스트 중복(`ConflictException`): 409, `message`는 단일 문자열.
- 외부 API 장애(`ServiceUnavailableException`): 503, `message`는 `'외부 관광 API 호출 실패'` 고정 — 원본 axios 에러는 logger에만 기록(ADR 0002와 일관).
- 인증 실패(`UnauthorizedException`): 401. 미들웨어가 1차 차단하므로 정상 흐름에서는 만료 레이스 케이스에만 도달.
- 권한 누락은 별도 코드 사용 안 함 — service가 본인 소유 검사로 0 row 처리(ADR 0003), 결과 없을 때만 `NotFoundException(404)` 던짐 (위시리스트 항목 ID 자체의 존재 정보를 노출하지 않음 = IDOR 방어).

### 4) 프론트 측 활용

- axios 응답 인터셉터가 이 형상의 `AxiosError<{ statusCode, message, error }>`로 도착.
- TanStack Query `onError`에서 `error.response?.data.statusCode`로 분기:
  - 400 → 입력 폼 필드 에러로 표시 (RHF `setError` 컨벤션과 동일)
  - 409 → "이미 위시리스트에 있습니다" 토스트
  - 503 → "관광 정보 서비스를 일시적으로 이용할 수 없습니다" 안내
  - 401 → **분기 처리**:
    - `useSuspenseQuery` 경로: ErrorBoundary가 `/login?redirect=<현재경로>`로 폴백 (ADR 0004와 일관)
    - `useMutation` 경로(위시리스트 추가/삭제): mutation은 Suspense 밖이라 ErrorBoundary를 안 탐. 공용 `useAuthRedirectOnUnauthorized` 훅 또는 `useWishlistToggle` 내부 `onError`에서 직접 `router.push('/login?redirect=' + pathname)` 처리.

## Consequences

- 수동 미러링이라 PR마다 타입 동기화 검토가 필요. 작은 학습 범위라 부담 적음. 형식 어긋나면 런타임에 즉시 드러남(개발 중).
- `class-validator` 전역 적용은 다른 도메인(auth, users)에도 영향. 이미 적용 중이라면 변경 없음, 미적용이면 회귀 가능성 있어 execute 단계 첫 작업으로 검증.
- **회귀 검증 항목**: `forbidNonWhitelisted: true`로 인해 기존 `auth/users` 요청 페이로드 중 DTO에 정의되지 않은 필드가 있으면 모두 400으로 거부됨. execute 첫 라운드에서 (a) 기존 `LoginDto`/`SignupDto`/`RefreshDto` 필드와 클라이언트가 보내는 페이로드 일치 확인, (b) 기존 `useLogin`/`useSignup` 테스트 통과 여부 확인.
- 에러 형상 계약 고정으로 프론트 분기가 단순해짐. 새 에러 코드 추가 시 본 ADR 갱신.
