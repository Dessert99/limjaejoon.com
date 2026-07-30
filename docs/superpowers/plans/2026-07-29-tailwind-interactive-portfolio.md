# Tailwind 인터랙티브 포트폴리오 구현 플랜

작성일: 2026-07-29 설계: [2026-07-29-tailwind-interactive-portfolio-design.md](../specs/2026-07-29-tailwind-interactive-portfolio-design.md)

## 사용법

**단계당 세션 하나**로 끊는다. 구현 세션은 파일 읽기와 실패한 시도로 컨텍스트가 금방 지저분해지는데, 그 찌꺼기를 다음 단계로 끌고 갈 이유가 없다. 새 세션은 설계 문서와 이 플랜만 읽고 시작한다.

각 단계를 마치면 커밋하고 **이 문서의 해당 섹션을 갱신한다** — 계획과 달랐던 것, 바뀐 결정, 다음 단계에 넘길 주의사항.

**4단계 이후는 잠정이다.** 앞 단계 실측에 따라 바뀔 수 있다. 확정처럼 읽고 잘못된 방향을 밀어붙이지 않는다. 3단계는 2단계 종료 검토에서 결정을 확정했다(해당 섹션의 결정표 참고).

## 진행 상태

| 단계 | 상태 | 커밋 |
| --- | --- | --- |
| 1. 조사와 계획 | 완료 | — |
| 2. Foundation + Storybook | 완료 (사람 확인 대기) | `2846a95`…`e8bf14c` (6커밋) |
| 3. 공통 UI 와 Effect | 완료 (사람 확인 대기) |  |
| 4. 실제 콘텐츠 입력 | 미착수 (잠정) + Media·MediaReveal |  |
| 5. 홈 페이지 조립 | 미착수 (잠정) |  |
| 6. 시각·성능 조정 | 미착수 (잠정) |  |

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

### 실측 결과

**`.bg-surface` — 통과.** webpack 빌드와 Turbopack dev 양쪽에서 같다.

```css
.bg-surface{background-color:var(--color-surface)}
[data-surface=light]{--color-surface:var(--ds-neutral-50); …}
```

semantic 이름을 참조하고, 반전 블록은 `@layer` 밖이라 `@layer theme` 의 `:root` 를 이긴다. `inline` 은 섞이지 않았다.

**추가로 드러난 것 — `@theme` 은 기본이 "쓰인 변수만" 방출이다.** 소비자가 없는 2단계에서는 semantic 이 `:root` 에서 통째로 사라져 반전이 반쪽이 된다. Tailwind 기본 팔레트의 `--font-sans` 가 실제로 그렇게 잘려나간 것으로 확인했다. `@theme static` 으로 고정했다.

**duration — 둘 다 된다. `@utility` 로 확정.**

```css
.duration-\(--ds-duration-800\) {
  --tw-duration: var(--ds-duration-800);
}
.duration-\(--ds-duration-800\),
.duration-slow {
  transition-duration: var(--ds-duration-800);
}
```

임의값 문법은 JSX 에 `--ds-*` 를 노출해 설계 4.5(primitive 직접 사용 금지)와 충돌한다. z 계층만 예외로 둔 설계 의도에 맞춰 명명 유틸리티를 택했다. 다만 내장 `duration-*` 은 `transition-duration` 과 `--tw-duration` 을 **함께** 채우므로 `@utility` 도 똑같이 둘 다 채워야 한다 — `transition` 유틸리티가 후자를 읽어서, 안 채우면 `hover:transition` 류 변형에 되밀린다. Tailwind IntelliSense 도 `duration-(--ds-duration-800)` 을 `duration-slow` 로 고치라고 제안했다.

**Steiger — CSS 만 든 세그먼트는 걸린다.** `src/shared/probeseg/only.css` 하나만 둔 세그먼트를 만들어 확인했다.

```
┌ src/shared/probeseg
✘ This segment is missing a public API.
└ fsd/public-api
```

`shared/styles` 는 `fonts.ts`·`index.ts` 가 있어 통과한다. CSS 파일이 `index.ts` 에서 re-export 되지 않는 것은 문제 삼지 않는다.

