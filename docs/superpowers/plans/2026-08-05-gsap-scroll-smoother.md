# GSAP ScrollSmoother 도입 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈 화면에 GSAP ScrollSmoother 관성 스크롤을 넣고, 스크롤에 반응하는 모션 전부를 CSS에서 GSAP으로 옮긴다.

**Architecture:** `ScrollStage` 하나가 ScrollSmoother만 소유하고, 나머지 애니메이션은 각자의 DOM을 렌더하는 컴포넌트가 `useGSAP` 으로 소유한다. 효과를 옮길 때마다 짝이 되는 `motion.css` 규칙을 같은 커밋에서 지워, GSAP과 CSS가 같은 요소를 동시에 움직이는 구간을 만들지 않는다.

**Tech Stack:** Next 16 · React 19 · Tailwind v4 · gsap 3.15 · @gsap/react 2.1 · Vitest · Testing Library

설계: [2026-08-05-gsap-scroll-smoother-design.md](../specs/2026-08-05-gsap-scroll-smoother-design.md) · 규칙: [gsap.md](../../conventions/gsap.md)

## Global Constraints

- 애니메이션은 **대상 DOM을 렌더하는 컴포넌트가** 소유한다. 바깥에서 셀렉터로 남의 마크업을 잡지 않는다.
- **서버 렌더 결과에 은닉 상태가 없어야 한다.** `visibility: hidden` 같은 CSS 선은닉을 쓰지 않는다. 은닉은 `gsap.from()` 이 마운트 시점에 건다.
- 애니메이션은 `gsap.matchMedia()` 의 `(prefers-reduced-motion: no-preference)` 안에서만 만든다.
- duration·ease·stagger 는 `MOTION` 상수가 소유한다. CSS 변수에서 읽지 않는다.
- 컴포넌트는 `gsap` 패키지를 직접 import 하지 않고 `@/pages/home/lib/gsap` 을 통한다. (슬라이스 내부에서는 상대경로)
- 셀렉터는 `data-*`, `useGSAP({ scope: rootRef })` 로 조회 범위를 가둔다. 스타일 클래스를 애니메이션 식별자로 쓰지 않는다.
- `describe`·`it` 설명문은 한국어, 고유 식별자만 영문.
- 주석은 파일 헤더와 export 에 단일 라인 JSDoc, 본문 비자명 로직에 한 줄 `//` 로 WHY.
- 각 태스크 끝에서 `npm run test` 와 `npm run type-check` 가 통과해야 한다.

---

## File Structure

| 파일 | 책임 |
| --- | --- |
| `src/pages/home/lib/gsap.ts` | 플러그인 등록 한 곳. 컴포넌트의 유일한 gsap 진입점 |
| `src/pages/home/lib/motionPreset.ts` | `MOTION` 상수 + stagger 상한 |
| `src/pages/home/ui/ScrollStage/ScrollStage.tsx` | `#smooth-wrapper`/`#smooth-content` + ScrollSmoother |
| `src/pages/home/ui/GallerySection/Rail.tsx` | 트랙의 x 이동 소유 |
| `src/pages/home/ui/MaskReveal/MaskReveal.tsx` | 블록 마스크 등장 |
| `src/pages/home/ui/MediaReveal/MediaReveal.tsx` | clip-path(바깥) + scale(안쪽) |
| `src/pages/home/ui/RevealText/RevealText.tsx` | 조각 분할 + stagger 등장 |

---

## Task 1: GSAP 기반 — 패키지·등록 파일·모션 상수

**Files:**
- Modify: `package.json`
- Create: `src/pages/home/lib/gsap.ts`
- Create: `src/pages/home/lib/motionPreset.ts`
- Create: `src/pages/home/lib/index.ts`
- Create: `src/pages/home/lib/motionPreset.test.ts`
- Modify: `vitest.setup.ts`
- Delete: `src/shared/lib/motionPreset.ts`, `src/shared/lib/motionPreset.test.ts`

**Interfaces:**
- Produces: `MOTION` (아래 형태), `STAGGER_MAX_STEPS: number`, `staggerIndex(index: number): number`, `gsap`, `ScrollTrigger`, `ScrollSmoother`, `useGSAP`

- [ ] **Step 1: 패키지 설치**

```bash
npm install gsap@^3.15.0 @gsap/react@^2.1.2
```

- [ ] **Step 2: ScrollSmoother 가 공개 패키지에 들어 있는지 확인**

GSAP 3.13부터 전 플러그인이 무료지만, 실제로 파일이 있는지 눈으로 본다.

```bash
ls node_modules/gsap/ScrollSmoother.js node_modules/gsap/ScrollTrigger.js
```

Expected: 두 파일 모두 존재. 없으면 여기서 멈추고 보고한다.

- [ ] **Step 3: 실패하는 테스트 작성**

Create `src/pages/home/lib/motionPreset.test.ts`:

```ts
/** 모션 프리셋 테스트 — 컴포넌트 사이 시차가 무한정 밀리지 않는다는 계약을 검증한다 */
import { describe, expect, it } from 'vitest';
import { STAGGER_MAX_STEPS, staggerIndex } from './motionPreset';

describe('staggerIndex', () => {
  it('상한 아래에서는 인덱스를 그대로 돌려준다', () => {
    expect(staggerIndex(3)).toBe(3);
  });

  it('상한을 넘으면 상한에서 멈춘다', () => {
    expect(staggerIndex(STAGGER_MAX_STEPS + 5)).toBe(STAGGER_MAX_STEPS);
  });
});
```

- [ ] **Step 4: 테스트가 실패하는지 확인**

Run: `npx vitest run src/pages/home/lib/motionPreset.test.ts`
Expected: FAIL — `Failed to resolve import "./motionPreset"`

- [ ] **Step 5: 모션 상수 작성**

Create `src/pages/home/lib/motionPreset.ts`:

