# limjaejoon.com

개인 포트폴리오 & 기술 블로그 사이트. Next.js App Router + Vanilla Extract 기반, MDX 블로그 지원.


## 개발 철학

이 프로젝트는 **바이브 코딩**을 지향하되, 모든 코드를 내가 이해한 다음 적용한다.

- 내가 이해하지 못하는 코드는 이 프로젝트에 존재해선 안 된다
- 단순한 구현이 가능하다면 복잡한 패턴보다 단순한 쪽을 선택할 것


## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Vanilla Extract CSS (타입 안전 CSS-in-JS)
- **Blog**: MDX (next-mdx-remote/rsc, gray-matter)


## 디렉토리 구조
app/           # Next.js 라우트 페이지
features/      # 기능별 컴포넌트 (blog, navigation 등)
content/blog/  # MDX 블로그 포스트
styles/        # 디자인 토큰, 글로벌 스타일 (Vanilla Extract)
public/        # 정적 에셋


## 개발 명령어
npm run dev    # 개발 서버 (Turbopack)
npm run build  # 프로덕션 빌드
npm run lint   # ESLint 검사


## 코드 컨벤션
- 스타일은 반드시 Vanilla Extract (`*.css.ts`)로 작성, 인라인 스타일 지양
- 경로 alias: `@/*` (루트 기준)
- features/ 아래에 기능별로 컴포넌트 분리


