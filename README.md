# limjaejoon.com

개인 포트폴리오 & 기술 블로그 + API 서버

https://www.limjaejoon.com

## 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, Vanilla Extract CSS, MDX
- **Backend**: NestJS 11, TypeScript 5
- **공통**: TypeScript 5 (strict mode), npm workspaces 모노레포

## 프로젝트 구조

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

```bash
npm run dev:fe     # 프론트엔드 개발 서버
npm run dev:be     # 백엔드 개발 서버
npm run build:fe   # 프론트엔드 빌드
npm run build:be   # 백엔드 빌드
npm run lint       # 전체 린트
npm run format     # 전체 포맷
```
