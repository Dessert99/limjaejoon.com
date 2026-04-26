# 0006. 프론트 모듈 구조와 타입 배치

- 상태: 승인됨
- 일자: 2026-04-26

## Context
인증 기능의 프론트 코드 위치, 도메인 타입 위치, 추론 유틸 타입 규약을 정한다.

## Options
- **A. 폼·훅·api 모두 `features/auth/` 안에 배치**
- **B. 라우트별 `app/login/_components/`로 분리**
- **types: 단일 파일 vs `types/` 폴더 분리**
- **추론 유틸 타입: types에 모음 vs 사용처 co-location**

## Decision

### 디렉토리 트리
```
frontend/
  lib/
    api/
      client.ts                  -- axios instance + 인터셉터 (ADR 0004)
      tokenStore.ts              -- accessExpiresAt + refreshPromise (ADR 0004)
    auth/
      verifySession.ts           -- React.cache() 헬퍼 (ADR 0005)
      safeReturnTo.ts            -- open redirect 방어 헬퍼 (ADR 0005)
  features/
    auth/
      api/
        signup.ts
        login.ts
        logout.ts
        refresh.ts
        getMe.ts
      hooks/
        useSignup.ts
        useLogin.ts
        useLogout.ts
        useMe.ts
      components/
        LoginForm.tsx + loginForm.css.ts
        SignupForm.tsx + signupForm.css.ts
        FormField.tsx + formField.css.ts
      types.ts
  app/
    providers.tsx                -- QueryClientProvider 등 (ADR 0007)
    layout.tsx                   -- <Providers>로 wrap
    login/page.tsx               -- LoginForm을 features/auth에서 import
    signup/page.tsx
    (protected)/
      layout.tsx                 -- verifySession() 호출
      me/page.tsx
  middleware.ts
```

### 라우트별 진입점은 가볍게
`app/login/page.tsx`는 `<LoginForm />`을 렌더하는 한 줄짜리 클라이언트 컴포넌트. 폼 로직·스타일은 `features/auth/components/LoginForm.tsx`. **`app/login/_components/`는 사용하지 않음**.

### Providers 위치
**`frontend/app/providers.tsx`** ('use client'). Next.js App Router 관례. `features/shared/`는 두 번째 도메인이 생길 때 도입(YAGNI).

### 타입 위치
`features/auth/types.ts` **단일 파일**로 시작. 들어갈 것:
- API 입출력 도메인 타입: `User`, `LoginRequest`, `LoginResponse`, `SignupRequest`, `SignupResponse`, `MeResponse`
- 백엔드 에러 응답 형태: `AuthErrorResponse`(NestJS 기본 포맷, ADR 0002)

들어가지 않는 것 (사용처 co-location):
- `Parameters<typeof loginApi>[0]` — `useLogin.ts` 내부에서 `type LoginVars = Parameters<typeof loginApi>[0]`
- `Awaited<ReturnType<typeof getMe>>` — 사용처에서 직접 추론
- 폼 내부 상태 타입(`FormErrors`, `FormState`) — 각 폼 컴포넌트 파일

### `types/` 폴더로 분리하는 시점
다음 중 하나가 발생하면 `types/` 폴더 + `api.ts`/`model.ts`/`ui.ts`로 분리:
- ui 전용 타입이 api 타입과 섞여 import 경로 혼란
- 한 파일 100줄 초과
- 다른 feature에서 일부 타입 재사용 시작 → `features/shared/types/`로 승격 검토

### 부수 작업: `colorDanger` 토큰
폼 에러 색상 하드코딩 회피용. `frontend/styles/theme.css.ts`에 dark·light 양쪽 `colorDanger`/`colorDangerSubtle` 추가. 정확한 hex는 `limjaejoon-blog-design` 스킬 가이드라인에 맞춤(execute 단계에서 디자인 스킬 참조).

## Consequences
**얻는 것**: 도메인 응집. 라우트 파일 비대화 방지. 타입 점프 1회로 도메인 모델 확인. Providers는 Next 관례 따름.

**잃는 것**: `LoginForm`이 `app/login/page.tsx`에서만 쓰이는 동안 추가 디렉토리 비용. 단일 `types.ts`는 도메인이 커지면 거대해짐 — 분리 시점 가이드라인으로 대응.

`Parameters<...>` 추론 유틸을 사용처에 두는 이유: 함수 시그니처 변경 시 타입이 자동 따라감, 이름 충돌 없음.

## Learnings
<!-- /execute 후 채움 -->