**`next/font` — 프레임워크가 처리한다. 단, `<html>` 배선은 우리 몫.** `@storybook/nextjs-vite` 가 `@font-face` 와 `.__variable_…` 클래스를 런타임에 `document.head` 로 주입하고 woff2 를 에셋으로 뽑는다(`storybook-static/assets/PretendardStdVariable-*.woff2`). 즉 `@font-face` 를 손으로 쓸 필요는 없다. 하지만 variable 클래스를 루트에 거는 일은 아무도 안 해주므로 `preview.ts` 가 `document.documentElement.classList.add(pretendard.variable)` 를 직접 한다. `--font-body` 는 `:root` 에서 선언되어 그 자리에서 해석되므로 하위 엘리먼트에 걸면 소용없다.

**dev/build 이중 파이프라인 — 양쪽 동일.** Turbopack dev(`/_next/static/chunks/src_shared_styles_*.css`)와 `next build --webpack` 산출물에서 `bg-surface`·`px-gutter`·`max-w-content`·`text-hero`·`ease-reveal`·`duration-slow`·`rounded-md` 가 모두 같은 선언으로 나왔다. Storybook(Vite) 도 루트 `postcss.config.mjs` 를 그대로 집어 같은 결과가 나온다.

**clamp 산식** — 320px~1920px 선형. 양 끝에서 min/max 와 정확히 일치하도록 잡았다(예: hero `1.8rem + 8.5vw` 는 320px 에서 56px=3.5rem, 1920px 에서 192px=12rem). 실제 화면에서의 인상은 아래 "사람이 볼 것" 에서 판단한다.

### 계획과 달랐던 것

- **폰트 파일이 `PretendardStdVariable.woff2` 다.** 전체 웨이트는 2,057,688 바이트인데 `next/font/local` 이 루트 레이아웃에서 preload 해 404 페이지까지 2MB 를 렌더 크리티컬 경로로 끌고 온다. Std(KS X 1001 2350자)는 291,680 바이트에 같은 45~920 wght 축이다. **KS X 1001 밖 희귀 음절은 시스템 폰트로 떨어진다** — 콘텐츠 입력(4단계) 때 이상한 글자가 보이면 이게 원인이다.
- **`@theme static` 과 `--color-*: initial`.** 앞은 위 실측 때문이고, 뒤는 `bg-red-500` 같은 비토큰 색이 애초에 생성되지 않게 하는 유일한 강제 수단이다(설계 4.5 는 린트 룰을 만들지 말라고 했으므로 테마 쪽에서 막았다). `--font-*`·`--radius-*`·`--container-*` 는 초기화하지 않았다 — preflight 가 `--font-sans`·`--font-mono` 를 경유해 기본 서체를 잡아서, 지우면 되살리는 코드가 더 늘어난다.
- **`--breakpoint-*` 를 명시했다.** 값은 Tailwind 기본과 같다. Storybook 뷰포트 목록이 참조할 단일 출처가 필요했다.
- **`@source` 를 명시 목록으로 고정했다.** 자동 스캔은 CWD 전체를 훑어 `docs/`·`.claude/` 의 산문까지 클래스 후보로 삼는다.
- **`cn` 에 tailwind-merge 레지스트리가 붙었다.** 기본 스케일이 t-shirt size·숫자뿐이라 우리 토큰 이름을 전부 색으로 오분류한다 — `cn('text-hero', 'text-muted')` 가 `text-hero` 를 조용히 버렸다. 토큰 이름을 늘리면 `cn.ts` 도 같이 늘려야 한다.
- **`eslint.config.mjs` 에 `storybook-static/**`ignore,`tsconfig.json`에`.storybook/**/\*.ts` include 를 추가했다.** 앞은 빌드 산출물에서 ESLint 포매터가 터져서, 뒤는 TypeScript 가 점(.)으로 시작하는 디렉터리를 와일드카드 include 에서 빼기 때문에 `.storybook` 이 타입 검사에서 통째로 빠져 있어서다.
- **`motion.css` 에 keyframes 는 넣지 않았다.** marquee 등 소비자가 3단계에 들어온다. 지금 넣으면 쓰이지 않는 추측성 코드가 된다.
- **controlled bleed `@utility` 도 3단계로 미뤘다.** 설계 4.3 이 방식만 정했고, Container 없이 검증할 방법이 없다.
- **semantic 역할은 14종이다.** 설계 4.2 는 "15종" 이라 적었지만 표에 실린 역할은 14개다. 표를 출처로 삼았다.
- **`[data-surface='dark']` 규칙은 만들지 않았다.** 루트가 이미 다크라 값이 중복된다. 대신 Colors 스토리를 `globals: { theme: 'dark' }` 로 고정했다 — 툴바가 light 면 "dark 칸" 도 `<html>` 의 light 를 상속해 두 칸이 같아지기 때문이다. 3단계에서 결정할 항목으로 넘긴다.