```ts
/** GSAP 모션 값 — duration·ease·stagger 는 GSAP 이 소유한다(CSS 변수를 읽어 오지 않는다) */

/** 홈 모션 값 한 벌 — 초 단위와 GSAP 이름 이징을 쓴다(CSS 토큰과 어휘를 겹치지 않게 둔다) */
export const MOTION = {
  smooth: 1.2,
  duration: {
    reveal: 0.8,
    cinematic: 1.2,
  },
  ease: {
    reveal: 'power4.out',
    cinematic: 'power2.inOut',
  },
  stagger: {
    step: 0.1,
    // 조각이 많아도 마지막 등장이 하염없이 밀리지 않게 총 시차를 자른다
    total: 0.8,
  },
  // 트랙 제 폭 기준 백분율 — CSS 시절 --rail-distance 와 같은 값이다
  railDistance: 6,
} as const;

/** stagger 최대 단계 — 컴포넌트 사이 시차를 자르는 지점 */
export const STAGGER_MAX_STEPS = 8;

/** 컴포넌트 사이 시차 단계 — 조각 안쪽 시차는 GSAP stagger 가 따로 맡는다 */
export const staggerIndex = (index: number): number => {
  return Math.min(index, STAGGER_MAX_STEPS);
};
```

- [ ] **Step 6: 테스트 통과 확인**

Run: `npx vitest run src/pages/home/lib/motionPreset.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 7: GSAP 등록 파일 작성**

Create `src/pages/home/lib/gsap.ts`:

```ts
'use client';

// 'use client' 는 사실 진술이다 — 플러그인 등록이 document 를 만지므로 서버 그래프에 딸려 들어가면 안 된다.
/** GSAP 진입점 — 등록을 한 곳에 모은다. 컴포넌트는 gsap 패키지를 직접 가져오지 않는다 */
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// useGSAP 도 등록 대상이다 — 등록해야 gsap.context 정리가 훅 생명주기에 걸린다
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

export { gsap, ScrollSmoother, ScrollTrigger, useGSAP };
```

- [ ] **Step 8: lib 공개 API 작성**

Create `src/pages/home/lib/index.ts`:

```ts
export { gsap, ScrollSmoother, ScrollTrigger, useGSAP } from './gsap';
export { MOTION, STAGGER_MAX_STEPS, staggerIndex } from './motionPreset';
```

- [ ] **Step 9: jsdom 셔임 교체**

`vitest.setup.ts` 에서 `NoopIntersectionObserver` 클래스와 `globalThis.IntersectionObserver` 할당 블록을 통째로 지우고, 그 자리에 아래를 넣는다.

```ts
// jsdom 에는 matchMedia 가 없다 — gsap.matchMedia() 가 마운트 단계에서 터진다.
// 전부 false 로 답해 (prefers-reduced-motion: no-preference) 가 안 걸리게 한다 —
// 테스트는 마크업 계약만 보고 애니메이션 생성은 브라우저 몫으로 남긴다.
globalThis.matchMedia = ((query: string) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  };
}) as unknown as typeof matchMedia;
```

- [ ] **Step 10: 옛 motionPreset 을 stagger 헬퍼만 남기고 줄인다**

`shared/ui` 의 Reveal 3종이 Task 4~6까지 `staggerIndex` 를 계속 쓴다. `shared` 는 `pages` 를 import 할 수 없으므로 **옛 헬퍼를 그때까지 남긴다.** 소비자가 다 떠난 뒤 Task 7에서 지운다.

`src/shared/lib/motionPreset.ts` 에서 `IN_VIEW_DEFAULTS` 만 들어낸다 — 소비자가 `useInView` 하나뿐이라 그 파일로 내린다.

```ts
/** 모션 프리셋 — CSS 가 소유할 수 없는 값만 담는다(duration·easing 은 토큰이 단독 소유) */

/** stagger 최대 단계 — 항목이 많아도 마지막 등장이 하염없이 밀리지 않게 자르는 지점 */
export const STAGGER_MAX_STEPS = 8;

/** CSS 에 넘길 stagger 단계 — 지연 "값"이 아니라 배수만 넘겨 duration 소유권을 CSS 에 남긴다 */
export const staggerIndex = (index: number): number => {
  return Math.min(index, STAGGER_MAX_STEPS);
};
```

`src/shared/lib/index.ts` 에서 `IN_VIEW_DEFAULTS` export 만 뺀다.

```ts
export { useSearchParams, usePathname, useRouter } from './navigation';
export { cn } from './cn';
export { STAGGER_MAX_STEPS, staggerIndex } from './motionPreset';
export { useInView, type InViewState } from './useInView';
```

`src/shared/lib/useInView.ts` 의 `import { IN_VIEW_DEFAULTS } from './motionPreset';` 를 지우고 그 자리에 기본값을 둔다.

```ts
// 등장 시점은 rootMargin 한 곳으로만 늦춘다(아래 15%)
// threshold 는 0 이다 — 뷰포트보다 큰 요소는 비율이 임계치에 영원히 못 닿아 등장 자체가 사라진다
const IN_VIEW_DEFAULTS = {
  rootMargin: '0px 0px -15% 0px',
  threshold: 0,
  once: true,
} as const;
```

기존 Reveal 테스트 3종은 **손대지 않는다.** Task 4~6에서 컴포넌트와 함께 옮기며 새 경로로 바꾼다.

- [ ] **Step 11: 전체 검증**

Run: `npm run type-check && npm run test && npm run fsd`
Expected: 모두 통과

- [ ] **Step 12: 커밋**

```bash
git add package.json package-lock.json src/pages/home/lib src/shared/lib vitest.setup.ts src/shared/ui
git commit -m "feat: add gsap entry point and motion constants"
```

---

## Task 2: ScrollStage — 관성 스크롤

**Files:**
- Create: `src/pages/home/ui/ScrollStage/ScrollStage.tsx`
- Create: `src/pages/home/ui/ScrollStage/ScrollStage.test.tsx`
- Modify: `src/pages/home/ui/HomePage.tsx`

**Interfaces:**
- Consumes: `ScrollSmoother`, `gsap`, `useGSAP`, `MOTION` from `../../lib`
- Produces: `ScrollStage({ children }: { children: ReactNode })` — `#smooth-wrapper > #smooth-content` 두 겹을 그린다

