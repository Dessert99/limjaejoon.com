# limjaejoon.com

개인 포트폴리오 & 기술 블로그

https://www.limjaejoon.com

## 기술 스택

- **App**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Data**: Supabase (Postgres + Auth + Storage)
- **Language**: TypeScript 5 (strict mode)
- **Test**: Vitest + Testing Library

## 프로젝트 구조

```
app/               # Next.js App Router — 라우트 파일이 조립까지 끝낸다
views/             # 라우트별 실체: components·lib·server·config·<route>.css
components/        # 여러 라우트가 쓰는 UI (ui=shadcn, transition)
lib/               # 라우트를 넘는 데이터·유틸 (supabase, auth, http, motion)
config/            # site·env
styles/            # primitive 토큰과 전역 진입점
proxy.ts           # /admin optimistic redirect
supabase/          # 마이그레이션·로컬 설정
tests/integration/ # 실제 Supabase 를 쓰는 통합 테스트
public/            # 정적 에셋
docs/design-records/ # 과거 설계 기록 (시점 스냅샷, 현행 규칙 아님)
```

## 개발 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run lint       # 린트
npm run ci         # lint + type-check + test + build
npm run format     # 전체 포맷
```