### 이 단계 종료 후 사람이 볼 것

`npm run storybook` → `Foundation/Tokens` 의 Colors · Typography · Layout · Motion · Layers. 툴바에 `data-surface`(dark/light)와 Motion(full/reduced) 토글이 있다. **여기서 마음에 들지 않으면 3단계로 넘어가기 전에 토큰을 고친다.**

- 배경색·전경색의 분위기
- accent 가 과하거나 흔하지 않은지
- Hero 글자 크기가 지나치지 않은지
- **한글에서 display 역할이 자연스러운지** — 별도 display 서체 도입 여부를 여기서 결정
- spacing 이 과하거나 부족하지 않은지
- dark 섹션 대비가 충분한지

---

## 3단계 — 공통 UI 와 Effect

### 착수 전 확정된 결정 (2026-07-30)

2단계 종료 검토에서 정했다. 이 단계에서 다시 논의하지 않는다.

| 항목 | 결정 | 근거 |
| --- | --- | --- |
| Media · MediaReveal | **이 단계에서 뺀다.** 4단계 에셋 확보 후로 옮김 | 실제 이미지 없이는 마스크 타이밍·스케일 배율을 맞출 대상이 없어 4단계에 전부 다시 잡게 된다 |
| CVA | **설치하지 않고 시작.** Button·ShowcaseButton 을 만든 뒤 variant 표가 3×3 을 넘으면 그때 도입 | 지금 그림은 `2×2` 수준이라 의존성과 "클래스 문자열이 사는 두 번째 장소"만 늘어난다 |
| `--font-display` | **`var(--font-body)` 별칭 유지.** 6단계 시각 조정에서 재검토 | 토큰 검토 통과. 한글 display 서체는 무겁고, 방금 폰트 preload 를 2MB→285KB 로 줄인 방향과 반대다. 라틴만 교체하는 절충안이 남아 있다 |
| `[data-surface='dark']` | **CSS 규칙을 만들지 않는다.** "Dark background" 스토리는 story-level `globals: { theme: 'dark' }` 로 고정 | Contact 는 `bg-surface-inverse` 로 풀 예정이라 밝은 섹션 안에 어두운 블록이 중첩될 일이 없다. 5단계에서 실제로 필요해지면 그때 14줄을 추가한다(뒤늦게 넣어도 비용이 같다) |
| `@storybook/addon-vitest` | **이 단계 말미에 판단.** 8개 컴포넌트가 다 선 뒤 | 설계 성공 기준 "a11y violation 0" 은 지금 자동 강제가 없다 — `preview.ts` 의 `a11y: { test: 'error' }` 는 이 addon 이 있을 때만 작동한다. 아래 "a11y 자동 강제" 참고 |

### 범위

UI 4종 + Effect 4종을 Storybook 안에서 완성한다. **홈 페이지를 조립하지 않는다.**

```
UI      Container  Button  ShowcaseButton  SectionHeading
Effect  MaskReveal  RevealText  Parallax  Marquee
```

