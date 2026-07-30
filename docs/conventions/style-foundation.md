# 스타일 기반 규칙

Tailwind CSS v4 토큰 계층을 쓰는 규칙. 설계 근거는 [tailwind-interactive-portfolio-design.md](../superpowers/specs/2026-07-29-tailwind-interactive-portfolio-design.md) 4·7·8절에 있고, **토큰 값 자체는 `src/shared/styles/*.css` 가 유일한 출처**다. 여기에 값 표를 복사하지 않는다.

## 1. 어디에 무엇이 사는가

```
src/shared/styles/tokens.css    primitive(:root) + semantic·타이포·레이아웃(@theme static) + bleed
src/shared/styles/motion.css    easing(@theme) + duration·모션(@utility) + effect 상태 규칙 + 감쇠 가드
src/shared/styles/global.css    @import·@source, 섹션 반전, @layer base
```

Effect 컴포넌트의 움직임은 CSS 가 소유한다. JSX 는 상태를 `data-*` 로 내보낼 뿐이다(11절).

## 2. primitive 는 `@theme` 에 올리지 않는다

`--ds-*` 는 `:root` 의 평범한 커스텀 프로퍼티다. `@theme` 에 올리면 `bg-ds-neutral-900` 같은 유틸리티가 생성되어 semantic 계층을 우회하는 통로가 열린다.

primitive 를 JSX 에서 직접 참조하는 곳은 **z 계층 하나뿐**이다(`z-(--ds-z-navigation)`). Tailwind 에 z 네임스페이스가 없고 semantic 승격의 이득이 없어 유일하게 예외로 둔다.

## 3. `@theme inline` 을 쓰지 않는다

`inline` 은 유틸리티에 값을 박아 넣는다. `.bg-surface { background-color: var(--ds-neutral-900) }` 가 되어 `[data-surface]` 에서 `--color-surface` 를 덮어도 유틸리티가 따라오지 않는다. 섹션 반전이 통째로 죽는다.

바꿀 일이 생기면 먼저 생성된 CSS 에서 `.bg-surface` 가 `var(--color-surface)` 를 참조하는지 확인한다.

## 4. semantic 은 `@theme static` 이다

Tailwind 는 기본적으로 **쓰인 변수만** `:root` 에 방출한다. 아직 소비자가 없는 토큰은 사라지고, 그러면 `[data-surface='light']` 만 값을 가진 반쪽짜리 반전이 된다. `static` 이 그걸 막는다.

## 5. 섹션 반전

`:root` 가 다크 기본, `[data-surface='light']` 가 semantic 이름만 재정의한다. 컴포넌트는 `bg-surface text-foreground` 만 쓰고 자기가 밝은 곳에 있는지 모른다.

- 덮는 대상은 `--color-*` 다. primitive 를 덮으면 accent 까지 팔레트가 통째로 끌려간다.
- 반전 블록은 **`@layer` 밖**에 둔다. `@theme` 의 `:root` 는 `@layer theme` 안이라, 레이어 밖 규칙이 확실히 이긴다.
- `[data-surface='dark']` 규칙은 없다. 루트가 이미 다크라 값을 지정하면 중복이 된다. 밝은 섹션 **안에** 어두운 블록을 넣어야 할 때 그때 추가한다.

## 6. `--text-*` 와 `--color-*` 는 이름을 겹치지 않는다

둘 다 `text-<name>` 유틸리티를 만든다. 겹치면 하나가 조용히 먹힌다. 현재는 크기(hero·statement…)와 색(foreground·muted…)이 갈려 있으니 새 토큰을 넣을 때 이 경계를 지킨다.

## 7. duration 은 `@utility`, ease 는 `@theme`

Tailwind 에 duration 네임스페이스가 없다. `duration-(--ds-duration-800)` 임의값 문법도 동작하지만 JSX 에 primitive 가 노출되므로 `motion.css` 의 명명 유틸리티(`duration-slow` 등)를 쓴다.

