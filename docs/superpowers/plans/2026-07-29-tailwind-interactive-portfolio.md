# Tailwind 인터랙티브 포트폴리오 구현 플랜

작성일: 2026-07-29
설계: [2026-07-29-tailwind-interactive-portfolio-design.md](../specs/2026-07-29-tailwind-interactive-portfolio-design.md)

## 사용법

**단계당 세션 하나**로 끊는다. 구현 세션은 파일 읽기와 실패한 시도로 컨텍스트가 금방 지저분해지는데, 그 찌꺼기를 다음 단계로 끌고 갈 이유가 없다. 새 세션은 설계 문서와 이 플랜만 읽고 시작한다.

각 단계를 마치면 커밋하고 **이 문서의 해당 섹션을 갱신한다** — 계획과 달랐던 것, 바뀐 결정, 다음 단계에 넘길 주의사항.

**3단계 이후는 잠정이다.** 앞 단계 실측(Steiger 가 `shared/styles` 를 어떻게 보는지, `next/font` 가 Storybook 에서 실제로 도는지 등)에 따라 바뀔 수 있다. 확정처럼 읽고 잘못된 방향을 밀어붙이지 않는다.

## 진행 상태

| 단계 | 상태 | 커밋 |
| --- | --- | --- |
| 1. 조사와 계획 | 완료 | — |
| 2. Foundation + Storybook | 미착수 | |
| 3. 공통 UI 와 Effect | 미착수 (잠정) | |
| 4. 실제 콘텐츠 입력 | 미착수 (잠정) | |
| 5. 홈 페이지 조립 | 미착수 (잠정) | |
| 6. 시각·성능 조정 | 미착수 (잠정) | |

## 공통 규칙

`docs/conventions/` 의 TDD·주석·폴더 구조 컨벤션을 따른다. 스타일 수치 조정은 TDD 예외(1절)라 테스트를 먼저 쓰지 않지만, 계약(props 전달·조립·접근성 배선·텍스트 분리 로직)은 RED 부터 간다.

단계 종료 검증:

```sh
npm run fsd && npm run lint && npm run type-check && npm run test && npm run build
```

Storybook 이 있는 단계부터는 `npm run build-storybook` 을 추가한다. 출력을 잘라 보지 말고 exit code 로 판정한다.

---

## 2단계 — Foundation 과 Storybook

### 범위

Tailwind 배선, 토큰 4계층, 전역 base, 폰트, `cn`, motion preset, Storybook 기반, Foundation story, 규칙 문서. **페이지 섹션과 프로젝트 UI 는 만들지 않는다.**

### 산출물

설정 변경:

```
postcss.config.mjs        @tailwindcss/postcss 등록
app/layout.tsx            global.css import, 폰트 variable, body 골격
steiger.config.ts         ignores 에 **/*.stories.*
eslint.config.mjs         **/*.tsx 블록 ignores 에 **/*.stories.*
prettier.config.js        prettier-plugin-tailwindcss 등록
package.json              의존성 + storybook / build-storybook 스크립트
```

신규:

```
src/shared/styles/index.ts                        폰트 객체 공개
src/shared/styles/global.css                      진입점 + @layer base + 섹션 반전
src/shared/styles/tokens.css                      primitive / semantic / typo / layout / layer
src/shared/styles/motion.css                      motion 토큰 + keyframes + reduced-motion 가드
src/shared/styles/fonts.ts                        next/font/local 로더
src/shared/styles/fonts/PretendardVariable.woff2
src/shared/lib/cn.ts                              clsx + tailwind-merge
src/shared/lib/motionPreset.ts                    viewport 기본값 + stagger 규칙
.storybook/main.ts
.storybook/preview.ts
src/shared/styles/Foundation.stories.tsx          토큰 전시 (CSS 변수를 실제로 읽음)
docs/conventions/style-foundation.md              토큰·Tailwind 작성 규칙
```

### 패키지