전부 `src/shared/ui/{Name}/` 아래 `{Name}.tsx` + `{Name}.test.tsx` + `{Name}.stories.tsx`. per-component `index.ts` 는 두지 않고 `shared/ui/index.ts` 하나가 직접 re-export 한다.

이 8개는 텍스트·도형만으로 완결되어 미디어 에셋에 의존하지 않는다. Media·MediaReveal 은 4단계 뒤로 옮겼다(위 결정표).

`useInView` 훅은 `src/shared/lib/useInView.ts` (화살표 함수 — `lib/**` 가 `func-style: expression`).

### 구현 경계 (설계 7.1)

```
CSS scroll-driven      Parallax  Marquee
IntersectionObserver   MaskReveal(once)  RevealText
```

MaskReveal 의 once 옵션이 CSS 로 불가능한 것이 이 분할의 근거다. view timeline 은 스크롤을 되감으면 같이 되감긴다.

MediaReveal(enter/exit) 도 IntersectionObserver 쪽이지만 이 단계 범위 밖이다.

### 컴포넌트별 주의

**ShowcaseButton** — magnetic 금지. overflow hidden + 내부 fill layer 이동 + 텍스트 미세 translate + active scale + focus-visible + reduced-motion.

**Button** — 링크 역할과 버튼 역할을 타입으로 구분한다. `<a>` 와 `<button>` 을 섞지 않는다.

**RevealText** — line / word / character 3단위. 분리한 span 은 `aria-hidden`, 원문은 스크린리더에 한 번만. **한글 줄바꿈**과 long text 를 스토리로 반드시 확인한다. character 모드는 짧은 문구 전용임을 컴포넌트 문서에 명시.

**Parallax** — subtle / normal / strong. 본문 텍스트에는 subtle 만 허용. 빈 영역이 드러나지 않게 오버스캔.

**Marquee** — 끊김 없는 반복, 복제 콘텐츠 `aria-hidden`, direction / speed / pause. Storybook 에서 정지 가능해야 한다.

### 스토리 축

컴포넌트마다 필요한 범위에서: Default · Variants · Long content · Narrow container · Dark background · Mobile · Tablet · Desktop · Reduced motion · Keyboard · Disabled/static.

"Dark background" 축은 story-level `globals: { theme: 'dark' }` 로 루트를 고정한다. 스코프 없는 블록은 `<html>` 의 `data-surface` 를 상속하므로, 툴바가 light 인 채로는 어두운 배경을 보여줄 수 없다.

픽스처는 스토리 안 인라인. 운영 데이터와 섞지 않는다.

### a11y 자동 강제

지금은 사람이 Storybook 을 열어 a11y 패널을 봐야만 위반이 드러난다. 단위 테스트(RTL)로는 `aria-hidden`·라벨·키보드 배선까지 잡히지만 **대비비는 렌더가 필요해 jsdom 에서 불가능하다.** 설계 9절이 "거대 타이포는 대비가 낮아도 읽히는 것처럼 보여 실수하기 쉽다" 고 경고한 지점이 자동 검사에서 비어 있다.

이 단계 말미에 `@storybook/addon-vitest` 도입을 판단한다. 얻는 것은 `npm run ci` 안에서 도는 axe 검사와 play function 이고, 내는 비용은 Playwright 브라우저 바이너리(수백 MB)다. 도입하지 않기로 하면 **대비비를 손으로 검증하는 절차를 6단계 점검 축에 못 박아둔다** — 자동 검사가 없다는 사실을 조용히 넘기지 않는다.

### 검증

type-check · lint · Storybook build · component test · a11y addon 결과.

### 실측 결과

**`@utility` 안에 `@supports` 가 중첩된다.** Parallax 가 이걸 필요로 했다.

```css
@supports (animation-timeline: view()) {
  .parallax {
    animation: linear both parallax-shift;
    animation-timeline: view();
    animation-range: cover;
  }
}
```

가두지 않으면 미지원 브라우저에서 `animation` 이 문서 타임라인 위에서 0초로 끝나고 `fill: both` 가 끝 상태를 굳힌다 — 콘텐츠가 영구히 밀린 자리에 선다.

