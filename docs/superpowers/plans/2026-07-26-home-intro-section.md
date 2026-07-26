# 홈 섹션 1 — 소개 화면과 장면 배경 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈의 첫 섹션을 프라하 도시 실루엣 배경 위의 소개 화면으로 만들고, 스크롤에 비례해 배경이 좌 → 우로 흐르게 한다.

**Architecture:** 배경은 `widgets/scene-backdrop` 위젯이 담당한다. 장면·겹 데이터는 `config/scenes.ts` 에 모으고, GSAP 을 아는 파일은 `useHorizontalParallax.ts` 하나뿐이다. 훅은 핀 대상 ref 를 인자로 받아 위젯이 특정 페이지에 결합되지 않게 한다. 색은 값이 아니라 역할(`scenery.far/mid/near`)로 두어 라이트 모드가 토큰만으로 따라온다.

**Tech Stack:** Next.js App Router, GSAP 3.15 + ScrollTrigger + `@gsap/react`, vanilla-extract, Vitest + RTL.

**스펙:** [2026-07-26-home-intro-section-design.md](../specs/2026-07-26-home-intro-section-design.md)

## Global Constraints

- 주석은 [comment-convention.md](../../conventions/comment-convention.md) 를 따른다 — 파일 헤더와 모든 export 는 단일 라인 JSDoc(`/** ... */`), 본문 안 비자명 로직만 한 줄 `//` 로 WHY. 멀티라인 블록·`@param`·코드 받아쓰기 금지.
- 화살표 함수 본문은 **블록형**(`=> { return ...; }`)으로 쓴다. 레포 ESLint 가 `arrow-body-style: always` 다.
- `describe`·`it` 설명문은 한국어. 컴포넌트명·prop 같은 고유 식별자만 영문.
- `.css.ts` 에 raw 색·raw 치수를 쓰지 않는다. `no-raw-design-values` 규칙이 **error** 다. 색은 `vars.color.*`, 치수는 `vars.dimension.*`·`vars.spacing.*`·`vars.container.*`.
- 컴포넌트별 배럴을 만들지 않는다. 슬라이스 `index.ts` 가 파일을 직접 re-export 한다.
- `useState`·`useRef`·GSAP 을 쓰는 컴포넌트에는 `'use client'` 를 반드시 넣는다. 누락은 vitest·tsc 가 잡지 못하고 `npm run build` 에서만 드러난다.
- 검증은 `npm run fsd`, `npm run lint`, `npm run type-check`, `npm run test`, `npx prettier --write <파일>` 로 한다. **`npm run build` 는 로컬 Supabase(127.0.0.1:54321) 가 떠 있어야 하므로 각 태스크의 기본 검증에서 제외한다** — 단 Task 7 은 예외로 build 를 돌린다(`'use client'` 누락은 build 만 잡는다).
- 커밋은 하되 push 는 하지 않는다.

---

### Task 1: `scenery` 색 토큰 3종 추가

실루엣 겹의 색을 역할로 고정한다. 데이터에 hex 를 박으면 라이트 모드가 따라오지 않는다.

**Files:**

- Modify: `src/shared/styles/tokens/color/semantic.ts`
- Modify: `src/shared/styles/theme.css.ts`
- Test: `src/shared/styles/tokens/tokens.test.ts`

**Interfaces:**

- Produces: `vars.color.scenery.far`, `vars.color.scenery.mid`, `vars.color.scenery.near` — Task 3 의 `.css.ts` 가 소비한다.

- [ ] **Step 1: 실패하는 테스트 작성**

`src/shared/styles/tokens/tokens.test.ts` 끝에 추가한다.

```ts
describe('scenery 토큰', () => {
  it('light·night 모두 far·mid·near 를 채운다', () => {
    for (const theme of [lightColor, nightColor]) {
      expect(theme.scenery.far).toMatch(/^#/);
      expect(theme.scenery.mid).toMatch(/^#/);
      expect(theme.scenery.near).toMatch(/^#/);
    }
  });

  it('공기원근을 위해 far·mid·near 가 서로 다른 값이다', () => {
    for (const theme of [lightColor, nightColor]) {
      const tones = new Set([theme.scenery.far, theme.scenery.mid, theme.scenery.near]);
      expect(tones.size).toBe(3);
    }
  });
});
```

파일 상단 import 에 `lightColor`·`nightColor` 가 없으면 추가한다.

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/styles/tokens/tokens.test.ts`
Expected: FAIL — `theme.scenery` 가 undefined.

- [ ] **Step 3: `SemanticColor` 에 `scenery` 추가**

`src/shared/styles/tokens/color/semantic.ts` 의 `SemanticColor` 인터페이스에서 `stroke` 블록 **뒤에** 추가한다.

```ts
  scenery: {
    far: string;
    mid: string;
    near: string;
  };
```

- [ ] **Step 4: 두 테마에 값 주입**

같은 파일 `lightColor` 의 `stroke` 블록 뒤에 추가한다. 대낮에는 먼 것일수록 옅고 밝다.

```ts
  scenery: {
    far: palette.sand[300],
    mid: palette.clay[300],
    near: palette.clay[500],
  },
