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
  features/        # 기능별 컴포넌트
  content/blog/    # MDX 블로그 포스트
  styles/          # 디자인 토큰, 글로벌 스타일
  public/          # 정적 에셋
backend/           # NestJS API 서버
  src/             # 소스 코드
docs/              # 프로젝트 문서
  reports/         # 작업 기술서
```

## 작업 기술서 (Reports)

프로젝트 진행 과정에서 주요 작업을 기록한 기술서는 `docs/reports/`에 있다.

- [SEO 최적화 구현 보고서](docs/reports/2026-04-03-seo-implementation.md)
- [모노레포 마이그레이션](docs/reports/2026-04-09-monorepo-migration.md)

## 개발 명령어

```bash
npm run dev:fe     # 프론트엔드 개발 서버
npm run dev:be     # 백엔드 개발 서버
npm run build:fe   # 프론트엔드 빌드
npm run build:be   # 백엔드 빌드
npm run lint       # 전체 린트
npm run format     # 전체 포맷
```
