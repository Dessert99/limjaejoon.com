# GSAP ScrollSmoother 도입 설계

작성일: 2026-08-05

## 1. 배경과 목표

홈 화면에 관성 스크롤(ScrollSmoother)을 넣고, **스크롤에 반응하는 모션 전부를 GSAP이 소유**하게 한다.

[Tailwind 인터랙티브 포트폴리오 설계](2026-07-29-tailwind-interactive-portfolio-design.md) 2절은 "GSAP·Lenis·Motion 없이 런타임 패키지 0개"를 확정 선택으로 두고, 7절이 그 근거를 "스크롤에 연속으로 물리는 것은 CSS, 상태가 한 번 바뀌고 머무는 것은 JS"로 정의했다. **이 스펙이 그 두 절을 대체한다.** 나머지(토큰 계층·섹션 반전·접근성)는 그대로 유효하다.

교체하는 이유는 관성 하나다. 페이지 관성과 요소별 지각(lag)은 스크롤이 멈춘 뒤에도 계속 도는 상태를 요구해 CSS로 만들 수 없다. parallax·rail·reveal은 이미 CSS로 돌고 있으므로 이번 작업에서 **새로 얻는 것이 아니라 옮기는 것**이다.

### 성공 기준

- `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build` 통과
- 홈에서 관성 스크롤이 돌고, Rail·Reveal이 도입 전과 같은 타이밍으로 동작한다
- `prefers-reduced-motion: reduce` 에서 모든 모션이 정적으로 떨어지고 콘텐츠 손실이 없다
- JS 비활성 상태에서 홈 콘텐츠가 전부 보인다
- 375 / 768 / 1440px 에서 가로 오버플로가 없다
- 저장소에 `animation-timeline` 을 쓰는 규칙이 0개다

## 2. 확정된 선택

| 선택지 | 결정 | 근거 |
| --- | --- | --- |
| 전환 범위 | 스크롤에 반응하는 것만 | Marquee·버튼 hover는 스크롤을 안 본다. 옮겨도 얻는 것 없이 JS만 는다 |
| 배선 | DOM 소유자가 생명주기 소유 | 예외를 두면 마크업 계약이 파일 둘로 갈린다. 규칙은 [gsap.md](../../conventions/gsap.md) |
| 적용 화면 | 홈만 | 래퍼가 `HomePage` 안에 살아 다른 라우트는 구조적으로 닿지 않는다 |
| Parallax·Marquee | 삭제 | 소비자 0곳. GSAP에서는 `data-speed` 속성이 Parallax를 대신한다 |
| 이펙트 컴포넌트 위치 | `pages/home/ui` | 소비자가 전부 홈이다. `shared` 는 재사용 자산의 자리다 |
| Storybook 범위 | `shared/ui` 프리미티브 + Foundation | 섹션·이펙트는 variant가 없어 story가 값을 못 한다 |
| 감쇠 신호 | `prefers-reduced-motion` 만 | Storybook에 GSAP 모션이 없어 `[data-motion]` 토글이 제어할 대상이 없다 |
| 모션 값 소유 | 그리는 쪽이 갖는다 | GSAP 코드는 GSAP으로만 관리한다. CSS 변수를 주입하면 두 시스템이 한 값에 묶인다 |

## 3. 원칙 — 스크롤 위치의 출처는 하나다

ScrollSmoother는 실제 스크롤 위치를 두고, **콘텐츠를 transform으로 지연시켜** 부드러움을 만든다. 실제 위치와 보이는 위치가 갈린다.

여기에 네이티브 `animation-timeline: view()` 를 남겨두면 두 시간축이 공존한다. 그래서 이번 작업은 **스크롤에 반응하는 CSS 규칙을 남기지 않는다.** 하나만 남아도 관성과 어긋난 리듬으로 돌고, 원인을 찾기 어렵다.

이것이 [기존 설계 7.3절](2026-07-29-tailwind-interactive-portfolio-design.md)의 "한 엘리먼트당 변환 소유자는 하나"가 페이지 레벨로 올라온 형태다.

## 4. 의존성

```
gsap@^3.15.0        core + ScrollTrigger + ScrollSmoother
@gsap/react@^2.1.2  useGSAP 훅 (peer react >=17)
```

