# 디자인 시스템 철거 설계

작성일: 2026-07-29

## 1. 배경과 목표

기존 디자인 시스템(vanilla-extract 토큰 + sprinkles + Radix 기반 프리미티브 14종, 2모드 테마)을 전면 교체한다. 새 시스템은 Tailwind CSS 기반으로 다시 세운다.

낡은 시스템을 남겨두면 새 시스템을 만들 때 파일마다 "재사용인가 폐기인가"를 다시 판단해야 하고, 옛 토큰 스케일이 새 디자인의 암묵적 기본값으로 눌러앉는다. 그래서 재사용이 아니라 **철거**를 택한다.

**이번 작업의 범위는 삭제까지다.** Tailwind 설치·설정과 새 디자인 시스템 구축은 다음 작업으로 분리한다.

### 성공 기준

- `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build` 가 모두 통과한다
- 저장소에 남은 `.css.ts` 파일이 0개다
- `package.json` 에 `@vanilla-extract/*` 가 하나도 없다
- `app/api/**` 의 라우트 테스트가 전부 통과한다
- dev 서버에서 `/` 가 빈 페이지로 렌더된다

## 2. 원칙

**뷰는 전부 지우고, 데이터·전송은 전부 남긴다.**

화면·스타일·디자인 도구는 백지로 만들고, API·인증·도메인 타입은 손대지 않는다. 모든 개별 판단은 이 경계 하나에서 파생된다.

이 원칙의 예외는 `entities/profile` 하나다(5절 참고).

## 3. 삭제 대상

### 3.1 라우트

```
app/(public)/               layout.tsx, blog/page.tsx, blog/[slug]/page.tsx,
                            lab/page.tsx, lab/animation/page.tsx, lab/transition/page.tsx
app/admin/                  (protected)/layout.tsx, (protected)/posts/page.tsx,
                            (protected)/posts/new/page.tsx, (protected)/posts/[id]/page.tsx,
                            (public)/login/page.tsx
```

`app/api/admin/**` 은 경로가 다르므로 존치한다. 혼동하기 쉬운 지점이다.

### 3.2 FSD 레이어

```
src/pages/      blog, blog-post, lab, lab-animation, lab-transition,
                admin-posts, admin-login              (슬라이스 통째로)
                home/ui/IntroSection, RiverSection, SceneSection
                                                      (home 슬라이스 자체는 유지)
src/widgets/    scene-backdrop, site-header           (슬라이스 통째로)
src/features/   theme-toggle, post-editor, post-filter (슬라이스 통째로)
                auth/ui/                              (api·model 은 존치)
src/entities/   post/ui/PostMarkdown, post/client.ts
src/shared/     ui/ 전체(14종), styles/ 전체, lib/gsap/
```

`entities/post/client.ts` 는 소비자가 `post-editor` 두 파일뿐이라 함께 사라진다.

### 3.3 빌드·설정 디렉터리

```
.storybook/          main.ts, preview.tsx, preview-head.html
storybook-static/    빌드 산출물
eslint-rules/        no-raw-design-values.mjs, index.mjs, 테스트
```

### 3.4 문서

`docs/conventions/` — `design-system-component.md`, `component-convention.md`

`docs/learning/` — `radix-primitives.md`

`docs/superpowers/specs/` — button-component, color-token-themes, radix-primitives, lab-animation, lab-transition, design-token-foundation, home-portfolio-remake, design-system-terracotta-retheme, strict-design-token-lint, home-intro-section 계열

`docs/superpowers/plans/` — 위 스펙에 대응하는 플랜 + button-action-component, motion-material-button, primitives-restyle, terracotta-color-tokens, radix-primitives-wave-0/1

## 4. 수정 대상

| 파일 | 변경 |
| --- | --- |
| `app/layout.tsx` | `themeBootScript`, `global.css` import, `suppressHydrationWarning` 제거 |
| `src/pages/home/ui/HomePage.tsx` | 빈 `<main>` 껍데기로 축소 |
| `src/pages/home/ui/HomePage.test.tsx` | 빈 껍데기에 맞게 재작성 |
| `src/entities/post/index.ts` | `PostMarkdown`, `PostMarkdownProps` export 제거 |
| `src/features/auth/index.ts` | `LoginForm`, `SignOutButton` export 제거 |
| `next.config.ts` | `withVanillaExtract` 래핑 제거 |
| `vitest.config.ts` | `vanillaExtractPlugin` 제거 |
| `vitest.setup.ts` | Radix 포인터 셔임, GSAP `matchMedia` 셔임 제거 |
| `eslint.config.mjs` | `design-tokens` 플러그인 블록과 import 제거 |
| `package.json` | 아래 패키지와 `storybook`·`build-storybook` 스크립트 제거 |
| `CLAUDE.md` | `component-convention.md` 포인터 제거 |