- [ ] **Step 1: 실패하는 테스트 작성**

Create `src/pages/home/ui/ScrollStage/ScrollStage.test.tsx`:

```tsx
/** ScrollStage 테스트 — ScrollSmoother 가 요구하는 두 겹 구조와 children 통과를 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollStage } from './ScrollStage';

describe('ScrollStage', () => {
  it('children 을 그대로 통과시킨다', () => {
    render(
      <ScrollStage>
        <p>무대 위 콘텐츠</p>
      </ScrollStage>
    );

    expect(screen.getByText('무대 위 콘텐츠')).toBeInTheDocument();
  });

  it('ScrollSmoother 가 요구하는 두 겹을 그린다', () => {
    // 이 ID 는 GSAP 기본값이라 옵션으로 넘기지 않는다 — 이름이 틀리면 관성이 조용히 안 걸린다
    const { container } = render(
      <ScrollStage>
        <p>콘텐츠</p>
      </ScrollStage>
    );

    const wrapper = container.querySelector('#smooth-wrapper');
    const content = container.querySelector('#smooth-content');

    expect(wrapper).not.toBeNull();
    expect(content).not.toBeNull();
    expect(wrapper).toContainElement(content as HTMLElement);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npx vitest run src/pages/home/ui/ScrollStage/ScrollStage.test.tsx`
Expected: FAIL — `Failed to resolve import "./ScrollStage"`

- [ ] **Step 3: ScrollStage 작성**

Create `src/pages/home/ui/ScrollStage/ScrollStage.tsx`:

```tsx
'use client';

/** 스크롤 무대 — ScrollSmoother 만 소유한다. 다른 컴포넌트의 애니메이션을 대신 등록하지 않는다 */
import { useRef, type ReactNode } from 'react';
import { MOTION, ScrollSmoother, gsap, useGSAP } from '../../lib';

/** 홈 전체를 감싸 관성을 건다 — children 으로 받아 섹션을 서버 컴포넌트로 남긴다 */
export function ScrollStage({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      // 감쇠에서는 만들지 않는다 — 생성 자체를 안 하므로 되돌릴 것이 없다
      media.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollSmoother.create({ smooth: MOTION.smooth, effects: true });
      });

      return () => media.revert();
    },
    { scope: wrapperRef }
  );

  // ID 는 GSAP 기본값이다 — 옵션으로 넘기지 않고 이 이름을 그대로 쓴다
  return (
    <div
      id='smooth-wrapper'
      ref={wrapperRef}>
      <div id='smooth-content'>{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/pages/home/ui/ScrollStage/ScrollStage.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: HomePage 에 연결**

`src/pages/home/ui/HomePage.tsx` 를 아래로 바꾼다.

```tsx
/** 포트폴리오 홈 — 섹션 조립만 하고 콘텐츠는 각 섹션이 config 에서 가져온다 */
import { SiteFooter } from '@/widgets/site-footer';
import { ContactSection } from './ContactSection/ContactSection';
import { GallerySection } from './GallerySection/GallerySection';
import { HeroSection } from './HeroSection/HeroSection';
import { IntroductionSection } from './IntroductionSection/IntroductionSection';
import { ScrollStage } from './ScrollStage/ScrollStage';
import { WorkSection } from './WorkSection/WorkSection';

/** 홈 페이지 구성 */
export function HomePage() {
  return (
    // 스크롤하는 것은 전부 무대 안에 있어야 한다 — 밖에 두면 관성과 따로 논다
    <ScrollStage>
      <main>
        <HeroSection />
        <IntroductionSection />
        <WorkSection />
        <GallerySection />
        <ContactSection />
      </main>
      {/* main 밖이다 — section·main 안에 중첩된 footer 는 contentinfo 랜드마크가 되지 않는다 */}
      <SiteFooter />
    </ScrollStage>
  );
}
```

- [ ] **Step 6: 기존 홈 테스트가 그대로 통과하는지 확인**

Run: `npm run test && npm run type-check`
Expected: 모두 통과. `HomePage.test.tsx` 의 랜드마크 단언이 깨지면 `ScrollStage` 가 `main`·`footer` 를 감싸기만 하고 새 랜드마크를 만들지 않는지 확인한다 (`div` 는 랜드마크가 아니다).

- [ ] **Step 7: 눈으로 확인**

```bash
npm run dev
```

`http://localhost:3000` 에서 스크롤이 부드럽게 따라오는지 본다. 기존 CSS 모션(parallax·rail·reveal)은 아직 그대로 동작해야 한다.

- [ ] **Step 8: 커밋**

```bash
git add src/pages/home/ui
git commit -m "feat: wrap home in ScrollStage for smooth scrolling"
```

---

## Task 3: Rail 을 GSAP 으로

**Files:**
- Modify: `src/pages/home/ui/GallerySection/Rail.tsx`
- Modify: `src/pages/home/ui/GallerySection/Rail.test.tsx`
- Modify: `src/shared/styles/motion.css`

**Interfaces:**
- Consumes: `gsap`, `useGSAP`, `MOTION` from `../../lib`
- Produces: `Rail` — props 변경 없음(`direction`·`label`·`items`)

- [ ] **Step 1: 테스트를 새 계약으로 바꾼다**

`Rail.test.tsx` 의 `'reverse 방향은 트랙에 표시된다'` 와 `'forward 방향은 빈 data-rail 을 둔다'` 두 케이스를 지우고 아래 하나로 대체한다. 방향은 이제 GSAP 이 값으로 다루므로 DOM 에 남기지 않고, `data-rail` 은 감쇠 레이아웃 셀렉터로만 남는다.