```

`nightColor` 의 `stroke` 블록 뒤에 추가한다. 밤에는 먼 것일수록 어둡고 탁하다.

```ts
  scenery: {
    far: palette.sand[800],
    mid: palette.clay[900],
    near: palette.clay[700],
  },
```

- [ ] **Step 5: 컨트랙트 확장**

`src/shared/styles/theme.css.ts` 의 `createThemeContract` 안, `stroke` 블록 뒤에 추가한다.

```ts
    scenery: {
      far: null,
      mid: null,
      near: null,
    },
```

- [ ] **Step 6: 테스트 통과 확인**

Run: `npx vitest run src/shared/styles/tokens/tokens.test.ts`
Expected: PASS

- [ ] **Step 7: 검증 + 커밋**

```bash
npx prettier --write src/shared/styles/tokens/color/semantic.ts src/shared/styles/theme.css.ts src/shared/styles/tokens/tokens.test.ts
npm run lint && npm run type-check && npm run test
git add src/shared/styles
git commit -m "feat(tokens): add scenery far/mid/near colors for silhouette layers"
```

---

### Task 2: 장면 데이터 모델과 도시 장면

**Files:**

- Create: `src/widgets/scene-backdrop/model/types.ts`
- Create: `src/widgets/scene-backdrop/config/scenes.ts`
- Create: `src/widgets/scene-backdrop/model/parallax.ts`
- Test: `src/widgets/scene-backdrop/model/parallax.test.ts`

**Interfaces:**

- Produces:
  - `type SceneTone = 'far' | 'mid' | 'near'`
  - `interface SceneLayer { id: string; depth: number; path: string; tone: SceneTone; desktopOnly?: boolean }`
  - `interface Scene { id: string; viewBox: string; layers: SceneLayer[] }`
  - `const cityScene: Scene`
  - `interface ParallaxConfig { pin: boolean; travelRatio: number }`
  - `resolveParallaxConfig(conditions: { isDesktop: boolean; reduceMotion: boolean }): ParallaxConfig | null`
  - `layerShift(depth: number, progress: number, travel: number): number`

- [ ] **Step 1: 실패하는 테스트 작성**

Create `src/widgets/scene-backdrop/model/parallax.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { layerShift, resolveParallaxConfig } from './parallax';

describe('resolveParallaxConfig', () => {
  it('reduced-motion 이면 null 을 돌려 핀과 이동을 모두 끈다', () => {
    expect(resolveParallaxConfig({ isDesktop: true, reduceMotion: true })).toBeNull();
    expect(resolveParallaxConfig({ isDesktop: false, reduceMotion: true })).toBeNull();
  });

  it('모바일에서도 핀을 유지하되 이동 거리는 데스크톱보다 짧다', () => {
    const desktop = resolveParallaxConfig({ isDesktop: true, reduceMotion: false });
    const mobile = resolveParallaxConfig({ isDesktop: false, reduceMotion: false });

    expect(desktop?.pin).toBe(true);
    expect(mobile?.pin).toBe(true);
    expect(mobile!.travelRatio).toBeLessThan(desktop!.travelRatio);
  });
});