`@utility` 는 `transition-duration` 과 `--tw-duration` 을 **함께** 채운다. `transition` 유틸리티가 후자를 읽기 때문에, 안 채우면 `hover:transition` 류 변형에 되밀린다.

## 8. 토큰 이름을 추가하면 `cn` 도 고친다

`tailwind-merge` 는 기본 스케일(t-shirt size·숫자)만 알아 우리 이름을 전부 색으로 오분류한다. 그대로 두면 `cn('text-hero', 'text-muted')` 가 `text-hero` 를 조용히 버린다.

`src/shared/lib/cn.ts` 의 레지스트리(`text`·`spacing`·`container`·`ease`·`duration`)에 이름을 같이 넣고, `cn.test.ts` 에 충돌 케이스를 추가한다.

## 9. `@source` 는 명시 목록이다

자동 스캔은 CWD 전체를 훑어 `docs/`·`.claude/` 의 산문까지 클래스 후보로 삼는다. `global.css` 가 `source(none)` + `@source` 로 대상을 고정한다. 클래스를 쓰는 최상위 디렉터리를 새로 만들면 여기에 추가한다.

## 10. 금지

- JSX 안의 hex color, 의미 없는 arbitrary value(`bg-[#111]`, `text-[42px]`)
- primitive 유틸리티 직접 사용 (z 계층 제외)
- `@apply` 로 클래스 묶음을 CSS 로 도피 — 반복되면 컴포넌트로 추출한다

전용 ESLint 룰은 만들지 않는다. 리뷰에서 잡는다.

## 11. 모션

- 애니메이션 대상은 `transform`·`opacity`·`clip-path` 뿐이다. `width`·`height`·`top`·`left`·`box-shadow` 는 금지.
- **한 엘리먼트당 변환 소유자는 하나다.** 겹치면 래퍼로 층을 나누거나 `translate`/`scale`/`rotate` 개별 프로퍼티로 소유권을 쪼갠다. 각 Effect 컴포넌트 헤더에 무엇을 소유하는지 적는다.
- reveal 의 초기 `opacity: 0` 은 `@supports (animation-timeline: view())` 안이나 JS 마운트 이후에만 건다. 무조건 걸면 미지원 브라우저에서 콘텐츠가 영구히 사라진다.
- 감쇠는 `@media (prefers-reduced-motion: reduce)` 와 `[data-motion='reduced']` 둘 다에 건다. 뒤는 Storybook 토글용이고 무한 애니메이션 정지도 겸한다.
- `will-change` 는 계측 후에만 붙인다.

## 12. Effect 상태는 `data-*`, 규칙은 `@layer` 밖

`[data-reveal]`·`[data-parallax]`·`[data-marquee-*]` 는 **레이어 밖**에 선언한다. 소비자가 얹은 `translate-*`·`animation` 유틸리티(`@layer utilities`)를 확실히 이겨야 "이 엘리먼트의 변환 소유자는 이 규칙" 이 성립한다. 섹션 반전(5절)과 같은 이유다.

**`@utility` 는 이 목적에 못 쓴다.** `@utility` 로 만든 클래스도 `@layer utilities` 안이라, 소비자가 `animate-spin` 하나만 붙여도 같은 레이어 뒤쪽에 생성된 축약형이 `animation-timeline` 까지 `auto` 로 되돌린다 — parallax 가 에러 없이 사라진다. 소비자가 `className` 을 얹을 수 있는 루트의 애니메이션은 반드시 레이어 밖 셀렉터가 소유한다.

`marquee-track` 만 `@utility` 로 남아 있다. 그 트랙은 내부 엘리먼트라 소비자 `className` 이 닿지 않는다.

JSX 는 상태 이름만 내보낸다. 값·시간·이징을 JSX 에 적으면 토큰이 두 곳에 살게 된다.

- `data-reveal='idle'` 에 대응하는 규칙은 **없다.** 서버 렌더와 IntersectionObserver 미지원 환경이 이 상태에 머물러 콘텐츠가 그대로 보인다.
- 은닉은 `translate` 뿐이고 `opacity: 0` 을 쓰지 않는다. 스크립트가 죽어도 글자가 사라지지 않는다.

