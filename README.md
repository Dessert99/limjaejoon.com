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
reports/           # 작업 기술서·학습 정리
```

## 작업 기술서 (Reports)

프로젝트 진행 과정에서 주요 작업을 기록한 기술서는 `reports/`에 있다.

- [SEO 최적화 구현 보고서](reports/2026-04-03-seo-implementation.md)
- [모노레포 마이그레이션](reports/2026-04-09-monorepo-migration.md)
- [Claude Code 훅 시스템](reports/2026-04-10-claude-code-hooks.md)
- [하네스 엔지니어링](reports/2026-04-17-harness-engineering.md)
- [Docker 로컬 셋업](reports/2026-04-26-docker-local-setup.md)
- [NestJS 아키텍처](reports/2026-04-26-nestjs-architecture.md)
- [auth-session 회고](reports/2026-04-30-auth-session.md)
- [IconTile 글라스모피즘 카드 — vanilla-extract 단일 클래스 규칙과 selectors 패턴](reports/2026-05-01-icon-tile-glass-card.md)

## 개발 명령어

```bash
npm run dev:fe     # 프론트엔드 개발 서버
npm run dev:be     # 백엔드 개발 서버
npm run build:fe   # 프론트엔드 빌드
npm run build:be   # 백엔드 빌드
npm run lint       # 전체 린트
npm run format     # 전체 포맷
```
