# limjaejoon.com

개인 포트폴리오 & 기술 블로그

https://www.limjaejoon.com

## 기술 스택

- **App**: Next.js 16 (App Router), React 19, Vanilla Extract CSS, MDX
- **Language**: TypeScript 5 (strict mode)

## 프로젝트 구조

```
app/               # Next.js App Router
pages/             # 빈 폴더(.gitkeep): src/pages를 Pages Router로 오인하지 않게 슬롯 점유
src/               # FSD 레이어
  pages/           # 라우트 단위 화면 조립
  widgets/         # 큰 UI 블록
  features/        # 사용자 행동 단위 기능
  entities/        # 도메인 모델과 UI/API
  shared/          # 공용 UI, lib, styles, config
content/blog/      # MDX 블로그 포스트
public/            # 정적 에셋
docs/
  conventions/     # 코드/스타일 규칙 (CLAUDE.md에서 참조)
  superpowers/     # 과거 설계 기록
```

## 개발 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run lint       # 린트
npm run ci         # fsd + lint + type-check + test + build
npm run format     # 전체 포맷
```