**2단계 감쇠 가드에 같은 함정이 있었다.** `animation-duration: 1ms` + `fill: both` 도 끝 상태를 굳힌다. Parallax 가 감쇠에서 밀린 채 멈춘다. `animation-name: none !important` 로 바꿨다(transition 은 그대로 1ms — reveal 이 transition 기반이라 끄면 상태 전환 자체가 사라진다).

**`translate-*`·`scale-*` 은 Tailwind v4 에서 개별 프로퍼티다.** 설계 7.3 의 "축약형 대신 개별 프로퍼티로 소유권을 쪼갠다" 가 유틸리티만으로 성립한다.

```css
.active\:scale-98:active{--tw-scale-x:98%;…;scale:var(--tw-scale-x) var(--tw-scale-y)}
.translate-y-full{--tw-translate-y:100%;translate:var(--tw-translate-x) var(--tw-translate-y)}
```

**`@storybook/addon-vitest` — 도입하지 않는다.** 얻는 것(자동 axe)보다 내는 것(Playwright 브라우저 바이너리, 로컬 `npm run ci` 시간)이 크다. 지금 대상은 텍스트·도형뿐인 8개 컴포넌트라 사람이 a11y 패널로 몇 분이면 훑는다. **5단계에서 다시 판단한다** — Navigation·Work Index 처럼 조합된 화면이 들어오면 axe 가 사람보다 낫다. 그때까지 `preview.ts` 의 `a11y: { test: 'error' }` 는 작동하지 않는 선언이며, 대비비 수동 검증을 6단계 점검 축에 못 박아 둔다(아래).

### 계획과 달랐던 것

- **`useInView` 는 마운트에서 은닉하지 않는다.** 관찰자의 최초 보고가 `out`/`in` 을 정한다. React Compiler 룰(`react-hooks/set-state-in-effect`)이 effect 본문의 setState 를 막은 게 계기였는데, 결과가 더 낫다 — **이미 화면에 보이던 요소는 `out` 을 거치지 않아 hydration 직후 튀지 않는다.** 대신 두 가지가 따라온다. **로드 시점 등장 애니메이션(Hero)은 이 훅으로 안 된다** — 5단계에서 별도로 판단한다. 그리고 **스토리에 스크롤 무대가 필요하다** — 캔버스 안에서 시작하면 관찰자가 곧장 `in` 으로 보고하고 `once` 가 관찰을 끊어, 스크롤해도 영원히 아무 일도 일어나지 않는다. 처음엔 `py-section` 여백만 뒀다가 아무것도 안 보여서 두 번 고쳤다(§ 아래 "스크롤 무대").
- **`IN_VIEW_DEFAULTS.threshold` 를 0.15 → 0 으로 낮췄다.** 최초 보고는 threshold 와 무관하게 오므로 `isIntersecting` 만 믿으면 1% 만 걸쳐도 등장이 끝난다. `intersectionRatio >= threshold` 로 고쳤는데, 그러면 **뷰포트보다 큰 요소는 비율이 임계치에 영원히 못 닿아** 등장 자체가 사라진다. 지연은 `rootMargin` 한 곳으로 몰았다.
- **`Media`·`MediaReveal` 은 4단계로 이미 옮겨져 있었다**(착수 전 결정표). 이 단계는 8개로 끝났다.
- **`bleed-gutter` 는 viewport bleed 가 아니다.** `100vw` 계열은 스크롤바 폭을 세어 설계 성공 기준의 "horizontal overflow 없음" 을 정면으로 깬다. Container 의 gutter 만 되짚는다.
- **`mask-track` `@utility` 를 새로 만들었다.** `overflow: hidden` 이 디센더를 자른다. 은닉 이동도 `100%` 가 아니라 `calc(100% + var(--mask-overhang))` 이어야 한다.
- **`MaskReveal`·`RevealText` 는 `ref` 를 열지 않는다.** `{...rest}` 가 관찰자 ref 를 덮으면 등장이 에러 없이 영원히 `idle` 로 죽는다.
- **`<button>` 의 `type` 은 `{...rest}` 뒤에 둔다.** `type={undefined}` 가 흘러들면 속성이 지워져 form 안에서 `submit` 이 되살아난다. Codex 가 잡았고 Node 로 재현했다.
- **RevealText 의 character 는 `Intl.Segmenter` 로 자른다.** `Array.from` 은 코드 포인트 단위라 결합 악센트·ZWJ 이모지가 조각마다 흩어진다.
- **판별 union props 는 Storybook args 로 못 쓴다.** Args 추론이 union 을 교집합으로 접어 `never` 가 된다. Button·ShowcaseButton 스토리는 `href` 를 뺀 평평한 타입으로 `satisfies Meta<...>` 를 쓰고, 링크 역할은 `render` 로 직접 그린다.
- **CVA 는 결국 필요 없었다.** Button 이 2×2, ShowcaseButton 은 variant 자체가 없다. 매핑 객체 두 개로 끝났다.
- **`vitest.setup.ts` 에 IntersectionObserver 무동작 스텁을 깔았다.** jsdom 에 없어서 마운트가 터진다. 교차를 제어해야 하는 `useInView.test.ts` 만 `vi.stubGlobal` 로 덮는다.
- **Parallax 의 애니메이션은 `@utility` 가 아니라 레이어 밖 `[data-parallax]` 가 소유한다.** `@utility` 도 `@layer utilities` 안이라, 소비자가 `animate-spin` 하나만 얹어도 뒤에 생성된 축약형이 `animation-timeline` 을 `auto` 로 되돌려 parallax 가 조용히 사라진다. `marquee-track` 은 소비자 `className` 이 닿지 않는 내부 엘리먼트라 `@utility` 로 남겼다.
- **Marquee 복제본에 `inert` 를 함께 건다.** `aria-hidden` 은 접근성 트리만 가리므로 복제된 링크·버튼이 탭 순서에 그대로 남는다 — 스크린리더에 없는 컨트롤에 키보드가 닿는다.