```tsx
  it('감쇠 레이아웃이 걸 수 있게 트랙을 표시한다', () => {
    // motion.css 가 [data-rail] 존재로 감쇠에서 한 줄을 그리드로 접는다
    const { container } = render(
      <Rail
        direction='reverse'
        label='작업 기록 2번째 줄'
        items={ITEMS}
      />
    );

    expect(container.querySelector('[data-rail]')).toBeInTheDocument();
  });
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npx vitest run src/pages/home/ui/GallerySection/Rail.test.tsx`
Expected: PASS — 아직 마크업이 조건을 만족한다. 이 태스크는 동작 교체라 RED 가 안 나는 게 정상이다. 대신 Step 6의 육안 확인이 검증점이다.

- [ ] **Step 3: Rail 을 GSAP 소유로 바꾼다**

`src/pages/home/ui/GallerySection/Rail.tsx` 를 아래로 바꾼다.

```tsx
'use client';

/** Gallery 의 가로 rail 한 줄 — 세로 스크롤 진행률을 가로 이동으로 바꾼다. 트랙의 x 만 소유한다 */
import { useRef } from 'react';
import { Media, type MediaRatio } from '@/shared/ui';
import { MOTION, gsap, useGSAP } from '../../lib';

/** rail 항목 한 건 — config 의 GalleryItem 이 구조적으로 이 형태다 */
export interface RailItem {
  id: string;
  src: string | null;
  alt: string;
  ratio: MediaRatio;
}

type RailProps = {
  direction: 'forward' | 'reverse';
  label: string;
  items: RailItem[];
};

/** 한 줄을 그린다 — 흐름 방향만 다르고 배치는 두 줄이 같다 */
export function Rail({ direction, label, items }: RailProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 두 줄이 반대로 흘러야 한다 — 같은 방향이면 그냥 미끄러지는 것처럼만 보인다
        const from =
          direction === 'reverse' ? -MOTION.railDistance : MOTION.railDistance;

        gsap.fromTo(
          '[data-rail]',
          { xPercent: from },
          {
            xPercent: -from,
            // scrub 구간을 등속으로 훑어야 스크롤 위치와 가로 위치가 선형으로 묶인다
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return (
    // overflow-x-auto + tabindex — 애니메이션이 꺼져도 좌우로 직접 훑을 수 있어야 정보가 안 빠진다
    <div
      ref={rootRef}
      role='group'
      aria-label={label}
      tabIndex={0}
      className='overflow-x-auto'>
      {/* data-rail 은 감쇠에서 한 줄을 그리드로 접는 셀렉터를 겸한다 */}
      <div
        data-rail=''
        className='flex w-max gap-grid-gap px-gutter'>
        {items.map((item) => {
          return (
            <Media
              key={item.id}
              src={item.src}
              alt={item.alt}
              ratio={item.ratio}
              sizes='(min-width: 48rem) 40vw, 80vw'
              className='w-rail-item shrink-0 rounded-md'
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 짝이 되는 CSS 규칙 삭제**

`src/shared/styles/motion.css` 에서 아래 두 블록을 지운다. **감쇠 블록(`@media (prefers-reduced-motion: reduce)` 안의 `[data-rail]` 그리드 접힘과 `[data-motion='reduced'] [data-rail]`)은 남긴다** — 그건 애니메이션이 아니라 레이아웃이다.

지울 것:

```css
/* Gallery rail — 세로 스크롤 진행률을 가로 이동으로 바꾼다. 트랙의 translate 만 소유한다 */
@keyframes rail-drift { … }

@supports (animation-timeline: view()) {
  [data-rail] { … }
  [data-rail='reverse'] { … }
}
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm run test && npm run type-check`
Expected: 모두 통과

- [ ] **Step 6: 눈으로 확인**

```bash
npm run dev
```

Gallery 섹션에서 두 줄이 **서로 반대 방향으로** 흐르는지, 페이지 스크롤이 멈추지 않는지(pinning 없음) 본다. macOS 시스템 설정 → 손쉬운 사용 → 디스플레이 → "동작 줄이기"를 켜고 새로고침해 한 줄이 그리드로 접히는지도 본다.

- [ ] **Step 7: 커밋**

```bash
git add src/pages/home/ui/GallerySection src/shared/styles/motion.css
git commit -m "refactor: move gallery rail from css timeline to gsap"
```

---

## Task 4: MaskReveal — 이동 + GSAP

**Files:**
- Create: `src/pages/home/ui/MaskReveal/MaskReveal.tsx`
- Create: `src/pages/home/ui/MaskReveal/MaskReveal.test.tsx`
- Delete: `src/shared/ui/MaskReveal/` (전체)
- Modify: `src/shared/ui/index.ts`
- Modify: `src/pages/home/ui/HeroSection/HeroSection.tsx`, `IntroductionSection/IntroductionSection.tsx`, `ContactSection/ContactSection.tsx`
- Modify: `src/shared/styles/motion.css`

**Interfaces:**
- Consumes: `gsap`, `useGSAP`, `MOTION`, `staggerIndex` from `../../lib`
- Produces: `MaskReveal({ staggerIndex?, once?, trigger?, className?, children, ...rest })` — props 시그니처 유지

- [ ] **Step 1: 테스트를 옮기고 새 계약으로 바꾼다**

Create `src/pages/home/ui/MaskReveal/MaskReveal.test.tsx`:

```tsx
/** MaskReveal 테스트 — 서버 렌더에 은닉이 없다는 계약과 stagger 배수 전달을 검증한다 */
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { STAGGER_MAX_STEPS } from '../../lib';
import { MaskReveal } from './MaskReveal';

