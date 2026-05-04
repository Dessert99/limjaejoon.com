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
- CRITICAL: 사용자는 학습자다. 다음 위치에 "왜"를 중심으로 한 줄 주석을 단다.
  - 파일/함수 상단: 이 코드가 전체 흐름에서 맡는 역할과 호출 맥락(누가 부르고, 다음 어디로 이어지는지)
  - 제어문(if/for): 어떤 조건·대상을 왜 다루는지
  - 함수 호출 / 함수 정의: "무엇이 들어가 → 어떤 처리를 거쳐 → 무엇이 반환되는지"
  - 데이터 형태가 바뀌는 지점: 변환 전후의 모양(타입·구조)이 어떻게 달라지는지
  - 프레임워크/라이브러리 고유 개념(데코레이터, DI, 훅, 미들웨어 등): 역할을 풀어서
  단, 자명한 단순 할당이나 즉시 return은 생략하고, 주석은 "무엇을"이 아닌 "왜"에 초점을 둔다.

## 절대 하지 말아야 할 것들

- 애매한 부분이 생기면 추측하지 말고 무조건 물어봐라.
- 작업 중간에 임의로 다른 방향으로 바꾸지 마라.
- CRITICAL: 문제가 발생하면 즉시 수정하려 하지 말고 "왜?"를 최소 3회 반복해 근본 원인을 특정한 뒤, 그 원인을 명시하고 고쳐라. try-except로 에러 숨기기, 임시 하드코딩, 예외 케이스용 if 분기 추가, 실패하는 테스트 스킵·주석 처리 등 증상만 가리는 우회는 금지한다. 꼭 사용자에게 원인은 보고한다.
- 학습용 코드는 동작하는 최소 구조만 작성한다. 방어 코드, 재시도, 큐잉 등은 사용자가 요청할 때만 더한다.

## 디자인

- UI/컴포넌트/페이지/에셋 등 디자인 관련 작업은 항상 `limjaejoon-blog-design` 스킬을 사용한다 (디자인 토큰, UI 키트, 톤·아이콘·레이아웃 가이드라인이 포함됨)
- CSS컨벤션은 @docs/conventions/vanilla-extract-conventions.md 참조.