둘 다 `dependencies` 다. GSAP은 3.13(2025)부터 ScrollSmoother를 포함한 전 플러그인이 무료라 Club 멤버십이 필요 없다 — 설치 시점에 한 번 확인한다.

## 5. 파일 변화

### 5.1 삭제

| 대상 | 이유 |
| --- | --- |
| `src/shared/ui/Parallax/` | 소비자 0곳. `data-speed` 속성이 대신한다 |
| `src/shared/ui/Marquee/` | 소비자 0곳 |
| `src/shared/lib/useInView.ts` · 테스트 | `useGSAP` + ScrollTrigger가 대체 |
| `src/pages/home/ui/**/*.stories.tsx` (5개) | Storybook은 프리미티브만 |

### 5.2 이동

`src/shared/ui/` → `src/pages/home/ui/` — `MaskReveal` · `MediaReveal` · `RevealText`. 각 컴포넌트의 story는 이동하지 않고 삭제한다.

`src/shared/lib/motionPreset.ts` → `src/pages/home/lib/` — 소비자가 홈뿐이라 함께 내려간다. `IN_VIEW_DEFAULTS` 는 `useInView` 와 함께 사라지고 stagger 상한만 남는다. 조각 안쪽 시차는 GSAP 네이티브 `stagger` 가 맡지만, **컴포넌트 사이의 시차는 여전히 소비자가 정하는 값**이라 상한은 필요하다.

### 5.3 신규

```
src/pages/home/ui/ScrollStage/ScrollStage.tsx   ScrollSmoother 소유
src/pages/home/lib/gsap.ts                      registerPlugin 한 곳
```

컴포넌트는 `gsap` 패키지를 직접 가져오지 않고 `lib/gsap.ts` 를 통한다. 플러그인 등록을 파일마다 반복하지 않고, 등록 위치를 옮길 때 수정 범위를 한 곳으로 묶기 위해서다.

### 5.4 수정

`HomePage.tsx`(래핑) · `Rail.tsx` · `shared/ui/index.ts` · `shared/lib/index.ts` · `vitest.setup.ts`

`motion.css` 에서 지우는 것은 **움직임을 만드는 규칙 전부**다 — `[data-reveal]` · `[data-media-reveal]` · `[data-media-scale]` · `[data-enter]` · `[data-parallax]` · `[data-rail]` 의 애니메이션과 그 `@keyframes` · `@supports` 블록, `stagger-delay` 유틸리티, 그리고 컴포넌트가 사라져 고아가 되는 마퀴 일습.

남는 것은 **값과 레이아웃**이다 — easing `@theme`, duration `@utility`, `mask-track`(디센더 오버행 보정), `[data-motion='reduced']` 전역 가드, 감쇠 시 Rail을 접는 규칙(9절). GSAP은 8절 경로로 앞의 두 값을 읽어 간다.

## 6. ScrollStage

```tsx
<ScrollStage>
  <main>…</main>
  <SiteFooter />
</ScrollStage>
```

`children` 으로 받는다. 섹션은 서버 컴포넌트로 남고, 클라이언트로 내려가는 것은 ScrollStage 자신과 Reveal 3종 · Rail 뿐이다.

내부는 `#smooth-wrapper > #smooth-content` 두 겹이다. ScrollSmoother가 요구하는 구조이고, 이 ID는 GSAP 기본값이라 옵션으로 넘기지 않는다.

**ScrollStage의 책임은 관성 하나다.** 다른 컴포넌트의 애니메이션을 대신 등록하지 않는다 — 배선 규칙은 [gsap.md](../../conventions/gsap.md) 1절이다.

## 7. 모션 소유권

| 효과 | 소유자 | 방식 |
| --- | --- | --- |
| 페이지 관성 | ScrollStage | `ScrollSmoother.create({ smooth, effects: true })` |
| Rail 가로 흐름 | **Rail** | `useGSAP` + `ScrollTrigger`(`scrub`) |
| MaskReveal · MediaReveal · RevealText | 각 컴포넌트 | `useGSAP` + `ScrollTrigger`(`once: true`) |
| 버튼 fill | CSS | `transition`. 스크롤 무관이라 그대로 둔다 |

예외가 없다 — 모든 애니메이션을 그 DOM을 렌더하는 컴포넌트가 소유한다.