describe('MaskReveal', () => {
  it('children 을 그대로 렌더한다', () => {
    render(<MaskReveal>가려졌다 올라오는 문장</MaskReveal>);

    expect(screen.getByText('가려졌다 올라오는 문장')).toBeInTheDocument();
  });

  it('서버 렌더 결과에는 은닉 상태가 없다', () => {
    // JS 가 죽거나 아직 안 붙은 순간에도 콘텐츠가 보여야 한다 — 은닉은 gsap.from 이 마운트 뒤에 건다
    const html = renderToStaticMarkup(
      <MaskReveal>서버에서 온 문장</MaskReveal>
    );

    expect(html).toContain('서버에서 온 문장');
    expect(html).not.toContain('visibility');
    expect(html).not.toContain('opacity');
  });

  it('움직이는 층을 data-reveal 로 표시한다', () => {
    // 셀렉터는 data-* 다 — 스타일 클래스를 쓰면 디자인 수정이 애니메이션을 조용히 끊는다
    const { container } = render(<MaskReveal>문장</MaskReveal>);

    expect(container.querySelector('[data-reveal]')).toBeInTheDocument();
  });

  it('stagger 배수는 최대 단계에서 멈춘다', () => {
    const { container } = render(
      <MaskReveal staggerIndex={STAGGER_MAX_STEPS + 5}>문장</MaskReveal>
    );

    expect(container.querySelector('[data-reveal]')).toHaveAttribute(
      'data-stagger',
      String(STAGGER_MAX_STEPS)
    );
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npx vitest run src/pages/home/ui/MaskReveal/MaskReveal.test.tsx`
Expected: FAIL — `Failed to resolve import "./MaskReveal"`

- [ ] **Step 3: MaskReveal 작성**

Create `src/pages/home/ui/MaskReveal/MaskReveal.tsx`:

```tsx
'use client';

/** 마스크 등장 — 바깥이 overflow, 안쪽이 y 를 소유한다(한 엘리먼트가 둘 다 잡지 않는다) */
import { useRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/lib';
import { MOTION, gsap, staggerIndex, useGSAP } from '../../lib';

/** ref 는 열지 않는다 — 루트 ref 는 애니메이션 scope 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
type MaskRevealProps = ComponentPropsWithoutRef<'div'> & {
  staggerIndex?: number;
  once?: boolean;
  trigger?: 'view' | 'mount';
};

/** 블록 콘텐츠가 아래에서 밀려 올라오는 등장 — 글자 크기 클래스는 자식이 아니라 이 컴포넌트에 건다(오버행이 em 기준) */
/* trigger='mount' 는 Hero 처럼 늘 화면 안에 있는 자리용이다 — 뷰포트 트리거로는 곧장 발동해 아무 일도 안 일어난다 */
export function MaskReveal({
  staggerIndex: index = 0,
  once = true,
  trigger = 'view',
  className,
  children,
  ...rest
}: MaskRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const step = staggerIndex(index);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 오버행만큼 더 내려야 한다 — 100% 만 내리면 디센더 여백에 글자 윗동이 비친다
        const overhang =
          getComputedStyle(root).getPropertyValue('--mask-overhang').trim() ||
          '0px';

        gsap.from('[data-reveal]', {
          yPercent: 100,
          y: overhang,
          duration: MOTION.duration.reveal,
          ease: MOTION.ease.reveal,
          delay: step * MOTION.stagger.step,
          scrollTrigger:
            trigger === 'view'
              ? { trigger: root, start: 'top 85%', once }
              : undefined,
        });
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className={cn('mask-track', className)}
      {...rest}>
      {/* 은닉 스타일이 마크업에 없다 — gsap.from 이 마운트 뒤에 시작 상태를 심는다 */}
      <div
        data-reveal=''
        data-stagger={step}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/pages/home/ui/MaskReveal/MaskReveal.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: 소비자 import 경로 교체**

세 파일에서 `MaskReveal` 을 `@/shared/ui` 배럴이 아니라 새 경로에서 가져온다.

- `HeroSection.tsx`: `import { Container, MaskReveal, Media } from '@/shared/ui';` → `import { Container, Media } from '@/shared/ui';` + `import { MaskReveal } from '../MaskReveal/MaskReveal';`
- `IntroductionSection.tsx`, `ContactSection.tsx`: 같은 방식으로 `MaskReveal` 만 상대경로로 뺀다

- [ ] **Step 6: 옛 컴포넌트 삭제와 배럴 정리**

```bash
rm -r src/shared/ui/MaskReveal
```

`src/shared/ui/index.ts` 에서 `export { MaskReveal } from './MaskReveal/MaskReveal';` 줄을 지운다.

- [ ] **Step 7: 짝이 되는 CSS 규칙 삭제**

`motion.css` 에서 `@utility stagger-delay`, `@keyframes mask-enter`, `[data-enter]`, `[data-reveal='out']`, `[data-reveal='in']` 를 지운다. **`@utility mask-track` 는 남긴다** — overflow·오버행은 레이아웃이다.

- [ ] **Step 8: 전체 검증**

Run: `npm run test && npm run type-check && npm run fsd`
Expected: 모두 통과

- [ ] **Step 9: 눈으로 확인**

```bash
npm run dev
```

Hero 제목이 로드와 함께 올라오는지(`trigger='mount'`), Introduction·Contact 의 마스크가 스크롤 진입 시 올라오는지, **디센더(ㄱ·y·g)가 잘리거나 위쪽이 비치지 않는지** 본다.

- [ ] **Step 10: 커밋**

```bash
git add src/pages/home/ui src/shared/ui src/shared/styles/motion.css
git commit -m "refactor: move MaskReveal into home slice and drive it with gsap"
```

---

## Task 5: MediaReveal — 이동 + GSAP

**Files:**
- Create: `src/pages/home/ui/MediaReveal/MediaReveal.tsx`
- Create: `src/pages/home/ui/MediaReveal/MediaReveal.test.tsx`
- Delete: `src/shared/ui/MediaReveal/` (전체)
- Modify: `src/shared/ui/index.ts`
- Modify: `src/pages/home/ui/HeroSection/HeroSection.tsx`, `WorkSection/ProjectRow.tsx`
- Modify: `src/shared/styles/motion.css`

**Interfaces:**
- Consumes: `gsap`, `useGSAP`, `MOTION`, `staggerIndex` from `../../lib`
- Produces: `MediaReveal({ children, once?, staggerIndex?, className?, style?, ...rest })`

- [ ] **Step 1: 테스트를 옮기고 새 계약으로 바꾼다**

Create `src/pages/home/ui/MediaReveal/MediaReveal.test.tsx`:

```tsx
/** MediaReveal 테스트 — 두 층이 서로 다른 프로퍼티를 소유한다는 계약과 SSR 안전성을 검증한다 */
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { STAGGER_MAX_STEPS } from '../../lib';
import { MediaReveal } from './MediaReveal';

describe('MediaReveal', () => {
  it('children 을 그대로 렌더한다', () => {
    render(<MediaReveal>덮개가 열리며 드러나는 이미지</MediaReveal>);

    expect(
      screen.getByText('덮개가 열리며 드러나는 이미지')
    ).toBeInTheDocument();
  });

  it('마스크 층과 스케일 층이 따로 표시된다', () => {
    // 한 엘리먼트가 clip-path 와 scale 을 같이 잡으면 나중에 얹히는 변환이 앞의 것을 덮는다
    const { container } = render(<MediaReveal>이미지</MediaReveal>);

    const mask = container.querySelector('[data-media-reveal]');
    const scale = container.querySelector('[data-media-scale]');

    expect(mask).not.toBeNull();
    expect(scale).not.toBeNull();
    expect(mask).not.toBe(scale);
    expect(mask).toContainElement(scale as HTMLElement);
  });

  it('소비자 style 을 그대로 받는다', () => {
    const { container } = render(
      <MediaReveal style={{ opacity: 0.5 }}>이미지</MediaReveal>
    );

    expect(container.querySelector('[data-media-reveal]')).toHaveStyle({
      opacity: '0.5',
    });
  });

  it('서버 렌더 결과에는 은닉 상태가 없다', () => {
    const html = renderToStaticMarkup(<MediaReveal>이미지</MediaReveal>);

    expect(html).toContain('이미지');
    expect(html).not.toContain('clip-path');
    expect(html).not.toContain('visibility');
  });

  it('stagger 배수는 최대 단계에서 멈춘다', () => {
    const { container } = render(
      <MediaReveal staggerIndex={STAGGER_MAX_STEPS + 4}>이미지</MediaReveal>
    );

    expect(container.querySelector('[data-media-reveal]')).toHaveAttribute(
      'data-stagger',
      String(STAGGER_MAX_STEPS)
    );
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npx vitest run src/pages/home/ui/MediaReveal/MediaReveal.test.tsx`
Expected: FAIL — `Failed to resolve import "./MediaReveal"`

- [ ] **Step 3: MediaReveal 작성**

Create `src/pages/home/ui/MediaReveal/MediaReveal.tsx`:

```tsx
'use client';

/** 미디어 등장 — 바깥이 clip-path, 안쪽이 scale 을 소유한다(Media 는 aspect-ratio·object-fit) */
import { useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '@/shared/lib';
import { MOTION, gsap, staggerIndex, useGSAP } from '../../lib';

/** ref 는 열지 않는다 — 루트 ref 는 애니메이션 scope 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
type MediaRevealProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ReactNode;
  once?: boolean;
  staggerIndex?: number;
};

/** 덮개가 열리는 동안 안쪽 미디어가 제자리로 조여드는 등장 — Hero·Work 가 공유한다 */
export function MediaReveal({
  children,
  once = true,
  staggerIndex: index = 0,
  className,
  ...rest
}: MediaRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const step = staggerIndex(index);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 두 층이 같은 타임라인에 실려야 마스크와 스케일이 어긋나지 않는다
        const timeline = gsap.timeline({
          delay: step * MOTION.stagger.step,
          defaults: {
            duration: MOTION.duration.cinematic,
            ease: MOTION.ease.cinematic,
          },
          scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once },
        });

        timeline
          .from('[data-media-reveal]', { clipPath: 'inset(0 0 100% 0)' }, 0)
          // 살짝 크게 시작해 제자리로 — 마스크가 열리는 동안 안쪽이 반대로 조여들어야 깊이가 생긴다
          .from('[data-media-scale]', { scale: 1.15 }, 0);
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      data-media-reveal=''
      data-stagger={step}
      className={cn(className)}
      {...rest}>
      <div data-media-scale=''>{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/pages/home/ui/MediaReveal/MediaReveal.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: 소비자 import 경로 교체**

`HeroSection.tsx` 와 `WorkSection/ProjectRow.tsx` 에서 `MediaReveal` 을 상대경로로 가져온다 (`../MediaReveal/MediaReveal`).

- [ ] **Step 6: 옛 컴포넌트 삭제와 배럴 정리**

```bash
rm -r src/shared/ui/MediaReveal
```

`src/shared/ui/index.ts` 에서 `MediaReveal` export 줄을 지운다. `Media.tsx` 헤더 주석의 `MediaReveal` 언급은 컴포넌트 이름이라 그대로 둔다.

- [ ] **Step 7: 짝이 되는 CSS 규칙 삭제**

`motion.css` 에서 `[data-media-reveal]`·`[data-media-reveal='out']`·`[data-media-reveal='in']`·`[data-media-scale]`·`[data-media-scale='out']`·`[data-media-scale='in']` 여섯 블록을 지운다.

- [ ] **Step 8: 전체 검증**

Run: `npm run test && npm run type-check && npm run fsd`
Expected: 모두 통과

- [ ] **Step 9: 눈으로 확인**

```bash
npm run dev
```

Work 섹션 썸네일에서 덮개가 아래로 열리며 안쪽 이미지가 조여드는지, 두 층이 어긋나지 않는지 본다.

- [ ] **Step 10: 커밋**

```bash
git add src/pages/home/ui src/shared/ui src/shared/styles/motion.css
git commit -m "refactor: move MediaReveal into home slice and drive it with gsap"
```

---

## Task 6: RevealText — 이동 + GSAP 네이티브 stagger

**Files:**
- Create: `src/pages/home/ui/RevealText/RevealText.tsx`
- Create: `src/pages/home/ui/RevealText/RevealText.test.tsx`
- Delete: `src/shared/ui/RevealText/` (전체)
- Modify: `src/shared/ui/index.ts`
- Modify: `src/pages/home/ui/IntroductionSection/IntroductionSection.tsx`

**Interfaces:**
- Consumes: `gsap`, `useGSAP`, `MOTION` from `../../lib`
- Produces: `RevealText({ children: string, unit?, once?, className?, ...rest })`

- [ ] **Step 1: 테스트를 옮기고 새 계약으로 바꾼다**

Create `src/pages/home/ui/RevealText/RevealText.test.tsx`:

```tsx
/** RevealText 테스트 — 분리 단위와 "원문은 한 번만 읽힌다" 는 접근성 계약을 검증한다 */
import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RevealText } from './RevealText';

describe('RevealText', () => {
  it('원문은 스크린리더용으로 한 번만 남고 조각은 감춘다', () => {
    const { container } = render(
      <RevealText unit='word'>안녕 세상</RevealText>
    );

    const readable = container.querySelector('.sr-only');
    const decorative = container.querySelector('[aria-hidden="true"]');

    expect(readable).toHaveTextContent('안녕 세상');
    expect(decorative).toHaveTextContent('안녕 세상');
    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(2);
  });

  it('word 단위는 어절 수만큼 조각을 만든다', () => {
    const { container } = render(
      <RevealText unit='word'>세 어절 문장</RevealText>
    );

    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(3);
  });

  it('character 단위는 글자 수만큼 조각을 만든다', () => {
    const { container } = render(
      <RevealText unit='character'>가나다</RevealText>
    );

    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(3);
  });

  it('character 단위는 결합 문자를 쪼개지 않는다', () => {
    // 코드 포인트로 자르면 결합 악센트와 ZWJ 이모지가 조각마다 흩어져 글자 모양이 깨진다
    const { container } = render(
      <RevealText unit='character'>{'é👨‍👩‍👧'}</RevealText>
    );

    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(2);
  });

  it('line 단위는 개행으로 쪼갠다', () => {
    const { container } = render(
      <RevealText unit='line'>{'첫 줄\n둘째 줄'}</RevealText>
    );

    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(2);
  });

  it('서버 렌더 결과에는 은닉 상태가 없다', () => {
    const html = renderToStaticMarkup(
      <RevealText unit='word'>서버에서 온 문장</RevealText>
    );

    expect(html).toContain('서버에서 온 문장');
    expect(html).not.toContain('visibility');
    expect(html).not.toContain('opacity');
  });
});
```

`'stagger 배수는 최대 단계에서 멈춘다'` 케이스는 옮기지 않는다 — 조각 시차를 GSAP `stagger.amount` 가 총량으로 자르므로 조각마다 배수를 셀 이유가 없다.

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npx vitest run src/pages/home/ui/RevealText/RevealText.test.tsx`
Expected: FAIL — `Failed to resolve import "./RevealText"`

- [ ] **Step 3: RevealText 작성**

Create `src/pages/home/ui/RevealText/RevealText.tsx`:

```tsx
'use client';

/** 텍스트 등장 — 각 조각의 바깥이 overflow, 안쪽이 y 를 소유한다 */
import {
  Fragment,
  useRef,
  type ComponentPropsWithoutRef,
} from 'react';
import { cn } from '@/shared/lib';
import { MOTION, gsap, useGSAP } from '../../lib';

/** character 는 조각 사이에 줄바꿈 기회가 없다 — 한 줄에 들어가는 짧은 문구에만 쓴다 */
type RevealUnit = 'line' | 'word' | 'character';

/** ref 는 열지 않는다 — 루트 ref 는 애니메이션 scope 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
type RevealTextProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  children: string;
  unit?: RevealUnit;
  once?: boolean;
};

// line 은 블록으로 쌓이고 word·character 는 줄 안에서 흘러야 한다
const UNIT_DISPLAY = {
  line: 'block',
  word: 'inline-block',
  character: 'inline-block',
} as const;

// 코드 포인트가 아니라 사람이 한 글자로 보는 단위로 자른다 — Array.from 은 결합 악센트·ZWJ 이모지를 흩어놓는다
const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

/** 줄은 개행 기준이다 — 렌더 폭에 따른 실제 줄바꿈 위치는 측정 없이 알 수 없다 */
const splitText = (text: string, unit: RevealUnit): string[] => {
  if (unit === 'line') {
    return text.split('\n');
  }

  if (unit === 'word') {
    return text.split(' ');
  }

  return Array.from(graphemes.segment(text), (segment) => {
    return segment.segment;
  });
};

/** 문장을 조각내 순차로 밀어 올리는 등장 — 조각은 장식이고 원문은 sr-only 사본이 담당한다 */
export function RevealText({
  children,
  unit = 'line',
  once = true,
  className,
  ...rest
}: RevealTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const parts = splitText(children, unit);
  const display = UNIT_DISPLAY[unit];

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 오버행만큼 더 내려야 한다 — 100% 만 내리면 디센더 여백에 글자 윗동이 비친다
        const overhang =
          getComputedStyle(root).getPropertyValue('--mask-overhang').trim() ||
          '0px';

        gsap.from('[data-reveal]', {
          yPercent: 100,
          y: overhang,
          duration: MOTION.duration.reveal,
          ease: MOTION.ease.reveal,
          // amount 가 총 시차를 자른다 — 조각이 많아도 마지막이 하염없이 밀리지 않는다
          stagger: { each: MOTION.stagger.step, amount: MOTION.stagger.total },
          scrollTrigger: { trigger: root, start: 'top 85%', once },
        });
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return (
    <span
      ref={rootRef}
      className={cn('block break-keep', className)}
      {...rest}>
      <span className='sr-only'>{children}</span>
      <span aria-hidden='true'>
        {parts.map((part, index) => {
          return (
            <Fragment key={`${index}-${part}`}>
              <span className={cn('mask-track', display)}>
                {/* 은닉 스타일이 마크업에 없다 — gsap.from 이 마운트 뒤에 시작 상태를 심는다 */}
                <span
                  data-reveal=''
                  className={cn(
                    display,
                    // 공백 자체가 조각이 되는 유일한 단위라 접힘을 막아야 한다
                    unit === 'character' && 'whitespace-pre'
                  )}>
                  {part}
                </span>
              </span>
              {/* 어절 사이 공백은 트랙 밖의 진짜 텍스트 노드여야 한다 — 안에 넣으면 접히고 줄바꿈 기회도 사라진다 */}
              {unit === 'word' && index < parts.length - 1 ? ' ' : null}
            </Fragment>
          );
        })}
      </span>
    </span>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/pages/home/ui/RevealText/RevealText.test.tsx`
Expected: PASS (6 tests)

- [ ] **Step 5: 소비자 import 경로 교체와 옛 컴포넌트 삭제**

`IntroductionSection.tsx` 에서 `RevealText` 를 `../RevealText/RevealText` 로 가져온다.

```bash
rm -r src/shared/ui/RevealText
```

`src/shared/ui/index.ts` 에서 `RevealText` export 줄을 지운다.

- [ ] **Step 6: 전체 검증**

Run: `npm run test && npm run type-check && npm run fsd`
Expected: 모두 통과

- [ ] **Step 7: 눈으로 확인**

```bash
npm run dev
```

Introduction 문장이 조각 단위로 순차 등장하는지, 조각이 많아도 마지막이 과하게 늦지 않는지 본다.

- [ ] **Step 8: 커밋**

```bash
git add src/pages/home/ui src/shared/ui
git commit -m "refactor: move RevealText into home slice with native gsap stagger"
```

---

## Task 7: 정리 — 죽은 코드와 남은 CSS 규칙

**Files:**
- Delete: `src/shared/ui/Parallax/`, `src/shared/ui/Marquee/`, `src/shared/lib/useInView.ts`, `src/shared/lib/useInView.test.ts`
- Modify: `src/shared/ui/index.ts`, `src/shared/lib/index.ts`, `src/shared/styles/motion.css`

- [ ] **Step 1: 소비자가 정말 0인지 확인**

```bash
grep -rn "Parallax\|Marquee\|useInView\|InViewState" src app --include='*.ts' --include='*.tsx'
```

Expected: `src/shared/ui/Parallax/`·`src/shared/ui/Marquee/`·`src/shared/lib/useInView*` 안쪽과 배럴 export 줄만 나온다. 다른 소비자가 나오면 멈추고 보고한다.

- [ ] **Step 2: 삭제**

```bash
rm -r src/shared/ui/Parallax src/shared/ui/Marquee
rm src/shared/lib/useInView.ts src/shared/lib/useInView.test.ts
```

- [ ] **Step 3: 배럴 정리**

`src/shared/ui/index.ts` 를 아래로 만든다.

```ts
export { Container } from './Container/Container';
export { Button } from './Button/Button';
export { ShowcaseButton } from './ShowcaseButton/ShowcaseButton';
export { SectionHeading } from './SectionHeading/SectionHeading';
export { Media, type MediaRatio } from './Media/Media';
```

`src/shared/lib/index.ts` 에서 `useInView` 줄을 지워 아래로 만든다.

```ts
export { useSearchParams, usePathname, useRouter } from './navigation';
export { cn } from './cn';
```

- [ ] **Step 4: 남은 마퀴 CSS 삭제**

`motion.css` 에서 `@keyframes marquee-shift`, `@utility marquee-track`, `[data-marquee-direction='right']`, `[data-marquee-speed='slow'|'normal'|'fast']`, `[data-marquee-paused='true']` 를 지운다.

- [ ] **Step 5: 스크롤 반응 CSS 가 0인지 확인**

```bash
grep -rn "animation-timeline\|data-parallax\|data-marquee" src
```

Expected: 결과 없음. 하나라도 남으면 GSAP 관성과 시간축이 갈린다.

- [ ] **Step 6: cn 레지스트리 확인**

`src/shared/lib/cn.ts` 의 `ease`·`duration` 레지스트리는 **그대로 둔다** — `ease-standard`·`duration-quick` 유틸리티를 버튼과 링크가 계속 쓴다.

Run: `npx vitest run src/shared/lib/cn.test.ts`
Expected: PASS

- [ ] **Step 7: 전체 검증**

Run: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`
Expected: 모두 통과

- [ ] **Step 8: 커밋**

```bash
git add src/shared src/pages
git commit -m "refactor: drop unused effect components and css scroll rules"
```

---

## Task 8: Storybook 을 프리미티브만 남긴다

GSAP 작업과 독립적이라 커밋을 분리한다.

**Files:**
- Delete: `src/pages/home/ui/**/*.stories.tsx` (5개)

- [ ] **Step 1: 대상 확인**

```bash
find src/pages -name '*.stories.tsx'
```

Expected: `ContactSection` · `GallerySection` · `HeroSection` · `IntroductionSection` · `WorkSection` 5개

- [ ] **Step 2: 삭제**

```bash
find src/pages -name '*.stories.tsx' -delete
```

- [ ] **Step 3: 남은 스토리가 프리미티브와 Foundation 뿐인지 확인**

```bash
find src -name '*.stories.tsx' | sort
```

Expected: `Button` · `Container` · `Media` · `SectionHeading` · `ShowcaseButton` · `Foundation` 6개

- [ ] **Step 4: Storybook 빌드 확인**

```bash
npm run build-storybook
```

Expected: 성공

- [ ] **Step 5: 커밋**

```bash
git add src/pages
git commit -m "chore: keep storybook to shared primitives"
```

---

## 마무리 검증

- [ ] `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build` 통과
- [ ] `npm run format` 실행 후 diff 확인
- [ ] dev 서버에서 관성 스크롤 · Rail 양방향 흐름 · Reveal 3종 동작 확인
- [ ] 시스템 "동작 줄이기" 켜고 새로고침 — 모션이 전부 멈추고 Rail 이 그리드로 접히며 콘텐츠 손실 없음
- [ ] 브라우저 JS 끄고 새로고침 — 홈 콘텐츠가 전부 보임
- [ ] 375 / 768 / 1440px 에서 가로 오버플로 없음