### 스크롤 무대 — Storybook 이 스크롤 effect 에 약한 지점

트리거가 컴포넌트 밖(스크롤 위치)에 있어서 무대를 만들어 줘야 재현된다. **높이 20rem 짜리 `overflow-y-auto` 상자** 안에 스페이서–콘텐츠–스페이서를 넣고 그 안에서 굴린다.

- IntersectionObserver 의 root 는 뷰포트지만 **조상의 overflow 로 잘린다** — 상자 밖으로 밀려난 콘텐츠는 교차하지 않는다. root 를 건드리지 않고도 상자가 무대가 되는 이유다.
- Parallax 는 `animation-timeline: view()` 가 **가장 가까운 스크롤 영역**을 보므로 같은 상자가 그대로 타임라인이 된다.
- Effect 스토리의 args 기본은 `once: false` 다. 왕복하며 몇 번이고 봐야 타이밍이 판단된다. 운영 기본값(`once: true`)은 별도 스토리로 둔다.
- 상자는 캔버스 위쪽에 둔다. `rootMargin` 이 뷰포트 아래를 15% 깎으므로 상자가 캔버스 하단에 있으면 등장이 늦게 걸린다.

**duration·easing 은 스토리에서 못 바꾼다.** CSS 가 단독 소유해 props 로 열려 있지 않다. 수치 조정은 `MaskReveal.tsx` 의 `duration-slow`·`ease-reveal` 이나 `motion.css` 의 `stagger-delay` 를 고치고 HMR 로 상자를 다시 굴리는 흐름이다. 상자가 작아 이 왕복이 빠른 게 이 형태의 핵심 이득이다.

5단계 섹션 스토리도 같은 무대가 필요하다.

### 이 단계 종료 후 사람이 볼 것

`npm run storybook` → `UI/*` 4종과 `Effect/*` 4종. **스크롤 모션의 최종 감각은 여기서 확정하지 않는다** — 트리거가 페이지에 있어 실제 화면(6단계)에서만 제대로 판단된다. 이 단계에서는 기구가 의도대로 도는지와 변형 간 비교까지만 본다.