**Rail은 `'use client'` 가 된다.** 안에서 렌더하는 `Media` 가 클라이언트 경계로 들어오지만 `next/image` 한 겹 래퍼이고 `items` 는 직렬화 가능한 배열이라 실비용이 작다. ScrollStage가 `[data-rail]` 을 대신 잡으면 Rail의 마크업 계약을 파일 두 개가 나눠 갖게 되고, 마크업이 바뀔 때 에러 없이 애니메이션만 사라진다 — 그쪽 비용이 더 크다.

**`data-speed` 는 세로 전용이다.** Rail은 세로 진행률을 가로 이동으로 바꾸므로 `data-speed` 로 표현할 수 없고 ScrollTrigger가 필요하다. 혼동하기 쉬운 지점이다.

**Rail의 이동량은 고정 비율이 아니라 실측이다** — `트랙 폭 - 컨테이너 폭`. 비율로 두면 넘침이 클수록 끝 항목이 영원히 화면에 안 나온다. CSS 시절 6%로는 데스크톱에서 넘침의 1/3, 모바일에서 1/5만 덮었고 나머지는 수동 가로 스크롤이 메우고 있었다. 실측으로 바꾸면 모든 항목이 스크롤 구간 안에 한 번씩 드러나므로 **수동 조작을 열지 않는다**(`overflow-hidden`, `tabIndex` 없음). 폭이 바뀌면 `invalidateOnRefresh` 가 다시 잰다.

transform 소유권 규칙은 유지한다 — 한 엘리먼트의 변환 소유자는 하나이고, 겹치면 래퍼로 층을 나눈다. GSAP이 소유자를 바꿀 뿐 규칙은 그대로다.

## 8. 모션 값의 소유 — 그리는 쪽이 갖는다

**GSAP이 그리는 모션의 duration·ease 는 GSAP이 소유한다.** CSS 토큰을 읽어 오지 않는다.

"토큰 값의 유일한 출처는 `shared/styles/*.css`" 는 **CSS가 그리는 것**에 적용된다. 경계는 값의 종류가 아니라 그리는 주체다. GSAP 애니메이션에 CSS 변수를 주입하면 두 시스템이 한 값에 묶여, 버튼 hover를 만지다 스크롤 모션이 따라 움직인다.

그래서 이징 어휘가 두 벌 공존한다.

| 영역 | 어휘 | 소비자 |
| --- | --- | --- |
| CSS | `--ds-ease-*`(cubic-bezier) · `duration-*` 유틸리티 | 버튼 fill · 링크 hover · 마스크 |
| GSAP | GSAP 이름 이징(`power4.out` 등) · 초 단위 숫자 | 스크롤 모션 전부 |

**GSAP 쪽은 GSAP 고유 이름을 쓴다.** CSS 토큰 이름을 흉내 내면 `ease-reveal`(버튼 fill 전용으로 남는다)과 GSAP의 reveal 모션이 이름은 비슷한데 다른 곡선인 상태가 된다. 어휘를 아예 갈라두면 그 혼동이 생기지 않는다.

GSAP 값은 `src/pages/home/lib/motionPreset.ts` 에 상수로 모은다 — stagger 상한과 같은 자리다.

## 9. 감쇠

`gsap.matchMedia()` 로 `(prefers-reduced-motion: no-preference)` 안에서만 애니메이션을 만든다. 감쇠 환경에서는 생성 자체를 하지 않으므로 정리 코드가 따로 필요 없다.

| 대상 | 감쇠 시 |
| --- | --- |
| ScrollSmoother | 만들지 않는다. 네이티브 스크롤 그대로 |
| Reveal 3종 | 최종 상태로 즉시 |
| Rail | 지금처럼 `display: grid` 로 접는다 |

Rail만 CSS 규칙이 남는 이유는 애니메이션이 아니라 **레이아웃**이기 때문이다. 흐름만 끄면 375px 화면에 1100px짜리 한 줄이 남아 손으로 훑어야 한다.

`[data-motion='reduced']` 는 GSAP이 보지 않는다. Storybook에 GSAP 모션이 없어 토글이 제어할 대상이 없다. CSS 쪽(남은 transition·mask)에서는 계속 쓴다.

## 10. 폴백 계약

**서버 렌더 결과에 은닉 상태가 없어야 한다.** JS가 죽거나 아직 안 붙은 순간에도 콘텐츠가 보여야 한다.

