# limjaejoon.com

개인 포트폴리오 & 기술 블로그 + API 서버. npm workspaces 모노레포.

## 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, Vanilla Extract CSS, MDX
- **Backend**: NestJS 11, TypeScript 5
- **공통**: TypeScript 5 (strict mode), npm workspaces

## 디렉토리 구조

```
frontend/          # Next.js 프론트엔드
  app/             # 라우트 페이지
  features/        # 기능별 컴포넌트·훅·API·타입
  lib/             # 도메인 비종속 인프라 (api client, auth helpers)
  providers/       # 전역 Provider (QueryClient 등)
  styles/          # 디자인 토큰, 글로벌 스타일
  content/blog/    # MDX 블로그 포스트
  public/          # 정적 에셋
  proxy.ts         # Next.js 16 proxy
backend/           # NestJS API 서버
  src/
    auth/          # 인증·세션
    users/         # 사용자 도메인
    config/        # env 검증
    database/      # TypeORM DataSource
    migrations/    # DB 스키마 변경 이력
docs/
  conventions/     # 코드/스타일 규칙 (CLAUDE.md에서 참조)
  plans/           # 기능 단위 PRD/ADR/state
```

## 개발 명령어

```sh
npm run dev:fe     # 프론트엔드 개발 서버
npm run dev:be     # 백엔드 개발 서버
npm run build:fe   # 프론트엔드 빌드
npm run build:be   # 백엔드 빌드
npm run lint       # 전체 린트
npm run format     # 전체 포맷
```

## 코드 컨벤션

- 프론트엔드 경로 alias: `@/*` (`frontend/` 기준)
- `frontend/features/` 아래에 기능별로 컴포넌트 분리
- TanStack Query 컨벤션은 @docs/conventions/tanstack-query-conventions.md 참조.
- React Hook Form 컨벤션은 @docs/conventions/react-hook-form-conventions.md 참조.
- TDD 컨벤션은 @docs/conventions/tdd-conventions.md 참조.

## 개발 프로세스

- 커밋 메시지: conventional commits (feat: , fix: )
- CRITICAL: 모든 로직과 데이터 흐름에 독자가 이해하기 쉽게 한 줄 이내로 주석을 추가한다.

## 절대 하지 말아야 할 것들

- 애매한 부분이 생기면 추측하지 말고 무조건 물어봐라.
- 작업 중간에 임의로 다른 방향으로 바꾸지 마라.

## 디자인

- UI/컴포넌트/페이지/에셋 등 디자인 관련 작업은 항상 `limjaejoon-blog-design` 스킬을 사용한다 (디자인 토큰, UI 키트, 톤·아이콘·레이아웃 가이드라인이 포함됨)
- CSS컨벤션은 @docs/conventions/vanilla-extract-conventions.md 참조.