## 13. 감쇠에서는 애니메이션을 끈다 (늦추지 않는다)

`animation-duration: 1ms` 로 줄이면 `animation-fill-mode: both` 인 애니메이션이 **끝 상태를 굳힌다.** parallax 가 밀린 자리에서 멈춰 레이아웃이 어긋난 것처럼 보인다. 그래서 감쇠 가드는 `animation-name: none !important` 로 아예 끈다.

transition 은 반대로 `1ms` 로 남긴다. reveal 이 transition 기반이라 끄면 상태 전환 자체가 사라지고, 1ms 면 최종 상태로 즉시 도착한다.

## 14. controlled bleed 는 gutter 상쇄다

`bleed-gutter` 는 Container 의 좌우 padding 만 되짚는다. `100vw`·`100svw` 계열은 스크롤바 폭까지 세어 가로 오버플로를 만든다 — 설계 성공 기준이 금지한 바로 그 증상이다. 뷰포트 끝까지 가야 하는 미디어는 Container 밖에 둔다.

## 15. 마스크는 오버행을 함께 옮긴다

`mask-track` 은 `overflow: hidden` 이 디센더(g·y)를 자르지 않게 `--mask-overhang` 만큼 아래 여백을 주고 같은 값을 음수 마진으로 되당긴다. 은닉 상태는 `100%` 가 아니라 `calc(100% + var(--mask-overhang))` 만큼 내려야 한다 — `100%` 만 내리면 그 여백 사이로 글자 윗동이 비친다.

오버행이 `em` 기준이라 **글자 크기 클래스는 자식이 아니라 마스크 컴포넌트에 건다.**

## 16. Effect 컴포넌트는 `ref` 를 열지 않는다

`MaskReveal`·`RevealText` 의 루트 ref 는 IntersectionObserver 몫이다. props 로 `ref` 를 받으면 `{...rest}` 가 관찰자 ref 를 덮어 등장이 **조용히** 죽는다(에러 없이 영원히 `idle`). 두 컴포넌트만 `ComponentPropsWithoutRef` 를 쓴다.

같은 이유로 `<button>` 의 `type` 은 `{...rest}` **뒤에** 둔다. `type={undefined}` 가 흘러들면 속성이 지워져 form 안에서 브라우저 기본값 `submit` 이 되살아난다.

## 17. Storybook

- preview 는 앱과 **같은** `global.css` 를 import 한다. SB 전용 CSS 를 만들지 않는다.
- `@storybook/nextjs-vite` 가 `next/font` 를 처리해 `@font-face` 를 런타임 주입하지만, **variable 클래스를 `<html>` 에 거는 건 우리 몫**이다. `--font-body` 가 `:root` 에서 해석되므로 하위 엘리먼트에 걸면 소용없다.
- Foundation story 는 값을 적지 않고 `document.styleSheets` 에서 토큰 이름을 훑는다. 토큰을 늘려도 스토리는 그대로 따라온다.
- **판별 union props 는 스토리 args 로 그대로 쓸 수 없다.** Storybook 의 Args 추론이 union 을 교집합으로 접어 `never` 가 된다(`href?: never` × `href: string`). 판별자를 뺀 평평한 타입으로 `satisfies Meta<...>` 를 쓰고, 그 역할은 `render` 로 직접 그린다.
- **`a11y: { test: 'error' }` 는 지금 아무것도 강제하지 않는다.** `@storybook/addon-vitest` 가 있어야 작동하는데 도입하지 않았다(플랜 3단계 결정). 대비비는 사람이 a11y 패널로 본다.

## 18. Steiger

CSS 만 든 세그먼트도 `fsd/public-api` 에 걸린다. `shared/styles` 는 `fonts.ts`·`index.ts` 가 있어 통과한다. CSS 만 두는 세그먼트를 새로 만들 계획이면 `index.ts` 를 같이 만든다.

`*.stories.*` 는 Steiger·ESLint ignores 에 있다. 스토리를 위해 FSD 구조를 바꾸지 않고 검사 범위만 조정한 것이다.
