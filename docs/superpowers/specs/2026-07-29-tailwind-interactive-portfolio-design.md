# Tailwind 인터랙티브 포트폴리오 설계

작성일: 2026-07-29

## 1. 배경과 목표

[디자인 시스템 철거](2026-07-29-design-system-teardown-design.md)로 화면과 스타일이 백지가 됐다. 그 자리에 Tailwind CSS v4 기반의 인터랙티브 포트폴리오를 세운다.

레퍼런스는 [dennis-snellenberg-portfolio](https://github.com/AliBagheri2079/dennis-snellenberg-portfolio)다. 복제가 목적이 아니라 아래 특성만 가져온다.

거대한 fluid typography · 넓은 섹션 여백 · 비대칭 레이아웃 · 마스크 기반 텍스트 reveal · scroll parallax · marquee · horizontal media rail · media scale/mask reveal · 밝은 섹션과 어두운 섹션의 강한 대비 · 버튼 내부 fill transition

### 성공 기준

- `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build` 통과
- Storybook 빌드 통과, a11y addon violation 0
- 375 / 430 / 768 / 1024 / 1440px 에서 horizontal overflow 없음
- `prefers-reduced-motion: reduce` 에서 모든 모션이 정적으로 떨어지고 콘텐츠 손실이 없음
- scroll-driven animation 미지원 브라우저에서 콘텐츠가 전부 보임

## 2. 확정된 선택

| 선택지 | 결정 | 근거 |
| --- | --- | --- |
| 모션 구현 | 네이티브 CSS 우선, JS는 최소 | GSAP·Lenis·Motion 없이 런타임 패키지 0개. 7절에 경계 정의 |
| 명암 대비 | 섹션 단위 반전만 | 사용자 테마 토글 없음. semantic 토큰 한 벌 + `data-surface` 스코프 |
| 화면 범위 | 홈 1페이지 | 블로그·어드민 화면 재구축은 범위 밖 |
| 폰트 | Pretendard 로컬 + `next/font/local` | 한글·영문 한 벌, self-host, 외부 요청 0 |
| 클래스 정렬 | `prettier-plugin-tailwindcss` 도입 | diff 소음 감소, 위험 없음 |

## 3. 원칙 — source of truth 3분할

각 정보가 사는 곳은 **한 곳뿐이다.** 두 곳에 적히는 순간 어긋난다.

| 정보 | 유일한 출처 |
| --- | --- |
| 토큰 값 (색·타이포·여백·모션·레이어) | `src/shared/styles/*.css` |
| 컴포넌트 상태·variant·props | Storybook story |
| 설계 이유·변경 규칙·경계 | `docs/` 마크다운 |

마크다운에 토큰 값 표를 복사하지 않고, Storybook이 이미 보여주는 props를 마크다운에 다시 적지 않는다.

## 4. 토큰 아키텍처

### 4.1 계층과 prefix

**primitive** — `:root` 의 평범한 커스텀 프로퍼티. `--ds-*` prefix. `@theme` 에 올리지 **않는다.**

```
--ds-neutral-0 … --ds-neutral-1000      중립 팔레트
--ds-accent-100 … --ds-accent-900       accent 팔레트
--ds-radius-{none,sm,md,lg,full}        raw radius
--ds-duration-{100,200,400,800,1200}    raw duration
--ds-ease-{linear,standard,enter,exit,reveal,cinematic}
--ds-z-{base,content,sticky,navigation,overlay,transition}
```

`@theme` 에 올리지 않는 이유가 이 설계의 핵심이다. 올리면 `bg-ds-neutral-900` 같은 유틸리티가 자동 생성되어 semantic 계층을 우회하는 통로가 된다. primitive는 semantic이 `var()` 로 참조할 뿐, 컴포넌트가 직접 만질 수 없어야 한다.

**semantic** — `@theme` 안에서만 존재한다. Tailwind 네임스페이스를 써야 유틸리티가 생성되므로 `--ds-*` prefix를 붙이지 않는다. `@theme` 안에만 있어 충돌 위험이 없다.

**`inline` 을 쓰지 않는다.** 이 선택이 4.4 섹션 반전의 작동 조건이다.

```
@theme        { --color-surface: var(--ds-neutral-900) }
              → .bg-surface { background-color: var(--color-surface) }   ✅
@theme inline { --color-surface: var(--ds-neutral-900) }
              → .bg-surface { background-color: var(--ds-neutral-900) }  ❌
```

`inline` 은 유틸리티에 값을 박아 넣으므로, `[data-surface]` 에서 `--color-surface` 를 덮어도 유틸리티가 따라오지 않는다. 반전이 통째로 죽는다.

`inline` 이 필요한 경우는 **semantic 아래에 또 하나의 스코프 변수 층**을 두고 그쪽을 덮을 때다(shadcn 패턴). 이름 층이 셋으로 늘어날 뿐 얻는 게 없어 택하지 않는다.

### 4.2 semantic 역할 15종과 Tailwind 이름

역할은 하나도 빼지 않되, `text-text-muted` 같은 중복 접두를 피해 이름을 조정한다.

| 역할 | CSS 변수 | 유틸리티 예 |
| --- | --- | --- |
| background | `--color-background` | `bg-background` |
| foreground (= text) | `--color-foreground` | `text-foreground` |
| surface | `--color-surface` | `bg-surface` |
| surface-raised | `--color-surface-raised` | `bg-surface-raised` |
| surface-inverse | `--color-surface-inverse` | `bg-surface-inverse` |
| text-muted | `--color-muted` | `text-muted` |
| text-subtle | `--color-subtle` | `text-subtle` |
| text-inverse | `--color-inverse` | `text-inverse` |
| border | `--color-border` | `border-border` |
| border-strong | `--color-border-strong` | `border-border-strong` |
| accent | `--color-accent` | `bg-accent` |
| accent-hover | `--color-accent-hover` | `hover:bg-accent-hover` |
| accent-foreground | `--color-accent-foreground` | `text-accent-foreground` |
| focus-ring | `--color-focus-ring` | `outline-focus-ring` |

### 4.3 나머지 네임스페이스

**typography** — `--font-body` / `--font-display` (`font-body`, `font-display`), 스케일은 `--text-*` 8종: `label` `body-sm` `body` `body-lg` `statement` `section` `project` `hero`. `statement` 이상은 `clamp()` 로 정의한다.

`--text-*` 와 `--color-*` 는 둘 다 `text-<name>` 유틸리티를 만든다. **두 네임스페이스에 같은 이름을 쓰지 않는다.** 현재 이름들은 겹치지 않는다(hero·statement vs foreground·muted·subtle·inverse).

**layout** — `--container-content`, `--container-wide`, `--spacing-gutter`, `--spacing-section`, `--spacing-section-sm`, `--spacing-grid-gap`. controlled bleed 는 `@utility` 로 정의한다.

**motion** — `--ease-*` 는 Tailwind 네임스페이스가 있어 `ease-reveal` 유틸리티가 생성된다. **duration 은 네임스페이스가 없다** — `duration-(--ds-duration-800)` 임의값 변수 문법을 쓰거나 `@utility` 로 명명 유틸리티를 정의한다. 2단계에서 실측 후 확정한다.

**layer** — z-index 네임스페이스가 없으므로 primitive `--ds-z-*` 를 `z-(--ds-z-navigation)` 형태로 직접 참조한다. semantic 승격을 하지 않는 유일한 계층이다.

### 4.4 섹션 반전

`:root` 가 다크 기본, `[data-surface='light']` 가 semantic 변수만 재정의한다. 컴포넌트는 `bg-surface text-foreground` 만 쓰고 자신이 밝은 곳에 있는지 어두운 곳에 있는지 몰라도 된다.

덮어쓰는 대상은 **`--color-*` 이름 자체**다. primitive(`--ds-*`)를 덮으면 팔레트가 통째로 바뀌어 accent 까지 끌려간다.

```
:root                  { --color-surface: var(--ds-neutral-900) }
[data-surface='light'] { --color-surface: var(--ds-neutral-50)  }
```

사용자 테마 토글은 없다. 부트 스크립트도, hydration 처리도 필요 없다.

### 4.5 금지

- JSX 안의 hex color
- 의미 없는 arbitrary value (`bg-[#111]`, `text-[42px]`)
- primitive 유틸리티 직접 사용
- `@apply` 로 클래스 묶음을 CSS 로 도피시키기 — 반복되면 컴포넌트로 추출한다

이를 위한 커스텀 ESLint 룰은 만들지 않는다. 철거한 `no-raw-design-values` 를 되살리지 않는다. 리뷰에서 잡는다.

## 5. FSD 배치

기존 구조를 그대로 쓴다. 새로 만드는 것은 `src/widgets` 레이어 부활과 `entities/project` 뿐이다.

```
src/shared/styles/     토큰·전역 스타일·폰트 (folder-structure.md 가 이미 규정한 자리)
src/shared/lib/        cn, useInView, motion preset
src/shared/ui/         Container Button ShowcaseButton Media SectionHeading
                       MaskReveal RevealText Parallax Marquee MediaReveal
src/entities/project/  프로젝트 도메인 데이터와 타입
src/widgets/           site-navigation (부활)
src/pages/home/        섹션 조립 + 페이지 전용 콘텐츠
```

`shared/ui` 는 per-component `index.ts` 를 두지 않는다. 슬라이스 공개 API 하나가 파일을 직접 re-export 한다.

CSS 는 side-effect import 라 배럴을 경유하지 않는다. `app/layout.tsx` 가 `@/shared/styles/global.css` 를 직접 import 한다. `fsd/no-public-api-sidestep` 이 이미 off 라 Steiger 를 통과한다.

`*.stories.*` 는 Steiger·ESLint ignores 에 추가한다. 스토리의 픽스처 import 가 public-api 룰에, CSF export 가 `func-style` 룰에 걸린다. **Storybook 을 위해 FSD 구조 자체는 건드리지 않는다** — 검사 도구의 ignores 만 조정한다.

## 6. 데이터 소유권

`entities/profile` 을 해체한다. 철거 때 데이터를 살려둔 판단은 옳았지만, 4단계 규칙(프로젝트는 project entity, 페이지 전용 콘텐츠는 해당 page/widget)을 적용하면 이 슬라이스가 남을 자리가 없다.

| 데이터 | 소유 | 비고 |
| --- | --- | --- |
| 사이트 이름·영문명·SITE_URL·직무·한 줄 소개 | `shared/config/site.ts` | 기존 파일 확장 |
| 소셜 링크 (email, GitHub, LinkedIn, 블로그) | `shared/config/site.ts` | metadata·footer·Contact 3곳이 소비 |
| 프로젝트 전체 | `entities/project` | 신규. 타입 전면 재정의 |
| Hero 문구 (메인·보조·지역/상태) | `pages/home/config/` | 홈 전용 |
| Introduction 제목·본문·CTA·skills | `pages/home/config/` | 홈 전용 |
| Navigation item | `widgets/site-navigation/config/` | 위젯 소유 |
| Storybook fixture | 스토리 파일 안 인라인 | 커지면 `ui/{Name}/{Name}.fixtures.ts` |

전역 `data/` 디렉터리를 만들지 않는다. 전역 `src/shared/fixtures/` 도 만들지 않는다. UI 컴포넌트 안에 콘텐츠를 하드코딩하지 않는다.

`Project` 타입은 4단계에 실제로 들어온 필드만 정의한다. 미래를 추측한 필드를 만들지 않는다.

## 7. 모션 아키텍처

### 7.1 CSS 와 JS 의 경계

**스크롤에 연속으로 물리는 것은 CSS, 상태가 한 번 바뀌고 머무는 것은 JS.**

| 구현 | 방식 | 이유 |
| --- | --- | --- |
| Parallax | CSS `animation-timeline: view()` | 스크롤 위치에 연속 대응 |
| Marquee | CSS keyframes + 콘텐츠 복제 | 스크롤 무관 무한 루프 |
| Gallery rail | CSS `animation-timeline: view()` | 세로 progress → x transform |
| MaskReveal (once) | IntersectionObserver | view timeline 은 되감으면 같이 되감긴다 — once 가 불가능 |
| RevealText | IntersectionObserver | 위와 동일 + stagger 인덱스 필요 |
| MediaReveal | IntersectionObserver | enter/exit 를 분리하려면 상태가 필요 |

훅은 `useInView` 하나다. `shared/lib/**` 가 `func-style: expression` 을 강제하므로 화살표 함수로 작성한다.

### 7.2 motion preset 의 범위

`shared/lib` 의 motion preset 은 **CSS 가 소유할 수 없는 것만** 담는다 — `useInView` 의 viewport 기본값(rootMargin·threshold·once), 공통 stagger 인덱스 규칙.

duration·easing·transition 은 CSS 토큰이 단독 소유하고 유틸리티(`ease-reveal`, `duration-*`)로 소비한다. JS 에 같은 값을 두면 4.5의 토큰 중복 금지와 정면으로 충돌한다.

### 7.3 transform ownership

**한 엘리먼트당 변환 소유자는 하나다.** parallax 와 reveal 이 같은 엘리먼트의 `transform` 을 잡으면 나중 것이 앞의 것을 통째로 덮는다.

겹칠 수밖에 없으면 두 가지로 푼다.

1. 래퍼를 겹쳐 층을 나눈다 — 외곽이 parallax, 내부가 reveal
2. `transform` 축약형 대신 개별 프로퍼티(`translate` / `scale` / `rotate`)로 소유권을 쪼갠다

`motion.css` 헤더와 각 Effect 컴포넌트 헤더에 어느 프로퍼티를 소유하는지 명시한다.

### 7.4 폴백과 reduced-motion

reveal 의 초기 `opacity: 0` 은 반드시 `@supports (animation-timeline: view())` 또는 JS 마운트 이후에만 적용한다. 무조건 적용하면 미지원 브라우저에서 콘텐츠가 영구히 사라진다.

reduced-motion 차단 셀렉터는 두 개를 함께 선언한다.

```
@media (prefers-reduced-motion: reduce) { … }
[data-motion='reduced']                 { … }
```

앞은 실사용자, 뒤는 Storybook 토글용이다. `data-scroll-behavior='smooth'` 도 이때 `scroll-behavior: auto` 로 되돌린다.

### 7.5 성능 규칙

- `transform` · `opacity` · `clip-path` 만 애니메이션한다
- `width` · `height` · `top` · `left` · `box-shadow` 애니메이션 금지
- `will-change` 는 계측 후에만 붙인다 — 남발하면 레이어가 폭증해 오히려 느려진다
- viewport 밖 요소는 애니메이션하지 않는다
- scroll 이벤트 리스너를 직접 달지 않는다 (CSS 타임라인 또는 IntersectionObserver)

## 8. Storybook 아키텍처

`storybook@10` + `@storybook/nextjs-vite`. 프로젝트가 이미 `@vitejs/plugin-react` + Vitest 를 쓰고 있어 Vite 빌더가 마찰이 가장 적다.

**addon** — `addon-a11y`(axe), `addon-docs`(autodocs), `addon-themes`(`data-surface` 토글). viewport·backgrounds·interactions 패널은 SB 9 부터 코어 내장이라 addon 을 넣지 않는다. `@storybook/addon-vitest` 는 Playwright 브라우저를 끌고 오므로 3단계에서 실제로 필요해질 때 판단한다.

**스타일 일치** — preview 가 앱과 **같은** `global.css` 한 파일을 import 한다. SB 전용 CSS 를 만들지 않는다. 폰트도 `addon` 의 `next/font` 처리에 맡기지 않고 `fonts.ts` 가 만드는 CSS 변수를 데코레이터로 직접 건다.

**뷰포트** — Tailwind `--breakpoint-*` 와 **같은 수치**로 커스텀 목록을 정의한다. 값의 출처가 갈리지 않게 한다.

**story 배치** — 컴포넌트 옆 (`ui/Button/Button.stories.tsx`). `folder-structure.md` 4절과 같은 규칙이다.

**Foundation story** — 토큰 값을 복사하지 않고 실제 CSS 변수를 읽어 렌더한다. 값이 CSS 에서 바뀌면 스토리가 자동으로 따라간다.

**무한 애니메이션** — Marquee 등은 스토리에서 정지할 수 있어야 한다. `[data-motion='reduced']` 토글이 그 역할을 겸한다.

## 9. 접근성 기준선

- 네이티브 HTML 우선. 복합 interaction 일 때만 Radix 를 검토한다. 5단계 모바일 메뉴가 유일한 후보이며, 네이티브 `<dialog>` 로 먼저 시도한 뒤 부족할 때만 `radix-ui` 를 넣는다
- **Radix 를 썼다는 이유만으로 접근성 완료로 판단하지 않는다.** 조합된 화면을 직접 검증한다
- RevealText 로 분리한 span 은 `aria-hidden`, 원문은 스크린리더에 한 번만 읽힌다
- Marquee 복제 콘텐츠는 `aria-hidden`
- 대비비는 `data-surface` 양쪽에서 각각 검증한다. 거대 타이포는 대비가 낮아도 읽히는 것처럼 보여 실수하기 쉽다
- horizontal rail 은 키보드로 스크롤 가능해야 하고 접근 가능한 이름을 갖는다
- Work Index 는 hover 로만 노출되는 정보가 없어야 한다 — 키보드와 모바일에서 같은 정보에 닿아야 한다
- heading 계층, landmark, focus-visible, alt, link 와 button 의 의미 구분

## 10. 하지 않는 것

**컴포넌트** — Magnetic, CursorPreview, CursorFollower, CustomCursor

**패키지** — GSAP, `@gsap/react`, Lenis, motion/framer-motion, CVA(2단계에서 보류, variant 복잡도 확인 후 재검토), `@storybook/addon-viewport`(코어 내장)

**구조** — 전체 FSD 폴더 재설계, 전역 `data/` 디렉터리, `utils.ts`·`helpers.ts`·`common.ts`, `pointer.ts`, 커스텀 토큰 린트 룰, 사용자 테마 토글, scroll pinning, 의미 없는 preloader, 임시 placeholder 콘텐츠

**범위** — 블로그 화면, 어드민 화면. `app/api/**` 와 인증 계층은 손대지 않는다

## 11. 단계에서 결정할 것

지금 확정하지 않고 해당 단계의 실측으로 정한다.

| 항목 | 결정 시점 | 판단 기준 |
| --- | --- | --- |
| Tailwind duration 유틸리티 방식 | 2단계 | 임의값 변수 문법 vs `@utility` — 실제 생성 결과 확인 |
| `shared/styles` 에 대한 Steiger 반응 | 2단계 | CSS 만 든 세그먼트에 public-api 룰이 걸리는지 |
| display font 별도 도입 | 2단계 확인 후 | Pretendard 한 벌로 hero 급 대비가 나오는지 |
| `@storybook/addon-vitest` | 3단계 | play function 만으로 부족한지 |
| CVA | 3단계 | Button·ShowcaseButton 의 실제 variant 복잡도 |
| Work Index 표현 방식 4안 중 택1 | 5단계 | 실제 프로젝트 제목 길이와 이미지 비율 |
| Radix 도입 | 5단계 | 네이티브 `<dialog>` 로 모바일 메뉴가 되는지 |
| `next.config.ts` images 설정 | 4단계 | 원격 이미지 소스를 쓰는지 |

## 12. 알려진 위험

**미디어 에셋 부재** — 저장소에 `public/images/logo.png` 하나뿐이다. 3단계 Media 컴포넌트의 video·poster·모바일 fallback 과 5단계 Gallery rail 이 실제 에셋을 요구한다. 4단계에서 확보하지 못하면 마스크·스케일 튜닝을 나중에 다시 해야 한다.

**Prettier `singleAttributePerLine` × 긴 Tailwind 클래스** — printWidth 80 을 넘는 클래스 문자열을 포매터가 쪼개지 못한다. Prettier 설정을 바꾸지 않고 컴포넌트 추출로 푼다.

**dev(Turbopack) 와 build(`--webpack`) 이중 파이프라인** — Tailwind PostCSS 가 양쪽에서 도는지 2단계에서 둘 다 확인한다.

**`HomePage.test.tsx` 의 "section 0개" 계약** — 5단계에서 반드시 깨진다. 이를 RED 로 쓴다.