`opacity: 0` 은 `useGSAP` 마운트 이후에만 건다. `gsap.from()` 이 이 동작을 기본으로 한다 — 시작 상태를 마운트 시점에 심고 끝 상태가 원래 마크업이다.

현재 `MaskReveal.test.tsx` 가 검증하는 계약이고, 이번에도 같은 방식으로 검증한다.

**FOUC 방지를 위한 CSS 선은닉은 의도적으로 쓰지 않는다.** GSAP 공식 가이드를 포함해 여러 자료가 대상에 `visibility: hidden` 을 미리 걸어 깜빡임을 막으라고 권한다. 그러면 스크립트가 실패한 브라우저에서 콘텐츠가 영구히 사라진다. 이 저장소는 **깜빡임보다 콘텐츠 손실이 나쁘다**고 판단한다.

## 11. Storybook

story는 `shared/ui` 프리미티브(`Container` · `Media` · `SectionHeading` · `Button` · `ShowcaseButton`)와 `Foundation` 만 남긴다. 섹션과 이펙트는 variant가 없고 config에서 콘텐츠를 끌어오는 조립체라 story가 값을 못 한다.

`build-storybook` 은 `npm run ci` 에 없다. 이 정리는 GSAP 작업과 독립적이므로 커밋을 분리한다.

## 12. 테스트

| 대상 | 방법 |
| --- | --- |
| `motionPreset` stagger 상한 | 순수 함수 단위 테스트 |
| Reveal 3종 | 마크업 계약만 — 서버 렌더 은닉 없음, children 렌더, stagger 전달 |
| Rail | 기존 계약 유지 — 항목을 다 그리는지, 애니메이션이 꺼져도 좌우로 훑을 수 있는지 |
| ScrollStage | 래퍼 구조를 그리는지, children을 통과시키는지 |

애니메이션 진행은 검증하지 않는다. GSAP 자체는 신뢰하고, 실제 움직임은 사람이 dev 서버에서 본다.

`vitest.setup.ts` 는 IntersectionObserver 스텁을 **제거**하고 `matchMedia` 셔임을 **추가**한다. jsdom에 `matchMedia` 가 없어 `gsap.matchMedia()` 가 마운트 단계에서 터진다.

ScrollTrigger는 jsdom에서 레이아웃 값을 0으로 읽는다. 위치 계산에 의존하는 단언을 쓰지 않는 이유다.

## 13. 문서 처리

`docs/conventions/style-foundation.md` 는 이 작업과 함께 삭제했다. CLAUDE.md의 참조 문장과 `HeroSection.tsx` 의 인용도 함께 정리했다.

`docs/superpowers/plans/` 아래 기록은 손대지 않는다. 아카이브는 작성 시점 스냅샷이고 사후 수정하지 않는다는 [README](../README.md) 규칙을 따른다.

## 14. 범위 밖

- 블로그·어드민 화면 (아직 존재하지 않는다)
- `smooth` 값 튜닝 — 시작값을 정하고 실물에서 조정한다
- `data-lag` 개별 적용 — 관성이 먼저 서고 나서 판단한다
- pinning·horizontal scroll hijacking — 스크롤을 가로채지 않는다는 기존 결정을 유지한다

## 15. 알려진 함정

- **`#smooth-content` 의 transform이 containing block을 만든다.** 안쪽 `position: fixed` 는 뷰포트가 아니라 이 박스 기준으로 잡힌다. 헤더가 돌아오면 ScrollStage 밖에 둔다.
- **`data-speed` 는 세로만 바꾼다.** 가로 이동에는 ScrollTrigger가 필요하다(7절).
- **`animation-timeline` 규칙이 하나라도 남으면 관성과 시간축이 갈린다**(3절). 삭제 여부를 성공 기준으로 둔 이유다.
- **`useGSAP` 은 `'use client'` 를 요구한다.** 서버 컴포넌트에서 부르면 빌드가 깨진다.
- **이징 어휘가 두 벌이다**(8절). `ease-reveal` 은 마이그레이션 뒤 버튼 fill 전용으로 남는다 — GSAP reveal 모션과 같은 곡선이 아니다. 한쪽을 고쳐도 다른 쪽은 안 따라온다는 게 의도된 동작이다.