`postcss.config.mjs` 는 `plugins: {}` 빈 상태다. Tailwind 가 들어올 자리이므로 건드리지 않는다.

### 제거 패키지

dependencies — `radix-ui`, `gsap`, `@gsap/react`, `react-icons`, `@vanilla-extract/css`, `@vanilla-extract/next-plugin`, `@vanilla-extract/sprinkles`, `react-markdown`, `remark-gfm`, `rehype-autolink-headings`, `rehype-pretty-code`, `rehype-slug`, `shiki`, `github-slugger`, `next-mdx-remote`, `@uiw/react-codemirror`, `@codemirror/lang-markdown`

devDependencies — `@vanilla-extract/recipes`, `@vanilla-extract/vite-plugin`, `storybook`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/nextjs-vite`

마크다운 7종은 `PostMarkdown` 전용, CodeMirror 2종은 `PostEditorForm` 전용이라 API 계층에 영향이 없다.

## 5. 존치 판단

**`entities/profile`** — 유일한 소비자 `IntroSection` 이 사라져 고아 슬라이스가 된다. 그럼에도 남긴다. 경력·프로젝트·스킬은 디자인이 아니라 데이터고, 새 홈에서 그대로 재사용한다. `fsd/insignificant-slice` 가 `steiger.config.ts` 에서 이미 꺼져 있어 구조 검사에도 걸리지 않는다.

**`docs/superpowers/**/blog-platform-phase-1*`** — 화면은 지우지만 이 문서가 존치하는 API 계층의 설계 근거를 담고 있다.

**`features/auth` 의 `api`·`model`** — `signIn`, `signOut`, `useSignIn` 은 전송 계층이다. UI 만 지운다.

**`entities/session`, `entities/user`, `app/api/**`, `tests/integration/`** — 전부 데이터·인증 계층이라 손대지 않는다.

## 6. 전역 스타일과 Storybook

전역 스타일을 두지 않는다. `shared/styles/global.css.ts` 를 삭제하고 대체 CSS 를 만들지 않는다. 리셋 전략은 Tailwind 도입 시 결정한다. 그때까지 `/` 는 브라우저 기본 스타일로 렌더된다 — 의도된 상태다.

Storybook 도 함께 제거한다. 프리미티브가 전부 사라져 스토리가 0개가 되고, 설정이 `vanillaExtractPlugin` 과 `global.css` 에 묶여 있어 남겨두면 어차피 손봐야 한다. 새 디자인 시스템 단계에서 다시 설치한다.

## 7. 실행 순서

레이어별로 5단계 커밋한다. 단계마다 어디서 깨졌는지 명확해진다. 의존의 상위부터 지워 중간 단계의 참조 깨짐을 최소화한다.

1. **라우트·화면** — `app/(public)/`, `app/admin/`, `src/pages` 7개 슬라이스, `home` 하위 섹션 3종. `HomePage` 축소
2. **widgets·features** — `scene-backdrop`, `site-header`, `theme-toggle`, `post-editor`, `post-filter`, `auth/ui`. 배럴 정리
3. **shared** — `shared/ui`, `shared/styles`, `shared/lib/gsap`, `entities/post/ui`·`client.ts`. `app/layout.tsx` 수정
4. **빌드 배선·패키지** — `next.config.ts`, `vitest.config.ts`, `vitest.setup.ts`, `eslint.config.mjs`, `eslint-rules/`, `.storybook/`, `storybook-static/`, `package.json`
5. **문서** — `docs/` 정리, `CLAUDE.md` 포인터 수정

1~3 단계 중간에는 타입체크·빌드가 일시적으로 깨질 수 있다. 정상이다. 4단계 완료 시점부터 1절의 성공 기준 전체를 만족해야 한다.

## 8. 검증

각 단계 커밋 전에 최소한 `npm run lint` 와 `npm run type-check` 를 돌려 그 단계가 의도한 범위만 깨뜨렸는지 확인한다.

4단계 이후 전체 검증:

```sh
npm run fsd && npm run lint && npm run type-check && npm run test && npm run build
```

추가 확인:

```sh
# 남은 .css.ts 가 0개인지
find src app -name "*.css.ts"

# vanilla-extract 잔재가 없는지
grep -rn "vanilla-extract" src app *.ts *.mjs package.json
```

마지막으로 dev 서버를 띄워 `/` 가 빈 페이지로 뜨고 콘솔 에러가 없는지 확인한다.

## 9. 범위 밖

- Tailwind CSS 설치·설정
- 새 디자인 토큰·프리미티브 설계
- 홈 화면 재구축
- lab 페이지 재구축 (`model/` 의 `bezier.ts`, `presets.ts`, `toCssValue.ts` 순수 로직도 이번에 함께 삭제된다. 필요하면 git 히스토리에서 복원한다)
- 블로그·어드민 화면 재구축