dependencies — `tailwindcss@^4.3.3`, `@tailwindcss/postcss@^4.3.3`, `clsx@^2.1.1`, `tailwind-merge@^3.6.0`

devDependencies — `storybook@^10.5.5`, `@storybook/nextjs-vite@^10.5.5`, `@storybook/addon-a11y@^10.5.5`, `@storybook/addon-docs@^10.5.5`, `@storybook/addon-themes@^10.5.5`, `prettier-plugin-tailwindcss`

CVA 는 설치하지 않는다. 3단계에서 실제 variant 복잡도를 본 뒤 판단한다.

### 순서와 검증

1. Tailwind 배선 → dev(Turbopack)와 `build --webpack` **양쪽**에서 유틸리티가 나오는지
2. 토큰 4계층 + 섹션 반전 → `[data-surface='light']` 에서 `bg-surface` 가 실제로 뒤집히는지
3. 폰트 + fluid 스케일 → 320px 와 1920px 에서 `clamp()` 가 의도대로 움직이는지
4. `cn` + motion preset → type-check
5. Storybook 기동 → 앱과 **같은** `global.css` 를 쓰는지, 폰트가 실제로 적용되는지
6. Foundation story → 토큰 값이 하드코딩이 아니라 CSS 변수에서 오는지
7. 규칙 문서

### 실측할 것

설계 11절 항목 중 이 단계 몫이다. 결과를 이 문서에 기록한다.

- **생성된 CSS 에서 `.bg-surface` 가 `var(--color-surface)` 를 참조하는지** — `var(--ds-neutral-…)` 가 박혀 있으면 `inline` 이 섞인 것이고 섹션 반전이 죽는다 (설계 4.1)
- Tailwind duration 유틸리티: 임의값 변수 문법 vs `@utility` — 어느 쪽이 실제로 되는지
- `shared/styles` 에 대한 Steiger 반응: CSS 만 든 세그먼트에 public-api 룰이 걸리는지
- `@storybook/nextjs-vite` 의 `next/font` 처리: 데코레이터 CSS 변수 주입이 필요한지

### 이 단계 종료 후 사람이 볼 것

Storybook 을 직접 열어 확인한다. **여기서 마음에 들지 않으면 3단계로 넘어가기 전에 토큰을 고친다.**

- 배경색·전경색의 분위기
- accent 가 과하거나 흔하지 않은지
- Hero 글자 크기가 지나치지 않은지
- **한글에서 display 역할이 자연스러운지** — 별도 display 서체 도입 여부를 여기서 결정
- spacing 이 과하거나 부족하지 않은지
- dark 섹션 대비가 충분한지

---

## 3단계 — 공통 UI 와 Effect (잠정)

### 범위

UI 5종 + Effect 5종을 Storybook 안에서 완성한다. **홈 페이지를 조립하지 않는다.**

```
UI      Container  Button  ShowcaseButton  Media  SectionHeading
Effect  MaskReveal  RevealText  Parallax  Marquee  MediaReveal
```

전부 `src/shared/ui/{Name}/` 아래 `{Name}.tsx` + `{Name}.test.tsx` + `{Name}.stories.tsx`. per-component `index.ts` 는 두지 않고 `shared/ui/index.ts` 하나가 직접 re-export 한다.

`useInView` 훅은 `src/shared/lib/useInView.ts` (화살표 함수 — `lib/**` 가 `func-style: expression`).

### 구현 경계 (설계 7.1)

```
CSS scroll-driven      Parallax  Marquee
IntersectionObserver   MaskReveal(once)  RevealText  MediaReveal(enter/exit)
```

MaskReveal 의 once 옵션이 CSS 로 불가능한 것이 이 분할의 근거다. view timeline 은 스크롤을 되감으면 같이 되감긴다.

### 컴포넌트별 주의

**ShowcaseButton** — magnetic 금지. overflow hidden + 내부 fill layer 이동 + 텍스트 미세 translate + active scale + focus-visible + reduced-motion.

