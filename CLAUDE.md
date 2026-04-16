# limjaejoon.com

개인 포트폴리오 & 기술 블로그 + API 서버. npm workspaces 모노레포.


## 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, Vanilla Extract CSS, MDX
- **Backend**: NestJS 11, TypeScript 5
- **공통**: TypeScript 5 (strict mode), npm workspaces


## 디렉토리 구조
frontend/          # Next.js 프론트엔드
  app/             # 라우트 페이지
  features/        # 기능별 컴포넌트
  content/blog/    # MDX 블로그 포스트
  styles/          # 디자인 토큰, 글로벌 스타일
  public/          # 정적 에셋
backend/           # NestJS API 서버
  src/             # 소스 코드


## 개발 명령어
npm run dev:fe     # 프론트엔드 개발 서버
npm run dev:be     # 백엔드 개발 서버
npm run build:fe   # 프론트엔드 빌드
npm run build:be   # 백엔드 빌드
npm run lint       # 전체 린트
npm run format     # 전체 포맷


## 코드 컨벤션
- 프론트엔드 스타일은 반드시 Vanilla Extract (`*.css.ts`)로 작성, 인라인 스타일 지양
- 프론트엔드 경로 alias: `@/*` (`frontend/` 기준)
- `frontend/features/` 아래에 기능별로 컴포넌트 분리


## 활성 플랜
- 현재 진행 중: `docs/plan_harness/` — 세션 시작 시 `PRD.md`, `ARCHITECTURE.md`, `ADR.md`, `phases/index.json`을 먼저 읽고 범위 확인. pending step이 있으면 `phases/stepN.md`를 순서대로 실행.
- 완료되면 이 섹션 제거

## 개발 프로세스
- 커밋 메시지: conventional commits (feat: , fix: )
- CRITICAL: 새 기능은 테스트를 먼저 작성 (TDD)
- 기능 단위 작업은 `/harness`로 설계하고 `npm run harness <plan-dir>`로 실행한다.

## 절대 하지 말아야 할 것들
- 애매한 부분이 생기면 추측하지 말고 무조건 물어봐라.
- 작업 중간에 임의로 다른 방향으로 바꾸지 마라.