describe('layerShift', () => {
  it('진행도 0 에서는 움직이지 않는다', () => {
    expect(layerShift(0.5, 0, 800)).toBe(0);
  });

  it('depth 가 클수록 같은 진행도에서 더 많이 움직인다', () => {
    expect(layerShift(0.6, 1, 800)).toBeGreaterThan(layerShift(0.2, 1, 800));
  });

  it('depth 0 인 겹은 진행도와 무관하게 고정된다', () => {
    expect(layerShift(0, 1, 800)).toBe(0);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/widgets/scene-backdrop/model/parallax.test.ts`
Expected: FAIL — `./parallax` 모듈 없음.

- [ ] **Step 3: 타입 계약 작성**

Create `src/widgets/scene-backdrop/model/types.ts`:

```ts
/** scene-backdrop 타입 — 장면과 겹의 데이터 계약 */

/** 겹의 색 역할 — 실제 값은 .css.ts 가 토큰에서 매핑한다 */
export type SceneTone = 'far' | 'mid' | 'near';

/** 배경 한 겹 — depth 0 은 고정, 1 은 스크롤과 동속 */
export interface SceneLayer {
  id: string;
  depth: number;
  path: string;
  tone: SceneTone;
  desktopOnly?: boolean;
}

/** 장면 하나 — 겹의 모음과 공유 SVG 좌표계 */
export interface Scene {
  id: string;
  viewBox: string;
  layers: SceneLayer[];
}
```

- [ ] **Step 4: 파랄랙스 계산 작성**

Create `src/widgets/scene-backdrop/model/parallax.ts`:

```ts
/** 파랄랙스 계산 — GSAP 에 넘길 값을 순수 함수로 뽑아 테스트 가능하게 둔다 */

/** matchMedia 조건 한 벌 */
export interface ParallaxConditions {
  isDesktop: boolean;
  reduceMotion: boolean;
}

/** 조건이 확정한 연출 설정 */
export interface ParallaxConfig {
  pin: boolean;
  travelRatio: number;
}

/** 조건별 연출 설정 — reduced-motion 은 null 이라 핀도 걸지 않는다 */
export function resolveParallaxConfig(conditions: ParallaxConditions): ParallaxConfig | null {
  // 이동만 끄고 핀을 남기면 정지 화면이 스크럽 거리만큼 붙잡혀 "먹통" 구간이 된다
  if (conditions.reduceMotion) {
    return null;
  }

  // 세로로 긴 모바일에서는 같은 비율로 밀면 실루엣이 과하게 잘린다
  return { pin: true, travelRatio: conditions.isDesktop ? 0.6 : 0.25 };
}

/** 겹 하나의 수평 이동 거리(px) — depth 가 깊이감을 만든다 */
export function layerShift(depth: number, progress: number, travel: number): number {
  return depth * progress * travel;
}
```

- [ ] **Step 5: 도시 장면 데이터 작성**

Create `src/widgets/scene-backdrop/config/scenes.ts`:

```ts
/** 장면 데이터 — 배경 튜닝은 대부분 이 파일에서 끝난다 */
import type { Scene } from '../model/types';

/** 섹션 1 배경 — 황혼의 프라하 도시 실루엣. 첨탑·돔은 가장 먼 겹에 얹혀 있다 */
export const cityScene: Scene = {
  id: 'city',
  viewBox: '0 0 860 480',
  layers: [
    {
      id: 'far',
      depth: 0.2,
      tone: 'far',
      path: 'M300,348 L300,302 A26,26 0 0 1 352,302 L352,348 Z M326,282 L320,302 L332,302 Z M560,312 L612,312 L612,348 L560,348 Z M562,318 L562,286 L568,248 L574,286 L574,318 Z M598,318 L598,286 L604,248 L610,286 L610,318 Z M0,480 L0,345 L60,345 L88,325 L116,345 L190,345 L190,338 L240,338 L268,318 L296,338 L370,338 L370,346 L430,346 L462,322 L494,346 L560,346 L560,340 L620,340 L648,320 L676,340 L750,340 L750,348 L810,348 L836,330 L860,348 L860,480 Z',
    },
    {
      id: 'mid',
      depth: 0.45,
      tone: 'mid',
      desktopOnly: true,
      path: 'M0,480 L0,392 L70,392 L100,370 L130,392 L210,392 L210,386 L280,386 L310,364 L340,386 L420,386 L420,394 L500,394 L532,372 L564,394 L640,394 L640,388 L700,388 L730,368 L760,388 L860,388 L860,480 Z',
    },
    {
      id: 'near',
      depth: 0.8,
      tone: 'near',
      path: 'M0,480 L0,432 L90,432 L124,410 L158,432 L260,432 L260,426 L340,426 L372,406 L404,426 L500,426 L500,434 L590,434 L624,412 L658,434 L860,434 L860,480 Z',
    },
  ],
};
```

- [ ] **Step 6: 테스트 통과 확인**

Run: `npx vitest run src/widgets/scene-backdrop/model/parallax.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 7: 검증 + 커밋**

```bash
npx prettier --write src/widgets/scene-backdrop
npm run lint && npm run type-check
git add src/widgets/scene-backdrop
git commit -m "feat(scene-backdrop): add scene data model and city silhouette layers"
```

---

### Task 3: `SceneLayer` 렌더 컴포넌트

겹 하나를 SVG `path` 로 그린다. GSAP 을 모르는 순수 컴포넌트다.

**Files:**

- Create: `src/widgets/scene-backdrop/ui/SceneLayer/SceneLayer.tsx`
- Create: `src/widgets/scene-backdrop/ui/SceneLayer/SceneLayer.css.ts`
- Test: `src/widgets/scene-backdrop/ui/SceneLayer/SceneLayer.test.tsx`

**Interfaces:**

- Consumes: `SceneLayer` 타입 (Task 2)
- Produces: `<SceneLayer layer={…} />` — Task 4 가 소비한다. `data-layer-id` 속성으로 GSAP 이 겹을 찾는다.

- [ ] **Step 1: 실패하는 테스트 작성**

Create `src/widgets/scene-backdrop/ui/SceneLayer/SceneLayer.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SceneLayer } from './SceneLayer';

const baseLayer = {
  id: 'far',
  depth: 0.2,
  tone: 'far' as const,
  path: 'M0,0 L10,10 Z',
};

describe('SceneLayer', () => {
  it('겹 id 를 data 속성으로 노출해 GSAP 이 찾을 수 있게 한다', () => {
    const { container } = render(
      <svg>
        <SceneLayer layer={baseLayer} />
      </svg>,
    );

    expect(container.querySelector('[data-layer-id="far"]')).not.toBeNull();
  });

  it('path 좌표를 그대로 전달한다', () => {
    const { container } = render(
      <svg>
        <SceneLayer layer={baseLayer} />
      </svg>,
    );

    expect(container.querySelector('path')?.getAttribute('d')).toBe('M0,0 L10,10 Z');
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/widgets/scene-backdrop/ui/SceneLayer`
Expected: FAIL — `./SceneLayer` 모듈 없음.

- [ ] **Step 3: 스타일 작성**

Create `src/widgets/scene-backdrop/ui/SceneLayer/SceneLayer.css.ts`:

```ts
/** SceneLayer 스타일 — tone 역할을 토큰 색으로 매핑하고, 모바일 생략을 CSS 로 처리한다 */
import { bp } from '@/shared/styles/breakpoints';
import { vars } from '@/shared/styles/theme.css';
import { style, styleVariants } from '@vanilla-extract/css';

/** 겹 공통 — 이동은 GSAP 이 인라인 transform 으로 넣는다 */
export const layer = style({
  transformBox: 'fill-box',
});

/** tone 역할 → 토큰 색. 값을 데이터에 박지 않아 라이트 모드가 자동으로 따라온다 */
export const tone = styleVariants({
  far: { fill: vars.color.scenery.far },
  mid: { fill: vars.color.scenery.mid },
  near: { fill: vars.color.scenery.near },
});

/** 데스크톱 전용 겹 — 렌더 여부는 GSAP 과 무관하므로 CSS 로 감춰 하이드레이션을 지킨다 */
export const desktopOnly = style({
  display: 'none',
  '@media': {
    [bp.md]: {
      display: 'block',
    },
  },
});
```

- [ ] **Step 4: 컴포넌트 작성**

Create `src/widgets/scene-backdrop/ui/SceneLayer/SceneLayer.tsx`:

```tsx
/** SceneLayer — 배경 실루엣 한 겹을 SVG path 로 그린다 */
import type { SceneLayer as SceneLayerData } from '../../model/types';
import * as s from './SceneLayer.css';

/** 겹 하나 — 색은 tone 역할로, 모바일 생략은 CSS 로 결정된다 */
export function SceneLayer({ layer }: { layer: SceneLayerData }) {
  return (
    <path
      d={layer.path}
      data-layer-id={layer.id}
      className={[s.layer, s.tone[layer.tone], layer.desktopOnly ? s.desktopOnly : '']
        .filter(Boolean)
        .join(' ')}
    />
  );
}
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/widgets/scene-backdrop/ui/SceneLayer`
Expected: PASS (2 tests)

- [ ] **Step 6: 검증 + 커밋**

```bash
npx prettier --write src/widgets/scene-backdrop
npm run lint && npm run type-check
git add src/widgets/scene-backdrop
git commit -m "feat(scene-backdrop): add SceneLayer with token-mapped tones"
```

---

### Task 4: `SceneBackdrop` 조립

장면을 받아 겹을 렌더한다. 아직 GSAP 을 연결하지 않는다 — 정적으로 먼저 세운다.

**Files:**

- Create: `src/widgets/scene-backdrop/ui/SceneBackdrop/SceneBackdrop.tsx`
- Create: `src/widgets/scene-backdrop/ui/SceneBackdrop/SceneBackdrop.css.ts`
- Create: `src/widgets/scene-backdrop/index.ts`
- Test: `src/widgets/scene-backdrop/ui/SceneBackdrop/SceneBackdrop.test.tsx`

**Interfaces:**

- Consumes: `Scene` 타입과 `cityScene` (Task 2), `SceneLayer` 컴포넌트 (Task 3)
- Produces: `<SceneBackdrop scene={…} sectionRef={…} />` — Task 6 이 소비한다. 슬라이스 `index.ts` 가 `SceneBackdrop` 와 `cityScene` 을 re-export 한다.

- [ ] **Step 1: 실패하는 테스트 작성**

Create `src/widgets/scene-backdrop/ui/SceneBackdrop/SceneBackdrop.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { cityScene } from '../../config/scenes';
import { SceneBackdrop } from './SceneBackdrop';

describe('SceneBackdrop', () => {
  it('장면 데이터의 겹 개수만큼 path 를 렌더한다', () => {
    const { container } = render(
      <SceneBackdrop
        scene={cityScene}
        sectionRef={createRef<HTMLElement>()}
      />,
    );

    expect(container.querySelectorAll('path')).toHaveLength(cityScene.layers.length);
  });

  it('장면의 viewBox 를 SVG 에 그대로 전달한다', () => {
    const { container } = render(
      <SceneBackdrop
        scene={cityScene}
        sectionRef={createRef<HTMLElement>()}
      />,
    );

    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe(cityScene.viewBox);
  });

  it('장식 요소이므로 스크린리더에서 감춘다', () => {
    const { container } = render(
      <SceneBackdrop
        scene={cityScene}
        sectionRef={createRef<HTMLElement>()}
      />,
    );

    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/widgets/scene-backdrop/ui/SceneBackdrop`
Expected: FAIL — `./SceneBackdrop` 모듈 없음.

- [ ] **Step 3: 스타일 작성**

Create `src/widgets/scene-backdrop/ui/SceneBackdrop/SceneBackdrop.css.ts`:

```ts
/** SceneBackdrop 스타일 — 섹션 하단에 깔리는 전폭 실루엣 배경 */
import { style } from '@vanilla-extract/css';

/** 배경 컨테이너 — 텍스트 뒤에 깔리고 포인터 이벤트를 받지 않는다 */
export const backdrop = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
});

/** 실루엣 SVG — 좌우로 밀리므로 화면보다 넓게 잡는다 */
export const canvas = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
});
```

- [ ] **Step 4: 컴포넌트 작성**

Create `src/widgets/scene-backdrop/ui/SceneBackdrop/SceneBackdrop.tsx`:

```tsx
/** SceneBackdrop — 장면 하나를 겹으로 조립해 섹션 배경으로 깐다 */
'use client';

import type { RefObject } from 'react';
import type { Scene } from '../../model/types';
import { SceneLayer } from '../SceneLayer/SceneLayer';
import * as s from './SceneBackdrop.css';

/** 배경 조립 — sectionRef 는 핀 대상이며 소유자는 소비하는 섹션이다 */
export function SceneBackdrop({
  scene,
  sectionRef,
}: {
  scene: Scene;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  return (
    <div className={s.backdrop}>
      <svg
        className={s.canvas}
        viewBox={scene.viewBox}
        preserveAspectRatio='xMidYMax slice'
        aria-hidden='true'>
        {scene.layers.map((layer) => {
          return (
            <SceneLayer
              key={layer.id}
              layer={layer}
            />
          );
        })}
      </svg>
    </div>
  );
}
```

`sectionRef` 는 Task 5 에서 훅에 넘긴다. 이번 태스크에서는 계약만 세워 두고 쓰지 않는다 — 미사용 prop 이 lint 에 걸리면 Task 5 에서 즉시 해소되므로, 걸릴 경우 Task 5 를 이어서 진행한다.

- [ ] **Step 5: 슬라이스 공개 API 작성**

Create `src/widgets/scene-backdrop/index.ts`:

```ts
/** scene-backdrop 위젯 공개 API — 장면 배경과 기본 장면 데이터 */
export { SceneBackdrop } from './ui/SceneBackdrop/SceneBackdrop';
export { cityScene } from './config/scenes';
export type { Scene, SceneLayer, SceneTone } from './model/types';
```

- [ ] **Step 6: 테스트 통과 확인**

Run: `npx vitest run src/widgets/scene-backdrop`
Expected: PASS (11 tests 누적)

- [ ] **Step 7: 검증 + 커밋**

```bash
npx prettier --write src/widgets/scene-backdrop
npm run fsd && npm run lint && npm run type-check
git add src/widgets/scene-backdrop
git commit -m "feat(scene-backdrop): assemble SceneBackdrop with slice public API"
```

---

### Task 5: `useHorizontalParallax` — GSAP 배선

이 레포에서 **GSAP 을 아는 유일한 파일**을 만든다.

**Files:**

- Modify: `src/shared/lib/gsap/index.ts`
- Create: `src/widgets/scene-backdrop/model/useHorizontalParallax.ts`
- Modify: `src/widgets/scene-backdrop/ui/SceneBackdrop/SceneBackdrop.tsx`

**Interfaces:**

- Consumes: `resolveParallaxConfig`, `layerShift`, `Scene` (Task 2)
- Produces: `useHorizontalParallax({ scene, sectionRef, scopeRef })` — `SceneBackdrop` 내부에서만 호출한다.

- [ ] **Step 1: ScrollTrigger 등록**

`src/shared/lib/gsap/index.ts` 를 다음으로 교체한다.

```ts
'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, useGSAP, ScrollTrigger };
```

- [ ] **Step 2: 훅 작성**

Create `src/widgets/scene-backdrop/model/useHorizontalParallax.ts`:

```ts
/** 스크롤을 배경의 수평 이동으로 바꾸는 훅 — 이 위젯에서 GSAP 을 아는 유일한 파일 */
'use client';

import type { RefObject } from 'react';
import { bp } from '@/shared/styles/breakpoints';
import { gsap, useGSAP } from '@/shared/lib/gsap';
import { layerShift, resolveParallaxConfig } from './parallax';
import type { Scene } from './types';

/** 훅 인자 — 핀 대상과 애니메이션 스코프를 분리해 위젯이 페이지에 결합되지 않게 한다 */
export interface HorizontalParallaxOptions {
  scene: Scene;
  sectionRef: RefObject<HTMLElement | null>;
  scopeRef: RefObject<HTMLElement | null>;
}

/** 섹션을 핀하고 그동안의 스크롤을 겹별 수평 이동으로 변환한다 */
export function useHorizontalParallax({
  scene,
  sectionRef,
  scopeRef,
}: HorizontalParallaxOptions): void {
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const mm = gsap.matchMedia();

      // 브레이크포인트와 reduced-motion 을 같은 문법으로 다루고, 조건이 바뀌면 GSAP 이 되돌린다
      mm.add(
        {
          isDesktop: bp.md,
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };

          const config = resolveParallaxConfig({ isDesktop, reduceMotion });
          if (!config) {
            return;
          }

          const travel = window.innerWidth * config.travelRatio;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${travel}`,
              pin: config.pin,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          for (const layer of scene.layers) {
            timeline.to(
              `[data-layer-id="${layer.id}"]`,
              { x: layerShift(layer.depth, 1, travel), ease: 'none' },
              0,
            );
          }
        },
      );
    },
    { scope: scopeRef, dependencies: [scene] },
  );
}
```

- [ ] **Step 3: `SceneBackdrop` 에 훅 연결**

`SceneBackdrop.tsx` 를 다음으로 교체한다.

```tsx
/** SceneBackdrop — 장면 하나를 겹으로 조립해 섹션 배경으로 깐다 */
'use client';