**Button** — 링크 역할과 버튼 역할을 타입으로 구분한다. `<a>` 와 `<button>` 을 섞지 않는다.

**RevealText** — line / word / character 3단위. 분리한 span 은 `aria-hidden`, 원문은 스크린리더에 한 번만. **한글 줄바꿈**과 long text 를 스토리로 반드시 확인한다. character 모드는 짧은 문구 전용임을 컴포넌트 문서에 명시.

**Parallax** — subtle / normal / strong. 본문 텍스트에는 subtle 만 허용. 빈 영역이 드러나지 않게 오버스캔.

**Marquee** — 끊김 없는 반복, 복제 콘텐츠 `aria-hidden`, direction / speed / pause. Storybook 에서 정지 가능해야 한다.

**MediaReveal** — scale + mask 등장, viewport reveal 과 hover reveal, enter/exit 분리, image·video. **transform ownership 을 컴포넌트 헤더에 명시한다.**

**Media** — image / video / poster / aspect ratio / object-fit / eager·lazy / responsive sizes / muted autoplay loop / 모바일 fallback.

### 스토리 축

컴포넌트마다 필요한 범위에서: Default · Variants · Long content · Narrow container · Dark background · Mobile · Tablet · Desktop · Reduced motion · Keyboard · Disabled/static.

픽스처는 스토리 안 인라인. 운영 데이터와 섞지 않는다.

### 검증

type-check · lint · Storybook build · component test · a11y addon 결과.

### 이 단계 종료 후 사람이 볼 것

Storybook 에서 모션 수치를 조정한다. Button 과 ShowcaseButton 의 조화, reveal 속도, 글자 등장의 자연스러움, parallax 가 어지럽지 않은지, marquee 속도, MediaReveal 의 이미지별 안정성, 모바일 스토리의 실사용성.

---

## 4단계 — 실제 콘텐츠 입력 (잠정)

### 선행 조건

사람이 콘텐츠를 준비해야 한다. 최소한 **프로젝트 제목·개수·대표 이미지 비율**이라도 먼저 필요하다.

이미지가 아직 없으면 비율만 먼저 확정한다: Hero media 16:10 · Project thumbnail 4:3 · Gallery media 3:2 또는 16:9.

### 범위

데이터 구조 · 타입 · public API · 픽스처만. **섹션을 조립하지 않는다.**

### 산출물

```
src/shared/config/site.ts          사이트명·영문명·직무·한 줄 소개·소셜 링크 확장
src/entities/project/              신규 — index.ts, model/project.types.ts, model/projects.ts
src/pages/home/config/             Hero 문구, Introduction 콘텐츠, CTA
src/widgets/site-navigation/       신규 — index.ts, config/navItems.ts
src/entities/profile/              해체 — 삭제
```

**슬라이스를 만들면 같은 단계에서 `index.ts` 도 만든다.** `fsd/public-api` 는 켜져 있어서, 세그먼트만 있고 슬라이스 public API 가 없으면 이 단계 종료 검증의 `npm run fsd` 가 5단계로 넘어가기 전에 실패한다. `entities/project` 와 `widgets/site-navigation` 둘 다 해당한다.

`entities/profile` 해체는 설계 6절 참고. 데이터를 잃는 게 아니라 4단계 소유권 규칙에 맞게 재배치하는 것이다.

### 타입 규칙

실제로 들어온 필드만 정의한다. "나중에 쓸지도 모르는" 필드를 만들지 않는다. 미디어는 alt · aspect ratio · responsive sizes · Hero 외 lazy · video poster · 모바일 fallback 을 타입에 반영한다.

### 실측할 것

- 원격 이미지 소스를 쓰는가 → `next.config.ts` 의 `images` 설정 필요 여부

---

## 5단계 — 홈 페이지 조립 (잠정)

### 범위

```
Navigation  Hero  Introduction  Work Index  Gallery  Contact
```

