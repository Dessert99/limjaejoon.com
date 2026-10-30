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
app/               # 라우트와 화면 부품(_components). tsx 만 둔다. (home)·(blog) 그룹이 토큰 주인
domains/           # 대상별 코드 (posts, books, library, home, transition): api·lib·config·types·hooks·ui
lib/               # 다른 사이트에도 쓸 수 있는 공용 (supabase, auth, http, motion, env)
components/ui/     # shadcn
styles/            # primitive 토큰, 전역 진입점, 라우트별 css(home·blog·prose)
proxy.ts           # /admin optimistic redirect
supabase/          # 마이그레이션·로컬 설정
tests/integration/ # 실제 Supabase 를 쓰는 통합 테스트
public/            # 정적 에셋
```

## 개발 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run lint       # 린트
npm run ci         # lint + type-check + test + build
npm run format     # 전체 포맷
```