- Button 과 ShowcaseButton 의 조화, fill 이 올라오는 속도(`duration-standard`)
- MaskReveal 의 등장 속도와 `ease-reveal` 의 뒤끝
- RevealText 의 stagger 간격(`--ds-duration-100` 배수)과 한글 어절 줄바꿈
- Parallax 세 강도가 어지럽지 않은지 — `Compared` 스토리에서 한 화면에 셋을 같이 본다
- Marquee 세 속도, `ShortContent` 에서 이음매 사이 빈 구간
- **각 컴포넌트 `Surfaces` 스토리에서 a11y 패널 대비비** — 자동 검사가 없으니 이게 유일한 확인이다
- 툴바 Motion=Reduced 에서 Parallax 가 제자리인지, Marquee 가 멈추는지

### 6단계로 넘기는 숙제

- **대비비 수동 검증 절차** — addon-vitest 를 안 넣었으므로 6단계 Accessibility 축에서 두 surface × 모든 컴포넌트를 손으로 확인한다.
- **로드 시점 등장** — `useInView` 는 이미 보이는 요소를 애니메이션하지 않는다. Hero 의 "media → 보조문 → 제목" 순서는 5단계에서 별도 수단이 필요하다.
- **Marquee 속도는 콘텐츠 폭에 반비례한다.** `--marquee-duration` 은 한 바퀴 시간이라 넓은 콘텐츠일수록 빨라 보인다. 실제 문구가 정해지는 5단계에서 다시 잡는다.

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

### 이 단계 종료 후 — Media 와 MediaReveal

3단계에서 옮겨온 두 컴포넌트를 여기서 만든다. 실제 에셋이 들어온 직후이자 5단계 Hero·Work Index·Gallery 가 이들을 소비하기 직전이다. 배치와 형식은 3단계와 같다(`src/shared/ui/{Name}/`, `shared/ui/index.ts` 가 직접 re-export).

**Media** — image / video / poster / aspect ratio / object-fit / eager·lazy / responsive sizes / muted autoplay loop / 모바일 fallback. Hero 는 `priority`(LCP), 나머지는 lazy.

**MediaReveal** — scale + mask 등장, viewport reveal 과 hover reveal, enter/exit 분리, image·video. **transform ownership 을 컴포넌트 헤더에 명시한다.**

두 컴포넌트를 나눠 두는 이유가 설계 7.3 이다 — Media 가 `object-fit`·`aspect-ratio` 를, MediaReveal 이 래퍼에서 `transform`·`clip-path` 를 소유한다. 한 엘리먼트가 둘 다 잡으면 나중에 parallax 가 얹힐 때 앞의 것을 통째로 덮는다.

스토리에는 **실제 에셋으로** 비율별 crop·모바일 fallback·긴 로딩을 확인한다. 여기서 마스크 타이밍과 스케일 배율을 확정한다.

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

**Accessibility** — heading 계층, landmark, 키보드, focus-visible, link/button 의미, alt, reduced-motion. Radix 사용 여부와 무관하게 **조합된 화면**을 검증한다.

**대비비는 손으로 확인한다(못 박음).** 3단계에서 `@storybook/addon-vitest` 를 넣지 않기로 해 자동 axe 검사가 없다. 모든 컴포넌트·섹션의 `Surfaces` 스토리를 열어 `data-surface` **양쪽**에서 a11y 패널의 contrast 항목을 직접 본다. 거대 타이포는 대비가 낮아도 읽히는 것처럼 보여 눈으로만 판단하면 반드시 놓친다. 5단계에서 addon 을 도입했다면 이 항목은 자동 검사로 대체한다.

**Performance** — transform/opacity 중심 여부, scroll 이벤트 중복, viewport 밖 애니메이션, image priority, lazy loading, responsive sizes, video loading, layout shift, `will-change` 남용, transform ownership, 불필요한 client component. 가능하면 Lighthouse.

### 문서

실제 구현과 달라진 설계 결정을 spec 문서에 반영한다. **Storybook 이 이미 설명하는 props·variant 를 마크다운에 중복하지 않는다.**