각 섹션의 layer·slice 는 프로젝트 컨벤션을 근거로 결정한다. Navigation 은 `widgets/site-navigation`, 나머지 섹션은 `pages/home/ui/{Section}/`.

### 섹션별 주의

**Navigation** — 데스크톱·모바일 분기, hover dot 또는 mask text transition, focus-visible. 모바일 메뉴는 **네이티브 `<dialog>` 로 먼저 시도**하고 부족할 때만 `radix-ui` 를 넣는다. fixed / sticky 선택 이유를 코드 주석에 남긴다.

**Hero** — `min-h-svh`(= `min-height: 100svh`. `min-h-100svh` 는 존재하지 않는 클래스라 조용히 무시된다), full-bleed media, oversized fluid title(marquee 가능). 등장 순서는 media → supporting text → title. 모바일은 모션 단순화. **preloader 금지.**

**Introduction** — 데스크톱 비대칭 grid, 모바일 single column. statement 는 RevealText, supporting copy 는 약한 fade 또는 MaskReveal. ShowcaseButton 포함.

**Work Index** — 커서 추적 preview 금지. 4안(행 내부 thumbnail / 고정 preview / 텍스트 중심 / hover 행 내부 확대) 중 실제 콘텐츠에 맞는 것을 고른다. 판단 기준은 키보드 접근성, 모바일 정보 손실 없음, 제목 길이와 이미지 비율. 레퍼런스를 그대로 복제하지 않는다. 데이터는 `entities/project` public API 로 주입.

**Gallery** — 2개 이상 rail, 반대 방향, 세로 scroll progress → x transform, viewport 보다 넓게, overflow hidden. **scroll pinning 금지, 세로 스크롤 가로채기 금지.** reduced-motion 에서는 정적 grid.

**Contact** — surface inverse, 대형 문구, ShowcaseButton 또는 명확한 이메일 링크, social links, footer landmark. 약한 parallax 가능, magnetic 금지.

### 공통 금지

새 arbitrary color · 섹션 안에서 기존 Effect 재구현 · 한 요소에 복수 transform owner · 모바일 hover 의존 · 임시 placeholder.

### 검증

`HomePage.test.tsx` 재작성부터 시작한다 — 현재 "section 0개" 계약이 여기서 깨진다. 그 뒤 type-check · lint · Storybook build · application build · 키보드 확인 · a11y addon · responsive.

섹션마다 스토리: Desktop · Tablet · Mobile · Reduced motion · Long content · surface 양쪽.

---

## 6단계 — 시각 완성도와 성능 (잠정)

### 선행 조건

사람이 실제 화면을 보고 피드백을 준다. 이 단계는 피드백 없이 시작하지 않는다.

### 점검 축

**Visual** — typography 계층, 실제 콘텐츠 줄바꿈, 섹션 간 리듬, 비대칭 균형, light/inverse 대비, 이미지 crop, 강조 과잉.

**Motion** — reveal duration, stagger, parallax 거리, marquee 속도, media scale, 모바일 강도, reduced-motion, 동시 이동 요소 수. **한 섹션에서 강한 effect 는 최대 1~2개.**

**Responsive** — 375 / 430 / 768 / 1024 / 1440px 직접 확인. horizontal overflow, title clipping, 한글 줄바꿈, touch target, media crop, spacing, navigation.

**Accessibility** — heading 계층, landmark, 키보드, focus-visible, link/button 의미, alt, 대비, reduced-motion, Storybook a11y. Radix 사용 여부와 무관하게 **조합된 화면**을 검증한다.

**Performance** — transform/opacity 중심 여부, scroll 이벤트 중복, viewport 밖 애니메이션, image priority, lazy loading, responsive sizes, video loading, layout shift, `will-change` 남용, transform ownership, 불필요한 client component. 가능하면 Lighthouse.

### 문서

실제 구현과 달라진 설계 결정을 spec 문서에 반영한다. **Storybook 이 이미 설명하는 props·variant 를 마크다운에 중복하지 않는다.**