import { useRef, type RefObject } from 'react';
import type { Scene } from '../../model/types';
import { useHorizontalParallax } from '../../model/useHorizontalParallax';
import { SceneLayer } from '../SceneLayer/SceneLayer';
import * as s from './SceneBackdrop.css';

/** 배경 조립 — sectionRef 는 핀 대상이며 소유자는 소비하는 섹션이다 */
export function SceneBackdrop({
  scene,
  sectionRef,
}: {
  scene: Scene;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useHorizontalParallax({ scene, sectionRef, scopeRef });

  return (
    <div
      ref={scopeRef}
      className={s.backdrop}>
      <svg
        className={s.canvas}
        viewBox={scene.viewBox}
        preserveAspectRatio='xMidYMax slice'
        aria-hidden='true'>
        {scene.layers.map((layer) => {
          return (
            <SceneLayer
              key={layer.id}
              layer={layer}
            />
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 4: 기존 테스트가 여전히 통과하는지 확인**

Run: `npx vitest run src/widgets/scene-backdrop`
Expected: PASS. jsdom 에는 레이아웃이 없어 ScrollTrigger 가 아무것도 계산하지 못하지만 오류 없이 통과해야 한다. `window.matchMedia` 미정의로 실패하면 `vitest.setup.ts` 에 셔임을 추가한다.

```ts
if (!window.matchMedia) {
  window.matchMedia = (query: string) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {
        return false;
      },
    } as MediaQueryList;
  };
}
```

- [ ] **Step 5: 검증 + 커밋**

```bash
npx prettier --write src/widgets/scene-backdrop src/shared/lib/gsap
npm run fsd && npm run lint && npm run type-check && npm run test
git add src/widgets/scene-backdrop src/shared/lib/gsap vitest.setup.ts
git commit -m "feat(scene-backdrop): wire ScrollTrigger pin and horizontal parallax"
```

---

### Task 6: `IntroSection`

소개 문구와 이미지 자리를 배치하고, 핀 대상 ref 를 소유한다.

**Files:**

- Create: `src/pages/home/ui/IntroSection/IntroSection.tsx`
- Create: `src/pages/home/ui/IntroSection/IntroSection.css.ts`
- Test: `src/pages/home/ui/IntroSection/IntroSection.test.tsx`

**Interfaces:**

- Consumes: `SceneBackdrop`, `cityScene` (Task 4)
- Produces: `<IntroSection />` — Task 7 이 소비한다.

- [ ] **Step 1: 실패하는 테스트 작성**

Create `src/pages/home/ui/IntroSection/IntroSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { profile } from '@/entities/profile';
import { IntroSection } from './IntroSection';

describe('IntroSection', () => {
  it('이름을 페이지 최상위 제목으로 노출한다', () => {
    render(<IntroSection />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name);
  });

  it('소개 문구를 전부 렌더한다', () => {
    render(<IntroSection />);

    for (const line of profile.taglines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  it('배경 실루엣을 함께 깐다', () => {
    const { container } = render(<IntroSection />);

    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/pages/home/ui/IntroSection`
Expected: FAIL — `./IntroSection` 모듈 없음.

- [ ] **Step 3: `profile` 데이터에서 수식어 분리**

`src/entities/profile/model/profile.ts` 의 `name` 을 이름만 남기고, 수식어를 새 필드로 옮긴다.

```ts
  name: '임재준',
  headline: '나무가 아닌 숲을 보는 개발자',
```

`src/entities/profile/model/types.ts` 의 `Profile` 인터페이스에 `headline: string;` 을 `name` 아래에 추가한다. `taglines` 는 마크업(`**볼드**`) 없는 평문으로 바꾼다 — 새 레이아웃은 강조를 활자 크기로 처리한다.

```ts
  taglines: [
    '프로젝트를 기능 구현에 그치지 않고 전체 흐름과 기획 의도까지 바라봅니다.',
    '사용자의 시각에서 UI와 경험을 고민합니다.',
    '근거 없는 코드를 지양하고 합리적인 개발을 지향합니다.',
  ],
```

- [ ] **Step 4: 스타일 작성**

Create `src/pages/home/ui/IntroSection/IntroSection.css.ts`:

```ts
/** IntroSection 스타일 — 전체 화면 소개 섹션, 좌측 문구 · 우측 이미지 비대칭 배치 */
import { bp } from '@/shared/styles/breakpoints';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 섹션 루트 — svh 는 브라우저 크롬이 접혀도 값이 변하지 않아 핀 중 리사이즈되지 않는다 */
export const section = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    px: { mobile: 'x6', tablet: 'x12' },
    bg: 'canvas',
  }),
  {
    position: 'relative',
    minHeight: '100svh',
    overflow: 'hidden',
  },
]);

/** 콘텐츠 열 — 배경 위에 얹히므로 z-index 로 띄운다 */
export const content = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'x8',
  }),
  {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: vars.container.wide,
    marginInline: 'auto',
  },
]);

/** 좌측 문구 묶음 */
export const copy = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x4',
  }),
]);

/** 역할 라벨 — 이펙트를 아끼는 대신 색을 한 곳에만 찍는다 */
export const label = style({
  fontSize: vars.typography.fontSize[12],
  fontWeight: vars.typography.fontWeight.semibold,
  letterSpacing: vars.dimension.x0_5,
  color: vars.color.fg.brand,
});

/** 이름 — 화면에서 가장 큰 활자 */
export const name = style({
  fontSize: vars.typography.fontSize[32],
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.fg.neutral,
  '@media': {
    [bp.md]: {
      fontSize: vars.typography.fontSize[40],
    },
  },
});

/** 소개 문구 목록 */
export const taglines = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x2',
  }),
  {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
]);

/** 소개 문구 한 줄 */
export const tagline = style({
  fontSize: vars.typography.fontSize[16],
  color: vars.color.fg.muted,
});

/** 이미지 자리 — 내용이 정해지기 전까지 비워 둔다 */
export const imageSlot = style({
  display: 'none',
  flexShrink: 0,
  width: vars.container.form,
  aspectRatio: '1 / 1',
  border: `1px dashed ${vars.color.stroke.muted}`,
  borderRadius: vars.radius.control,
  '@media': {
    [bp.md]: {
      display: 'block',
    },
  },
});
```

`fontSize[12]`·`fontSize[32]`·`fontSize[40]`·`radius.control` 이 토큰에 없으면, 있는 가장 가까운 단계로 바꾼다. 새 토큰을 임의로 추가하지 않는다.

- [ ] **Step 5: 컴포넌트 작성**

Create `src/pages/home/ui/IntroSection/IntroSection.tsx`:

```tsx
/** IntroSection — 홈 첫 섹션. 프라하 실루엣 배경 위의 소개 화면 */
'use client';

import { useRef } from 'react';
import { profile } from '@/entities/profile';
import { SceneBackdrop, cityScene } from '@/widgets/scene-backdrop';
import * as s from './IntroSection.css';

/** 소개 섹션 — 핀 대상 ref 를 소유해 배경 위젯에 넘긴다 */
export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className={s.section}>
      <SceneBackdrop
        scene={cityScene}
        sectionRef={sectionRef}
      />
      <div className={s.content}>
        <div className={s.copy}>
          <p className={s.label}>FRONTEND</p>
          <h1 className={s.name}>{profile.name}</h1>
          <ul className={s.taglines}>
            {profile.taglines.map((line) => {
              return (
                <li
                  key={line}
                  className={s.tagline}>
                  {line}
                </li>
              );
            })}
          </ul>
        </div>
        <div
          className={s.imageSlot}
          aria-hidden='true'
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 6: 테스트 통과 확인**

Run: `npx vitest run src/pages/home/ui/IntroSection`
Expected: PASS (3 tests)

- [ ] **Step 7: 검증 + 커밋**

```bash
npx prettier --write src/pages/home src/entities/profile
npm run lint && npm run type-check && npm run test
git add src/pages/home src/entities/profile
git commit -m "feat(home): add IntroSection with silhouette backdrop"
```

---

### Task 7: 홈 조립 · 구 섹션 폐기 · 헤더 제거

**Files:**

- Modify: `src/pages/home/ui/HomePage.tsx`
- Modify: `src/pages/home/ui/HomePage.css.ts`
- Modify: `src/pages/home/ui/HomePage.test.tsx`
- Delete: `src/pages/home/ui/HeroSection/`, `src/pages/home/ui/SkillsSection/`, `src/pages/home/ui/ProjectsSection/`, `src/pages/home/ui/ContactLinks/`
- Move: `app/(public)/page.tsx` → `app/page.tsx`

**Interfaces:**

- Consumes: `IntroSection` (Task 6)

- [ ] **Step 1: 실패하는 테스트 작성**

`src/pages/home/ui/HomePage.test.tsx` 를 다음으로 교체한다.

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { profile } from '@/entities/profile';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('소개 섹션의 이름을 최상위 제목으로 노출한다', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name);
  });

  it('폐기한 스킬·프로젝트 섹션을 더 이상 렌더하지 않는다', () => {
    render(<HomePage />);

    expect(screen.queryByRole('heading', { name: /기술|프로젝트/ })).toBeNull();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/pages/home/ui/HomePage.test.tsx`
Expected: FAIL — 구 섹션이 아직 렌더된다.

- [ ] **Step 3: `HomePage` 교체**

```tsx
/** 포트폴리오 홈 — 섹션 단위 풀페이지 스크롤. 현재 소개 섹션 하나 */
import { IntroSection } from './IntroSection/IntroSection';

/** 홈 페이지 구성 */
export function HomePage() {
  return (
    <main>
      <IntroSection />
    </main>
  );
}
```

`HomePage.css.ts` 의 `main` export 가 더 이상 쓰이지 않으면 파일을 삭제하고 import 도 지운다. 다른 곳에서 쓰면 남긴다.

- [ ] **Step 4: 구 섹션 삭제**

```bash
git rm -r src/pages/home/ui/HeroSection src/pages/home/ui/SkillsSection src/pages/home/ui/ProjectsSection src/pages/home/ui/ContactLinks
```

`src/pages/home/index.ts` 와 `src/entities/profile/index.ts` 에서 삭제된 파일을 가리키는 export 가 남아 있으면 제거한다. `skills`·`projects` 데이터가 어디에서도 쓰이지 않게 되면 **지우지 말고** 남긴다 — 원래 있던 코드이고, 섹션 3 이후에서 다시 쓸 데이터다.

- [ ] **Step 5: 홈에서 헤더 걷어내기**

```bash
git mv "app/(public)/page.tsx" app/page.tsx
```

`app/page.tsx` 는 `@/pages/home` 을 re-export 하는 껍데기이므로 내용 수정은 없다. 이동만으로 `(public)` 그룹의 `SiteHeader` 가 홈에 적용되지 않는다. 블로그·랩은 `(public)` 에 남아 헤더를 계속 쓴다.

- [ ] **Step 6: 테스트 통과 확인**

Run: `npx vitest run src/pages/home`
Expected: PASS

- [ ] **Step 7: 전체 검증**

```bash
npx prettier --write src app
npm run fsd && npm run lint && npm run type-check && npm run test
```

이어서 **이 태스크만** build 를 돌린다. `'use client'` 누락은 vitest·tsc 가 잡지 못하고 여기서만 드러난다. 로컬 Supabase 가 필요하다.

```bash
supabase start && npm run build
```

- [ ] **Step 8: 커밋**

```bash
git add -A src app
git commit -m "feat(home): replace legacy sections with IntroSection, drop header on home"
```

---

### Task 8: 브라우저 육안 확인

단위 테스트가 닿지 않는 영역이다. 스크롤 감각·깊이감·라이트 모드는 여기서만 확인된다.

**Files:** 없음 (검증 전용)

- [ ] **Step 1: 개발 서버 실행**

`.claude/launch.json` 이 없으면 만든다.

```json
{
  "version": "0.0.1",
  "configurations": [{ "name": "dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 3000 }]
}
```

preview_start 로 `dev` 를 띄운다.

- [ ] **Step 2: 데스크톱 확인**

`http://localhost:3000` 에서 확인한다.

- 스크롤하면 섹션이 화면에 고정되고 실루엣이 좌 → 우로 흐르는가
- 겹마다 속도가 달라 깊이가 느껴지는가 (`near` 가 가장 빠르다)
- 문구와 이미지 자리가 배경과 함께 고정되어 있는가
- 스크롤을 다 쓰면 핀이 풀리고 아래로 넘어가는가

- [ ] **Step 3: 모바일 확인**

resize_window 로 mobile(375x812) 로 바꾼 뒤 같은 항목을 본다. 추가로:

- `mid` 겹이 사라졌는가 (`desktopOnly`)
- 이동 거리가 데스크톱보다 짧은가
- 주소창 유무로 섹션 높이가 튀지 않는가

- [ ] **Step 4: 라이트 모드 확인**

헤더가 홈에서 빠졌으므로 테마 토글이 없다. DevTools 로 `document.documentElement.dataset.theme = 'light'` 를 실행해 전환하고, 실루엣이 대낮 톤(먼 겹이 옅음)으로 뒤집히는지 본다.

- [ ] **Step 5: reduced-motion 확인**

`resize_window` 로는 재현되지 않는다. macOS 시스템 설정 → 손쉬운 사용 → 디스플레이 → 동작 줄이기를 켜고 새로고침한다.

- 섹션이 핀되지 않고 일반 스크롤로 지나가는가
- 실루엣이 정지 상태로 보이는가

- [ ] **Step 6: 스크린샷 공유**

데스크톱·모바일·라이트 3장을 사용자에게 보낸다.

---

## Self-Review

**스펙 커버리지**

| 스펙 요구 | 태스크 |
|---|---|
| 섹션 단위 풀페이지 스크롤 (`pin`) | Task 5 |
| 프라하 도시 실루엣 3겹 + 첨탑·돔 | Task 2 |
| 좌 → 우 수평 이동, 스크롤 진행도 드라이버 | Task 5 (`scrub: true`) |
| 배경만 움직이고 문구·이미지 고정 | Task 5 (섹션 전체를 핀) |
| `100svh` | Task 6 |
| 홈에서 헤더 제거 | Task 7 |
| 핀 대상 = 섹션 전체, 훅이 ref 를 인자로 받음 | Task 5 |
| `tone` 역할 기반 색, 라이트 모드 자동 대응 | Task 1, Task 3 |
| `desktopOnly` 를 CSS 로 처리 | Task 3 |
| reduced-motion 에서 이동·핀 모두 해제 | Task 2 (`resolveParallaxConfig` → null) |
| 모바일도 핀 유지, 거리만 짧게 | Task 2 (`travelRatio` 0.6 / 0.25) |
| `bp` 단일 소스 | Task 3, Task 5 |
| GSAP 진입점 하나 | Task 5 |
| 테스트 3종(분기·순수계산·조립) | Task 2, Task 3, Task 4 |
| 브라우저 육안 검증 | Task 8 |
| `profile.name` 수식어 분리 | Task 6 |

**미커버:** 스펙의 "열린 질문"(섹션 3 이후 블록, docs·랩 경계)은 의도적으로 범위 밖이다.

**타입 일관성:** `SceneLayer` 는 타입명과 컴포넌트명이 겹치므로 Task 3 에서 타입을 `SceneLayerData` 로 별칭한다. 스펙이 처음 쓰던 `hideOnMobile` 은 `desktopOnly` 로 뒤집었다 — CSS 가 모바일 우선(기본 숨김 → `bp.md` 에서 표시)이라 이름이 동작과 일치해야 한다. 스펙 문서도 같은 이름으로 갱신해 두었다.
