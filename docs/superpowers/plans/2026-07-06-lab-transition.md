# /lab 섹션 + CSS transition 플레이그라운드 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/lab` 목록 페이지와 `/lab/transition` 플레이그라운드(4요소 실시간 조작 + 드래그 베지어 에디터 + 비교 경주 + 코드 패널)를 구현한다.

**Architecture:** FSD pages 레이어에 `lab`, `lab-transition` 슬라이스를 추가하고 Next `app/`은 re-export 껍데기만 둔다. 순수 로직(프리셋·클램프·CSS 문자열)은 `model/`, UI는 `ui/`. 상태는 `useTransitionConfig` 훅 하나가 소유하고 단방향으로 흐른다. transition 값은 CSS 변수(`--lab-*`)로 주입해 실제 CSS transition이 구동된다.

**Tech Stack:** Next.js 16 App Router, React, radix-ui 1.5(Slider 포함), vanilla-extract(sprinkles), Vitest + RTL + jsdom.

## Global Constraints

- 주석: 파일 헤더·모든 export에 한 줄 JSDoc, 본문 비자명 로직엔 한 줄 `//` WHY. 멀티라인 블록·`@param` 금지 (comment-convention.md)
- 테스트 describe/it 설명문은 한국어, 고유 식별자만 영문 (tdd-convention.md 6절)
- 스타일: 레이아웃·간격·색은 sprinkles, 연출·치수·타이포는 `style()`. 합성 `style([sprinkles({}), {}])`
- shared/ui는 per-component index.ts 금지 — `src/shared/ui/index.ts`가 파일 직접 re-export
- git push 금지(커밋만), 브랜치 생성 금지 — 현재 브랜치 `refactor/project`에서 작업
- 마무리 검증: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run format` (build 제외)

---

### Task 1: shared/ui Slider 래퍼

**Files:**

- Create: `src/shared/ui/Slider/Slider.css.ts`
- Create: `src/shared/ui/Slider/Slider.tsx`
- Test: `src/shared/ui/Slider/Slider.test.tsx`
- Modify: `src/shared/ui/index.ts` (마지막 export 뒤에 한 줄 추가)

**Interfaces:**

- Consumes: radix-ui `Slider` 프리미티브, `vars`(theme.css)
- Produces: `Slider = { Root, Track, Range, Thumb }` 네임스페이스. Root props는 Radix 그대로(`value: number[]`, `onValueChange: (v: number[]) => void`, `min`, `max`, `step`). Thumb에 `aria-label`을 다는 사용 계약.

- [ ] **Step 1: 실패하는 테스트 작성**

Radix Slider는 내부에서 ResizeObserver를 쓴다 — jsdom에 없으므로 테스트 파일 상단에서 스텁한다(기존 vitest.setup 셔임과 같은 취지, 아직 Slider만 필요하므로 로컬에 둔다).

```tsx
// src/shared/ui/Slider/Slider.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

// jsdom엔 ResizeObserver가 없다 — Radix Slider가 썸 크기 계산에 사용
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

function renderSlider() {
  return render(
    <Slider.Root
      defaultValue={[300]}
      max={3000}
      step={50}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb aria-label='지속 시간' />
    </Slider.Root>
  );
}

describe('Slider', () => {
  it('slider 역할과 값 범위를 노출한다', () => {
    renderSlider();

    const thumb = screen.getByRole('slider', { name: '지속 시간' });
    expect(thumb).toHaveAttribute('aria-valuenow', '300');
    expect(thumb).toHaveAttribute('aria-valuemax', '3000');
  });

  it('화살표 키로 step만큼 값을 조정한다', () => {
    renderSlider();

    const thumb = screen.getByRole('slider', { name: '지속 시간' });
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(thumb).toHaveAttribute('aria-valuenow', '350');
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/shared/ui/Slider`
Expected: FAIL — `Cannot find module './Slider'`

- [ ] **Step 3: 스타일 + 구현 작성**

```ts
// src/shared/ui/Slider/Slider.css.ts
/** Slider 트랙·레인지·썸 — 가로 범위 입력 연출. 치수는 스케일 밖이라 style()에 직접 둔다 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 루트 — 썸을 세로 중앙에 놓는 정렬 컨테이너, 터치 드래그가 스크롤로 새지 않게 막는다 */
export const root = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '1.25rem',
  touchAction: 'none',
  userSelect: 'none',
  cursor: 'pointer',
});

/** 트랙 — 전체 범위를 나타내는 얇은 바 */
export const track = style({
  position: 'relative',
  flexGrow: 1,
  height: '0.25rem',
  borderRadius: '9999px',
  background: vars.color.border,
});

/** 레인지 — 현재 값까지 채워지는 구간, 위치는 Radix가 인라인으로 계산 */
export const range = style({
  position: 'absolute',
  height: '100%',
  borderRadius: '9999px',
  background: vars.color.accent,
});

/** 썸 — 드래그 손잡이, 키보드 포커스 링 표시 */
export const thumb = style({
  display: 'block',
  width: '1rem',
  height: '1rem',
  borderRadius: '9999px',
  border: `1px solid ${vars.color.accent}`,
  background: vars.color.background,
  ':focus-visible': { outline: `2px solid ${vars.color.accent}`, outlineOffset: '2px' },
});
```

```tsx
// src/shared/ui/Slider/Slider.tsx
/** 공용 Slider — Radix Slider 위에 트랙/레인지/썸 스타일만 입힌 범위 입력 */
import { Slider as SliderPrimitive } from 'radix-ui'; // 값↔좌표 계산·키보드 스텝·ARIA slider·폼 input을 Radix가 처리
import { forwardRef } from 'react';
import { range, root, thumb, track } from './Slider.css';

/** 루트 — value/min/max/step과 onValueChange를 받는 컨테이너 */
const Root = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Root.displayName = 'Slider.Root';

/** 트랙 — 전체 범위 바 */
const Track = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Track
      ref={ref}
      className={[track, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Track.displayName = 'Slider.Track';

/** 레인지 — 채워진 구간 */
const Range = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Range>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Range
      ref={ref}
      className={[range, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Range.displayName = 'Slider.Range';

/** 썸 — 드래그 손잡이, 접근성 이름은 사용처에서 aria-label로 */
const Thumb = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Thumb
      ref={ref}
      className={[thumb, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Thumb.displayName = 'Slider.Thumb';

/** 네임스페이스 — <Slider.Root><Slider.Track><Slider.Range/></Slider.Track><Slider.Thumb/></Slider.Root> */
export const Slider = { Root, Track, Range, Thumb };
```

`src/shared/ui/index.ts` 마지막 줄 뒤에 추가:

```ts
export { Slider } from './Slider/Slider';
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/shared/ui/Slider`
Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/shared/ui/Slider src/shared/ui/index.ts
git commit -m "feat(ui): Slider 래퍼 추가"
```

---

### Task 2: model — 타입·프리셋·프로퍼티 데모 정의

**Files:**

- Create: `src/pages/lab-transition/model/presets.ts`
- Test: `src/pages/lab-transition/model/presets.test.ts`

**Interfaces:**

- Produces:
  - `type BezierPoints = [number, number, number, number]`
  - `type TimingPresetName = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'`
  - `type Timing = { kind: 'preset'; name: TimingPresetName } | { kind: 'custom'; points: BezierPoints }`
  - `type PropertyId = 'translate-x' | 'scale' | 'rotate' | 'opacity' | 'background-color'`
  - `type TransitionConfig = { property: PropertyId; durationMs: number; delayMs: number; timing: Timing }`
  - `TIMING_PRESETS: Record<TimingPresetName, BezierPoints>`
  - `PROPERTY_OPTIONS: { id: PropertyId; label: string; cssProperty: string }[]`
  - `DEFAULT_CONFIG: TransitionConfig`

- [ ] **Step 1: 실패하는 테스트 작성**

```ts
// src/pages/lab-transition/model/presets.test.ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, PROPERTY_OPTIONS, TIMING_PRESETS } from './presets';

describe('TIMING_PRESETS', () => {
  it('CSS 스펙이 정의한 키워드 좌표를 그대로 갖는다', () => {
    expect(TIMING_PRESETS.linear).toEqual([0, 0, 1, 1]);
    expect(TIMING_PRESETS.ease).toEqual([0.25, 0.1, 0.25, 1]);
    expect(TIMING_PRESETS['ease-in-out']).toEqual([0.42, 0, 0.58, 1]);
  });
});

describe('PROPERTY_OPTIONS', () => {
  it('transform 계열 데모는 전부 cssProperty transform으로 합쳐진다', () => {
    const transforms = PROPERTY_OPTIONS.filter((o) =>
      ['translate-x', 'scale', 'rotate'].includes(o.id)
    );
    expect(transforms).toHaveLength(3);
    for (const option of transforms) {
      expect(option.cssProperty).toBe('transform');
    }
  });
});

describe('DEFAULT_CONFIG', () => {
  it('이동 데모와 ease 프리셋으로 시작한다', () => {
    expect(DEFAULT_CONFIG.property).toBe('translate-x');
    expect(DEFAULT_CONFIG.timing).toEqual({ kind: 'preset', name: 'ease' });
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/lab-transition/model/presets.test.ts`
Expected: FAIL — `Cannot find module './presets'`

- [ ] **Step 3: 구현 작성**

```ts
// src/pages/lab-transition/model/presets.ts
/** transition 랩 — 조작 상태 타입과 타이밍 프리셋·프로퍼티 데모 정의 */

/** cubic-bezier 제어점 좌표 — [x1, y1, x2, y2] */
export type BezierPoints = [number, number, number, number];

/** CSS 키워드 프리셋 이름 */
export type TimingPresetName = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

/** 타이밍 상태 — 프리셋 선택 중이거나, 핸들을 만진 뒤의 커스텀 좌표 */
export type Timing =
  | { kind: 'preset'; name: TimingPresetName }
  | { kind: 'custom'; points: BezierPoints };

/** 데모로 조작할 수 있는 속성 — transform 계열은 시각적으로 구분해 노출한다 */
export type PropertyId = 'translate-x' | 'scale' | 'rotate' | 'opacity' | 'background-color';

/** 플레이그라운드의 단일 조작 상태 */
export type TransitionConfig = {
  property: PropertyId;
  durationMs: number;
  delayMs: number;
  timing: Timing;
};

/** 키워드별 고정 좌표 — CSS 스펙 정의값, 에디터에 프리셋 곡선을 그릴 때 사용 */
export const TIMING_PRESETS: Record<TimingPresetName, BezierPoints> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
};

/** 프로퍼티 선택지 한 건 — cssProperty가 실제 transition 대상이 된다 */
export type PropertyOption = { id: PropertyId; label: string; cssProperty: string };

/** 데모 프로퍼티 목록 — translate-x·scale·rotate는 CSS에선 transform 하나다 */
export const PROPERTY_OPTIONS: PropertyOption[] = [
  { id: 'translate-x', label: '이동', cssProperty: 'transform' },
  { id: 'scale', label: '크기', cssProperty: 'transform' },
  { id: 'rotate', label: '회전', cssProperty: 'transform' },
  { id: 'opacity', label: '투명도', cssProperty: 'opacity' },
  { id: 'background-color', label: '배경색', cssProperty: 'background-color' },
];

/** 초기 상태 — 가장 직관적인 이동 데모 + ease, 눈으로 따라가기 좋은 600ms */
export const DEFAULT_CONFIG: TransitionConfig = {
  property: 'translate-x',
  durationMs: 600,
  delayMs: 0,
  timing: { kind: 'preset', name: 'ease' },
};
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/lab-transition/model/presets.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/pages/lab-transition/model
git commit -m "feat(lab): transition 랩 타입·프리셋 모델 추가"
```

---

### Task 3: model — 베지어 클램프 + CSS 문자열 변환

**Files:**

- Create: `src/pages/lab-transition/model/bezier.ts`
- Create: `src/pages/lab-transition/model/toCssValue.ts`
- Test: `src/pages/lab-transition/model/bezier.test.ts`
- Test: `src/pages/lab-transition/model/toCssValue.test.ts`

**Interfaces:**

- Consumes: Task 2의 `Timing`, `TransitionConfig`, `PROPERTY_OPTIONS`
- Produces:
  - `BEZIER_Y_MIN = -0.5`, `BEZIER_Y_MAX = 1.5`
  - `clampBezierPoint(x: number, y: number): [number, number]`
  - `timingToCss(timing: Timing): string`
  - `toCssValue(config: TransitionConfig): string` — `"transform 600ms ease 0ms"` 형태(값 부분만)

- [ ] **Step 1: 실패하는 테스트 작성**

```ts
// src/pages/lab-transition/model/bezier.test.ts
import { describe, expect, it } from 'vitest';
import { clampBezierPoint } from './bezier';

describe('clampBezierPoint', () => {
  it('x를 CSS 스펙 범위 [0, 1]로 자른다', () => {
    expect(clampBezierPoint(-0.3, 0.5)).toEqual([0, 0.5]);
    expect(clampBezierPoint(1.7, 0.5)).toEqual([1, 0.5]);
  });

  it('y는 오버슈트 표현을 위해 [-0.5, 1.5]까지 허용한다', () => {
    expect(clampBezierPoint(0.5, 2)).toEqual([0.5, 1.5]);
    expect(clampBezierPoint(0.5, -1)).toEqual([0.5, -0.5]);
    expect(clampBezierPoint(0.5, 1.2)).toEqual([0.5, 1.2]);
  });
});
```

```ts
// src/pages/lab-transition/model/toCssValue.test.ts
import { describe, expect, it } from 'vitest';
import { timingToCss, toCssValue } from './toCssValue';

describe('timingToCss', () => {
  it('프리셋은 키워드 그대로 반환한다', () => {
    expect(timingToCss({ kind: 'preset', name: 'ease-in-out' })).toBe('ease-in-out');
  });

  it('커스텀 좌표는 cubic-bezier() 표기로 만든다', () => {
    expect(timingToCss({ kind: 'custom', points: [0.17, 0.67, 0.83, 0.67] })).toBe(
      'cubic-bezier(0.17, 0.67, 0.83, 0.67)'
    );
  });
});

describe('toCssValue', () => {
  it('property duration timing delay 순서의 축약값을 만든다', () => {
    expect(
      toCssValue({
        property: 'translate-x',
        durationMs: 600,
        delayMs: 100,
        timing: { kind: 'preset', name: 'ease' },
      })
    ).toBe('transform 600ms ease 100ms');
  });

  it('opacity 데모는 cssProperty opacity를 쓴다', () => {
    expect(
      toCssValue({
        property: 'opacity',
        durationMs: 300,
        delayMs: 0,
        timing: { kind: 'preset', name: 'linear' },
      })
    ).toBe('opacity 300ms linear 0ms');
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/lab-transition/model`
Expected: FAIL — bezier/toCssValue 모듈 없음 (presets 테스트는 PASS 유지)

- [ ] **Step 3: 구현 작성**

```ts
// src/pages/lab-transition/model/bezier.ts
/** 베지어 제어점 좌표 클램프 — 스펙 제약과 에디터 표시 범위 */

/** 에디터 y축 하한 — 아래로 튀는(anticipation) 곡선 표현 한계 */
export const BEZIER_Y_MIN = -0.5;

/** 에디터 y축 상한 — 위로 튀는(overshoot) 곡선 표현 한계 */
export const BEZIER_Y_MAX = 1.5;

/** x는 스펙상 [0,1] 필수(시간축은 되감기 불가), y는 오버슈트를 위해 [-0.5, 1.5] 허용 */
export function clampBezierPoint(x: number, y: number): [number, number] {
  const clampedX = Math.min(1, Math.max(0, x));
  const clampedY = Math.min(BEZIER_Y_MAX, Math.max(BEZIER_Y_MIN, y));
  return [clampedX, clampedY];
}
```

```ts
// src/pages/lab-transition/model/toCssValue.ts
/** TransitionConfig → 실제 CSS transition 선언 문자열 변환 */
import { PROPERTY_OPTIONS, type Timing, type TransitionConfig } from './presets';

/** timing 상태 → CSS 값. 프리셋은 키워드, 커스텀은 cubic-bezier() 함수 표기 */
export function timingToCss(timing: Timing): string {
  if (timing.kind === 'preset') {
    return timing.name;
  }
  const [x1, y1, x2, y2] = timing.points;
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

/** config → "transform 600ms ease 0ms" — transition 축약형의 값 부분 */
export function toCssValue(config: TransitionConfig): string {
  // 데모 id가 아니라 실제 CSS 프로퍼티가 transition 대상 — translate-x·scale·rotate는 전부 transform
  const cssProperty = PROPERTY_OPTIONS.find((option) => {
    return option.id === config.property;
  })!.cssProperty;
  return `${cssProperty} ${config.durationMs}ms ${timingToCss(config.timing)} ${config.delayMs}ms`;
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/lab-transition/model`
Expected: PASS (bezier 2 + toCssValue 4 + presets 3)

- [ ] **Step 5: 커밋**

```bash
git add src/pages/lab-transition/model
git commit -m "feat(lab): 베지어 클램프·CSS 문자열 변환 추가"
```

---

### Task 4: model — useTransitionConfig 훅

**Files:**

- Create: `src/pages/lab-transition/model/useTransitionConfig.ts`
- Test: `src/pages/lab-transition/model/useTransitionConfig.test.ts`

**Interfaces:**

- Consumes: Task 2의 `DEFAULT_CONFIG`와 타입들
- Produces: `useTransitionConfig(): { config: TransitionConfig; setProperty(p: PropertyId): void; setDurationMs(ms: number): void; setDelayMs(ms: number): void; selectPreset(name: TimingPresetName): void; setCustomPoints(points: BezierPoints): void }`

- [ ] **Step 1: 실패하는 테스트 작성**

```ts
// src/pages/lab-transition/model/useTransitionConfig.test.ts
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from './presets';
import { useTransitionConfig } from './useTransitionConfig';

describe('useTransitionConfig', () => {
  it('기본값으로 시작한다', () => {
    const { result } = renderHook(() => useTransitionConfig());
    expect(result.current.config).toEqual(DEFAULT_CONFIG);
  });

  it('각 핸들러는 해당 필드만 바꾼다', () => {
    const { result } = renderHook(() => useTransitionConfig());

    act(() => result.current.setProperty('opacity'));
    act(() => result.current.setDurationMs(1000));
    act(() => result.current.setDelayMs(200));

    expect(result.current.config.property).toBe('opacity');
    expect(result.current.config.durationMs).toBe(1000);
    expect(result.current.config.delayMs).toBe(200);
    expect(result.current.config.timing).toEqual(DEFAULT_CONFIG.timing);
  });

  it('커스텀 좌표를 넣으면 timing이 custom으로 전환된다', () => {
    const { result } = renderHook(() => useTransitionConfig());

    act(() => result.current.setCustomPoints([0.1, 0.2, 0.3, 0.4]));
    expect(result.current.config.timing).toEqual({
      kind: 'custom',
      points: [0.1, 0.2, 0.3, 0.4],
    });

    act(() => result.current.selectPreset('linear'));
    expect(result.current.config.timing).toEqual({ kind: 'preset', name: 'linear' });
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/lab-transition/model/useTransitionConfig.test.ts`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 구현 작성**

```ts
// src/pages/lab-transition/model/useTransitionConfig.ts
/** transition 랩 조작 상태 — 단일 config와 필드별 갱신 핸들러 묶음 */
import { useState } from 'react';
import {
  DEFAULT_CONFIG,
  type BezierPoints,
  type PropertyId,
  type TimingPresetName,
  type TransitionConfig,
} from './presets';

/** 페이지가 소유하는 단일 상태 훅 — 컨트롤은 쓰고, 프리뷰·코드 패널은 읽기만 한다 */
export function useTransitionConfig() {
  const [config, setConfig] = useState<TransitionConfig>(DEFAULT_CONFIG);

  const setProperty = (property: PropertyId) => {
    setConfig((current) => ({ ...current, property }));
  };
  const setDurationMs = (durationMs: number) => {
    setConfig((current) => ({ ...current, durationMs }));
  };
  const setDelayMs = (delayMs: number) => {
    setConfig((current) => ({ ...current, delayMs }));
  };
  const selectPreset = (name: TimingPresetName) => {
    setConfig((current) => ({ ...current, timing: { kind: 'preset', name } }));
  };
  // 핸들을 만지는 순간 custom으로 전환 — 프리셋 이름과 좌표가 어긋난 상태를 없앤다
  const setCustomPoints = (points: BezierPoints) => {
    setConfig((current) => ({ ...current, timing: { kind: 'custom', points } }));
  };

  return { config, setProperty, setDurationMs, setDelayMs, selectPreset, setCustomPoints };
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/lab-transition/model`
Expected: PASS 전체

- [ ] **Step 5: 커밋**

```bash
git add src/pages/lab-transition/model
git commit -m "feat(lab): useTransitionConfig 상태 훅 추가"
```

---

### Task 5: BezierEditor — SVG 드래그 곡선 에디터

**Files:**

- Create: `src/pages/lab-transition/ui/BezierEditor.css.ts`
- Create: `src/pages/lab-transition/ui/BezierEditor.tsx`
- Test: `src/pages/lab-transition/ui/BezierEditor.test.tsx`

**Interfaces:**

- Consumes: Task 3 `clampBezierPoint`, `BEZIER_Y_MIN/MAX`; Task 2 `BezierPoints`
- Produces: `BezierEditor({ points: BezierPoints; onChange: (points: BezierPoints) => void })`. 핸들은 `role='slider'`, 이름 `제어점 1`/`제어점 2`.

- [ ] **Step 1: 실패하는 테스트 작성**

jsdom의 `getBoundingClientRect`는 0을 반환한다 — SVG 좌표 환산을 위해 300×300으로 모킹한다. `setPointerCapture`는 vitest.setup 셔임이 이미 처리한다.

```tsx
// src/pages/lab-transition/ui/BezierEditor.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BezierEditor } from './BezierEditor';

beforeEach(() => {
  // 좌표 환산은 SVG 실측 크기가 필요하다 — jsdom은 0을 주므로 300×300 정사각형으로 고정
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 300,
    bottom: 300,
    width: 300,
    height: 300,
    toJSON: () => ({}),
  } as DOMRect);
});

describe('BezierEditor', () => {
  it('제어점을 드래그하면 진행률 좌표로 onChange를 호출한다', () => {
    const onChange = vi.fn();
    render(
      <BezierEditor
        points={[0.25, 0.1, 0.25, 1]}
        onChange={onChange}
      />
    );

    const handle = screen.getByRole('slider', { name: '제어점 1' });
    fireEvent.pointerDown(handle, { pointerId: 1 });
    // 화면 (150, 75) = SVG 절반 x, 위쪽 1/4 → 진행률 (0.5, 1.0)
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 150, clientY: 75 });
    fireEvent.pointerUp(handle, { pointerId: 1 });

    expect(onChange).toHaveBeenLastCalledWith([0.5, 1, 0.25, 1]);
  });

  it('드래그가 범위를 벗어나면 클램프된 좌표를 전달한다', () => {
    const onChange = vi.fn();
    render(
      <BezierEditor
        points={[0.25, 0.1, 0.25, 1]}
        onChange={onChange}
      />
    );

    const handle = screen.getByRole('slider', { name: '제어점 2' });
    fireEvent.pointerDown(handle, { pointerId: 1 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: -50, clientY: 600 });

    // x는 0 아래로 못 내려가고, y는 화면 아래 멀리 = -0.5 하한
    expect(onChange).toHaveBeenLastCalledWith([0.25, 0.1, 0, -0.5]);
  });

  it('포인터를 누르지 않은 move는 무시한다', () => {
    const onChange = vi.fn();
    render(
      <BezierEditor
        points={[0.25, 0.1, 0.25, 1]}
        onChange={onChange}
      />
    );

    fireEvent.pointerMove(screen.getByRole('slider', { name: '제어점 1' }), {
      pointerId: 1,
      clientX: 150,
      clientY: 75,
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('화살표 키로 제어점을 미세조정한다', () => {
    const onChange = vi.fn();
    render(
      <BezierEditor
        points={[0.25, 0.1, 0.25, 1]}
        onChange={onChange}
      />
    );

    fireEvent.keyDown(screen.getByRole('slider', { name: '제어점 1' }), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith([0.27, 0.1, 0.25, 1]);
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/lab-transition/ui/BezierEditor.test.tsx`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 스타일 + 구현 작성**

```ts
// src/pages/lab-transition/ui/BezierEditor.css.ts
/** BezierEditor — 곡선·보조선·핸들 연출. 크기·색 모두 시각 연출이라 style() 영역 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** SVG 캔버스 — 정사각형 유지, 테마 표면 위에 얹는다 */
export const svg = style({
  width: '100%',
  maxWidth: '20rem',
  aspectRatio: '1',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  touchAction: 'none',
});

/** 단위 정사각형 — (0,0)→(1,1) 진행 영역 표시, 이 밖의 y가 오버슈트 */
export const unitArea = style({
  fill: vars.color.background,
});

/** linear 대각선 — 기준 비교용 점선 */
export const baseline = style({
  stroke: vars.color.border,
  strokeWidth: 2,
  strokeDasharray: '4 4',
});

/** 끝점→제어점 연결선 — 핸들이 곡선의 어디를 당기는지 보여준다 */
export const arm = style({
  stroke: vars.color.muted,
  strokeWidth: 1.5,
});

/** 베지어 곡선 본체 */
export const curve = style({
  fill: 'none',
  stroke: vars.color.accent,
  strokeWidth: 3,
});

/** 드래그 핸들 — 포커스 링으로 키보드 조작 대상 표시 */
export const handle = style({
  fill: vars.color.accent,
  cursor: 'grab',
  ':focus-visible': { outline: `2px solid ${vars.color.accent}`, outlineOffset: '2px' },
});
```

```tsx
// src/pages/lab-transition/ui/BezierEditor.tsx
/** 베지어 곡선 에디터 — cubic-bezier 제어점 2개를 드래그·키보드로 조작하는 SVG 에디터 */
import { useRef, useState } from 'react';
import { BEZIER_Y_MAX, BEZIER_Y_MIN, clampBezierPoint } from '../model/bezier';
import type { BezierPoints } from '../model/presets';
import * as s from './BezierEditor.css';

const SIZE = 300; // SVG 내부 좌표계 한 변 — 화면 크기는 CSS가 결정한다
const Y_RANGE = BEZIER_Y_MAX - BEZIER_Y_MIN; // y축 표시 범위 = 2 (오버슈트 포함)
const KEY_STEP = 0.02; // 화살표 한 번당 이동량 — 드래그로 어려운 미세조정 용도

/** 진행률 x(0~1) → SVG x 좌표 */
const toSvgX = (x: number) => x * SIZE;

/** 진행률 y → SVG y 좌표 — SVG는 아래로 갈수록 커져서 상하를 뒤집는다 */
const toSvgY = (y: number) => ((BEZIER_Y_MAX - y) / Y_RANGE) * SIZE;

/** 제어점 인덱스 — 0이면 P1(x1,y1), 1이면 P2(x2,y2) */
type HandleIndex = 0 | 1;

type BezierEditorProps = {
  points: BezierPoints;
  onChange: (points: BezierPoints) => void;
};

/** 드래그 가능한 cubic-bezier 에디터 — 값은 부모가 소유하는 controlled 컴포넌트 */
export function BezierEditor({ points, onChange }: BezierEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<HandleIndex | null>(null);
  const [x1, y1, x2, y2] = points;

  // 포인터 화면 좌표 → 진행률 좌표 — SVG가 CSS로 스케일돼도 비율 환산이라 정확하다
  const pointFromEvent = (event: React.PointerEvent): [number, number] => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = BEZIER_Y_MAX - ((event.clientY - rect.top) / rect.height) * Y_RANGE;
    return clampBezierPoint(x, y);
  };

  const updateHandle = (index: HandleIndex, x: number, y: number) => {
    const next: BezierPoints = index === 0 ? [x, y, x2, y2] : [x1, y1, x, y];
    onChange(next);
  };

  const handlePointerDown =
    (index: HandleIndex) => (event: React.PointerEvent<SVGCircleElement>) => {
      // 핸들 밖으로 나가도 move를 계속 받도록 캡처 — 없으면 빠른 드래그가 끊긴다
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(index);
    };

  const handlePointerMove = (index: HandleIndex) => (event: React.PointerEvent) => {
    if (dragging !== index) return;
    const [x, y] = pointFromEvent(event);
    updateHandle(index, x, y);
  };

  const handleKeyDown = (index: HandleIndex) => (event: React.KeyboardEvent) => {
    const [currentX, currentY] = index === 0 ? [x1, y1] : [x2, y2];
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0],
      ArrowRight: [KEY_STEP, 0],
      ArrowUp: [0, KEY_STEP],
      ArrowDown: [0, -KEY_STEP],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault(); // 화살표 키가 페이지 스크롤로 새지 않게
    const [x, y] = clampBezierPoint(currentX + delta[0], currentY + delta[1]);
    updateHandle(index, x, y);
  };

  const handleProps = (index: HandleIndex, x: number, y: number) => ({
    cx: toSvgX(x),
    cy: toSvgY(y),
    r: 10,
    tabIndex: 0,
    // 2차원 값이라 표준 role이 없다 — slider + valuetext로 좌표를 읽어준다
    role: 'slider',
    'aria-label': `제어점 ${index + 1}`,
    'aria-valuenow': x,
    'aria-valuemin': 0,
    'aria-valuemax': 1,
    'aria-valuetext': `x ${x.toFixed(2)}, y ${y.toFixed(2)}`,
    className: s.handle,
    onPointerDown: handlePointerDown(index),
    onPointerMove: handlePointerMove(index),
    onPointerUp: () => setDragging(null),
    onKeyDown: handleKeyDown(index),
  });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={s.svg}
      aria-label='cubic-bezier 곡선 에디터'>
      <rect
        x={0}
        y={toSvgY(1)}
        width={SIZE}
        height={toSvgY(0) - toSvgY(1)}
        className={s.unitArea}
      />
      <line
        x1={toSvgX(0)}
        y1={toSvgY(0)}
        x2={toSvgX(1)}
        y2={toSvgY(1)}
        className={s.baseline}
      />
      <line
        x1={toSvgX(0)}
        y1={toSvgY(0)}
        x2={toSvgX(x1)}
        y2={toSvgY(y1)}
        className={s.arm}
      />
      <line
        x1={toSvgX(1)}
        y1={toSvgY(1)}
        x2={toSvgX(x2)}
        y2={toSvgY(y2)}
        className={s.arm}
      />
      <path
        d={`M ${toSvgX(0)} ${toSvgY(0)} C ${toSvgX(x1)} ${toSvgY(y1)}, ${toSvgX(x2)} ${toSvgY(y2)}, ${toSvgX(1)} ${toSvgY(1)}`}
        className={s.curve}
      />
      <circle {...handleProps(0, x1, y1)} />
      <circle {...handleProps(1, x2, y2)} />
    </svg>
  );
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/lab-transition/ui/BezierEditor.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/pages/lab-transition/ui
git commit -m "feat(lab): SVG 드래그 베지어 에디터 추가"
```

---

### Task 6: TransitionControls — 조작 패널 + 개념 노트

**Files:**

- Create: `src/pages/lab-transition/ui/TransitionControls.css.ts`
- Create: `src/pages/lab-transition/ui/TransitionControls.tsx`
- Test: `src/pages/lab-transition/ui/TransitionControls.test.tsx`

**Interfaces:**

- Consumes: shared/ui `Slider`, `ToggleGroup`; Task 2 `PROPERTY_OPTIONS`, `TIMING_PRESETS`, 타입들
- Produces: `TransitionControls({ config, onPropertyChange, onDurationChange, onDelayChange, onPresetSelect })`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
// src/pages/lab-transition/ui/TransitionControls.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../model/presets';
import { TransitionControls } from './TransitionControls';

// Radix Slider가 ResizeObserver를 요구한다 — jsdom 미구현 셔임
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

function renderControls(overrides: Partial<React.ComponentProps<typeof TransitionControls>> = {}) {
  const handlers = {
    onPropertyChange: vi.fn(),
    onDurationChange: vi.fn(),
    onDelayChange: vi.fn(),
    onPresetSelect: vi.fn(),
  };
  render(
    <TransitionControls
      config={DEFAULT_CONFIG}
      {...handlers}
      {...overrides}
    />
  );
  return handlers;
}

describe('TransitionControls', () => {
  it('프로퍼티 선택 시 onPropertyChange를 호출한다', () => {
    const handlers = renderControls();

    fireEvent.click(screen.getByRole('radio', { name: '투명도' }));
    expect(handlers.onPropertyChange).toHaveBeenCalledWith('opacity');
  });

  it('duration 슬라이더 키 조작 시 onDurationChange를 호출한다', () => {
    const handlers = renderControls();

    fireEvent.keyDown(screen.getByRole('slider', { name: 'duration' }), { key: 'ArrowRight' });
    expect(handlers.onDurationChange).toHaveBeenCalledWith(650);
  });

  it('프리셋 선택 시 onPresetSelect를 호출한다', () => {
    const handlers = renderControls();

    fireEvent.click(screen.getByRole('radio', { name: 'linear' }));
    expect(handlers.onPresetSelect).toHaveBeenCalledWith('linear');
  });

  it('각 컨트롤 그룹에 개념 노트를 보여준다', () => {
    renderControls();

    expect(screen.getByText(/display는 보간할 중간값이 없다/)).toBeInTheDocument();
    expect(screen.getByText(/200~500ms/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/lab-transition/ui/TransitionControls.test.tsx`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 스타일 + 구현 작성**

```ts
// src/pages/lab-transition/ui/TransitionControls.css.ts
/** TransitionControls — 컨트롤 그룹 배치와 개념 노트 타이포 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const root = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '24' })]);

export const group = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '8' })]);

export const groupTitle = style({
  fontSize: '0.875rem',
  fontWeight: 600,
  fontFamily: 'monospace',
});

export const toggleRow = style([sprinkles({ display: 'flex', flexWrap: 'wrap', gap: '4' })]);

/** 개념 노트 — 본문보다 낮은 위계의 학습 메모 */
export const note = style({
  color: vars.color.muted,
  fontSize: '0.8125rem',
  lineHeight: 1.6,
});
```

```tsx
// src/pages/lab-transition/ui/TransitionControls.tsx
/** 컨트롤 패널 — property·duration·delay·타이밍 프리셋 조작과 개념 노트 */
import { Slider, ToggleGroup } from '@/shared/ui';
import {
  PROPERTY_OPTIONS,
  TIMING_PRESETS,
  type PropertyId,
  type TimingPresetName,
  type TransitionConfig,
} from '../model/presets';
import * as s from './TransitionControls.css';

type TransitionControlsProps = {
  config: TransitionConfig;
  onPropertyChange: (property: PropertyId) => void;
  onDurationChange: (ms: number) => void;
  onDelayChange: (ms: number) => void;
  onPresetSelect: (name: TimingPresetName) => void;
};

/** ms 범위 슬라이더 한 벌 — duration/delay가 같은 모양이라 로컬에서만 재사용 */
function MsSlider({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (ms: number) => void;
}) {
  return (
    <Slider.Root
      value={[value]}
      onValueChange={([next]) => onChange(next)}
      min={0}
      max={max}
      step={50}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb aria-label={label} />
    </Slider.Root>
  );
}

/** transition 4요소 조작 패널 — 상태는 부모 소유, 여기선 쓰기 핸들러만 호출 */
export function TransitionControls({
  config,
  onPropertyChange,
  onDurationChange,
  onDelayChange,
  onPresetSelect,
}: TransitionControlsProps) {
  // 커스텀 곡선 중엔 어떤 프리셋도 선택 상태가 아니어야 한다
  const presetValue = config.timing.kind === 'preset' ? config.timing.name : '';

  return (
    <div className={s.root}>
      <section
        aria-label='transition-property'
        className={s.group}>
        <h2 className={s.groupTitle}>property</h2>
        <ToggleGroup.Root
          type='single'
          value={config.property}
          onValueChange={(value) => {
            // Radix는 재클릭 해제 시 ''를 준다 — 항상 하나는 선택돼야 하므로 무시
            if (value) onPropertyChange(value as PropertyId);
          }}
          className={s.toggleRow}>
          {PROPERTY_OPTIONS.map((option) => (
            <ToggleGroup.Item
              key={option.id}
              value={option.id}>
              {option.label}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
        <p className={s.note}>
          모든 속성이 애니메이션되는 건 아니다 — display는 보간할 중간값이 없다. 이동·크기·회전은
          CSS에선 전부 transform 하나이고, transform·opacity는 합성 단계에서 처리돼 가장 싸다.
        </p>
      </section>

      <section
        aria-label='transition-duration'
        className={s.group}>
        <h2 className={s.groupTitle}>duration — {config.durationMs}ms</h2>
        <MsSlider
          label='duration'
          value={config.durationMs}
          max={3000}
          onChange={onDurationChange}
        />
        <p className={s.note}>
          200~500ms가 “즉시 반응했다”고 느끼는 구간. 길수록 우아해지는 게 아니라 답답해진다.
        </p>
      </section>

      <section
        aria-label='transition-delay'
        className={s.group}>
        <h2 className={s.groupTitle}>delay — {config.delayMs}ms</h2>
        <MsSlider
          label='delay'
          value={config.delayMs}
          max={2000}
          onChange={onDelayChange}
        />
        <p className={s.note}>
          시작을 미루는 값. 스펙상 음수도 허용돼 곡선 중간부터 재생할 수도 있다 — 여기선 0 이상만
          다룬다.
        </p>
      </section>

      <section
        aria-label='transition-timing-function'
        className={s.group}>
        <h2 className={s.groupTitle}>timing-function</h2>
        <ToggleGroup.Root
          type='single'
          value={presetValue}
          onValueChange={(value) => {
            if (value) onPresetSelect(value as TimingPresetName);
          }}
          className={s.toggleRow}>
          {(Object.keys(TIMING_PRESETS) as TimingPresetName[]).map((name) => (
            <ToggleGroup.Item
              key={name}
              value={name}>
              {name}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
        <p className={s.note}>
          cubic-bezier는 “시간(x) 대비 진행률(y)” 곡선이다. 키워드 프리셋도 전부 이 곡선의 특정
          좌표일 뿐 — 아래 에디터에서 직접 당겨보자.
        </p>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/lab-transition/ui/TransitionControls.test.tsx`
Expected: PASS (4 tests). ToggleGroup 단일 선택이 `radio` role이 아니면 실제 role을 확인해(`screen.logTestingPlaygroundURL()` 또는 기존 ToggleGroup 테스트 참고) 테스트 쿼리를 맞춘다.

- [ ] **Step 5: 커밋**

```bash
git add src/pages/lab-transition/ui
git commit -m "feat(lab): transition 컨트롤 패널 추가"
```

---

### Task 7: PreviewStage — 재생 버튼 + 비교 경주 트랙

**Files:**

- Create: `src/pages/lab-transition/ui/PreviewStage.css.ts`
- Create: `src/pages/lab-transition/ui/PreviewStage.tsx`
- Test: `src/pages/lab-transition/ui/PreviewStage.test.tsx`

**Interfaces:**

- Consumes: shared/ui `Button`, `Switch`; Task 3 `timingToCss`; Task 2 `PROPERTY_OPTIONS`, `TransitionConfig`
- Produces: `PreviewStage({ config: TransitionConfig })`. 데모 박스는 `data-run` 속성과 `--lab-*` CSS 변수로 구동.

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
// src/pages/lab-transition/ui/PreviewStage.test.tsx
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '../model/presets';
import { PreviewStage } from './PreviewStage';

/** 프리뷰 영역의 데모 박스들 — 위가 내 설정, 아래가 linear 기준선 */
function getBoxes() {
  const stage = screen.getByRole('region', { name: '프리뷰' });
  return Array.from(stage.querySelectorAll('[data-run]'));
}

describe('PreviewStage', () => {
  it('재생 버튼이 데모 상태를 토글한다', () => {
    render(<PreviewStage config={DEFAULT_CONFIG} />);

    expect(getBoxes()[0]).toHaveAttribute('data-run', 'false');
    fireEvent.click(screen.getByRole('button', { name: '재생' }));
    expect(getBoxes()[0]).toHaveAttribute('data-run', 'true');
  });

  it('조작값을 CSS 변수로 데모 박스에 주입한다', () => {
    render(<PreviewStage config={{ ...DEFAULT_CONFIG, durationMs: 1000, delayMs: 200 }} />);

    const style = getBoxes()[0].getAttribute('style') ?? '';
    expect(style).toContain('--lab-duration: 1000ms');
    expect(style).toContain('--lab-delay: 200ms');
    expect(style).toContain('--lab-property: transform');
  });

  it('기준선 트랙은 timing만 linear로 고정된다', () => {
    render(<PreviewStage config={DEFAULT_CONFIG} />);

    const style = getBoxes()[1].getAttribute('style') ?? '';
    expect(style).toContain('--lab-timing: linear');
    expect(style).toContain('--lab-delay: 0ms');
  });

  it('기준선 스위치를 끄면 비교 트랙이 사라진다', () => {
    render(<PreviewStage config={DEFAULT_CONFIG} />);

    const stage = screen.getByRole('region', { name: '프리뷰' });
    fireEvent.click(within(stage).getByRole('switch', { name: 'linear 기준선' }));
    expect(getBoxes()).toHaveLength(1);
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/lab-transition/ui/PreviewStage.test.tsx`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 스타일 + 구현 작성**

```ts
// src/pages/lab-transition/ui/PreviewStage.css.ts
/** PreviewStage — 트랙 두 줄과 데모 박스. transition 값 4종은 CSS 변수로 주입받는다 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const stage = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: '12', p: '20', r: 'md' }),
  { border: `1px solid ${vars.color.border}`, background: vars.color.surface },
]);

export const controls = style([sprinkles({ display: 'flex', alignItems: 'center', gap: '12' })]);

export const baselineLabel = style({
  color: vars.color.muted,
  fontSize: '0.875rem',
});

/** 트랙 — 박스가 달리는 레인, 이동 데모가 잘리지 않게 여유 폭 확보 */
export const track = style([
  sprinkles({ display: 'flex', alignItems: 'center', p: '12', r: 'sm' }),
  { minHeight: '4.5rem', background: vars.color.background, overflow: 'hidden' },
]);

// 데모 박스 공통 — 연출값은 전부 var()라서 조작 즉시 다음 재생에 반영된다
const boxBase = style({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: vars.radius.sm,
  background: vars.color.accent,
  transitionProperty: 'var(--lab-property)',
  transitionDuration: 'var(--lab-duration)',
  transitionTimingFunction: 'var(--lab-timing)',
  transitionDelay: 'var(--lab-delay)',
});

/** 프로퍼티별 from→to 연출 — data-run이 A/B 상태 스위치 */
export const box = styleVariants({
  'translate-x': [
    boxBase,
    { selectors: { '&[data-run="true"]': { transform: 'translateX(14rem)' } } },
  ],
  scale: [
    boxBase,
    {
      transform: 'scale(0.6)',
      selectors: { '&[data-run="true"]': { transform: 'scale(1.3)' } },
    },
  ],
  rotate: [
    boxBase,
    { selectors: { '&[data-run="true"]': { transform: 'rotate(180deg)' } } },
  ],
  opacity: [boxBase, { selectors: { '&[data-run="true"]': { opacity: 0.15 } } }],
  'background-color': [
    boxBase,
    { selectors: { '&[data-run="true"]': { background: vars.color.text } } },
  ],
});
```

```tsx
// src/pages/lab-transition/ui/PreviewStage.tsx
/** 프리뷰 스테이지 — 재생 버튼으로 내 설정 vs linear 기준선을 나란히 달리게 한다 */
import { useState } from 'react';
import { Button, Switch } from '@/shared/ui';
import { PROPERTY_OPTIONS, type TransitionConfig } from '../model/presets';
import { timingToCss } from '../model/toCssValue';
import * as s from './PreviewStage.css';

type PreviewStageProps = {
  config: TransitionConfig;
};

/** 조작값을 CSS 변수로 주입받아 실제 CSS transition으로 달리는 비교 트랙 */
export function PreviewStage({ config }: PreviewStageProps) {
  const [isRun, setIsRun] = useState(false); // A↔B 상태 — 재생 버튼이 뒤집는다
  const [showBaseline, setShowBaseline] = useState(true);

  const cssProperty = PROPERTY_OPTIONS.find((option) => {
    return option.id === config.property;
  })!.cssProperty;

  // 인라인엔 값만 싣는다 — 어떤 연출을 할지는 .css.ts의 변수 참조가 결정
  const boxVars = {
    '--lab-property': cssProperty,
    '--lab-duration': `${config.durationMs}ms`,
    '--lab-timing': timingToCss(config.timing),
    '--lab-delay': `${config.delayMs}ms`,
  } as React.CSSProperties;
  // 기준선은 곡선 차이만 보여준다 — timing·delay만 고정하고 나머지는 동일 조건
  const baselineVars = {
    ...boxVars,
    '--lab-timing': 'linear',
    '--lab-delay': '0ms',
  } as React.CSSProperties;

  return (
    <section
      aria-label='프리뷰'
      className={s.stage}>
      <div className={s.controls}>
        <Button onClick={() => setIsRun((current) => !current)}>재생</Button>
        <label className={s.baselineLabel}>
          linear 기준선{' '}
          <Switch.Root
            checked={showBaseline}
            onCheckedChange={setShowBaseline}
            aria-label='linear 기준선'>
            <Switch.Thumb />
          </Switch.Root>
        </label>
      </div>
      <div className={s.track}>
        <div
          data-run={isRun}
          className={s.box[config.property]}
          style={boxVars}
        />
      </div>
      {showBaseline ? (
        <div className={s.track}>
          <div
            data-run={isRun}
            className={s.box[config.property]}
            style={baselineVars}
          />
        </div>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/lab-transition/ui/PreviewStage.test.tsx`
Expected: PASS (4 tests). `Button` API가 다르면(`children` 외 필수 prop 등) `src/shared/ui/Button/Button.tsx`를 열어 맞춘다.

- [ ] **Step 5: 커밋**

```bash
git add src/pages/lab-transition/ui
git commit -m "feat(lab): 비교 경주 프리뷰 스테이지 추가"
```

---

### Task 8: CodePanel — 실시간 CSS 코드 + 복사

**Files:**

- Create: `src/pages/lab-transition/ui/CodePanel.css.ts`
- Create: `src/pages/lab-transition/ui/CodePanel.tsx`
- Test: `src/pages/lab-transition/ui/CodePanel.test.tsx`

**Interfaces:**

- Consumes: shared/ui `Button`; Task 3 `toCssValue`; Task 2 `TransitionConfig`
- Produces: `CodePanel({ config: TransitionConfig })`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
// src/pages/lab-transition/ui/CodePanel.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../model/presets';
import { CodePanel } from './CodePanel';

const writeText = vi.fn();

beforeEach(() => {
  writeText.mockClear().mockResolvedValue(undefined);
  // jsdom엔 clipboard가 없다 — 복사 API만 목으로 대체
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
});

describe('CodePanel', () => {
  it('현재 조작값을 transition 선언으로 보여준다', () => {
    render(<CodePanel config={DEFAULT_CONFIG} />);

    expect(screen.getByText('transition: transform 600ms ease 0ms;')).toBeInTheDocument();
  });

  it('복사 버튼이 선언 전체를 클립보드에 쓴다', () => {
    render(<CodePanel config={DEFAULT_CONFIG} />);

    fireEvent.click(screen.getByRole('button', { name: '복사' }));
    expect(writeText).toHaveBeenCalledWith('transition: transform 600ms ease 0ms;');
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/lab-transition/ui/CodePanel.test.tsx`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 스타일 + 구현 작성**

```ts
// src/pages/lab-transition/ui/CodePanel.css.ts
/** CodePanel — 코드 블록과 복사 버튼 배치 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const panel = style([
  sprinkles({ display: 'flex', alignItems: 'center', gap: '12', p: '16', r: 'md' }),
  { border: `1px solid ${vars.color.border}`, background: vars.color.surface },
]);

/** 코드 블록 — 조작 중 값이 길어져도 줄바꿈 없이 스크롤 */
export const code = style({
  flexGrow: 1,
  margin: 0,
  overflowX: 'auto',
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
});
```

```tsx
// src/pages/lab-transition/ui/CodePanel.tsx
/** 코드 패널 — 조작값을 실제 transition 선언으로 보여주고 클립보드로 복사한다 */
import { Button } from '@/shared/ui';
import type { TransitionConfig } from '../model/presets';
import { toCssValue } from '../model/toCssValue';
import * as s from './CodePanel.css';

type CodePanelProps = {
  config: TransitionConfig;
};

/** 실시간 CSS 선언 표시 + 복사 */
export function CodePanel({ config }: CodePanelProps) {
  const declaration = `transition: ${toCssValue(config)};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(declaration);
  };

  return (
    <section
      aria-label='CSS 코드'
      className={s.panel}>
      <pre className={s.code}>
        <code>{declaration}</code>
      </pre>
      <Button onClick={handleCopy}>복사</Button>
    </section>
  );
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/lab-transition/ui/CodePanel.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/pages/lab-transition/ui
git commit -m "feat(lab): 실시간 CSS 코드 패널 추가"
```

---

### Task 9: TransitionLabPage 조립 + 라우트

**Files:**

- Create: `src/pages/lab-transition/ui/TransitionLabPage.css.ts`
- Create: `src/pages/lab-transition/ui/TransitionLabPage.tsx`
- Create: `src/pages/lab-transition/index.ts`
- Create: `app/lab/transition/page.tsx`
- Test: `src/pages/lab-transition/ui/TransitionLabPage.test.tsx`

**Interfaces:**

- Consumes: Task 4 훅, Task 5~8 컴포넌트, Task 2 `TIMING_PRESETS`
- Produces: `TransitionLabPage()` (default export), 라우트 `/lab/transition`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
// src/pages/lab-transition/ui/TransitionLabPage.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TransitionLabPage } from './TransitionLabPage';

// Radix Slider가 ResizeObserver를 요구한다 — jsdom 미구현 셔임
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

describe('TransitionLabPage', () => {
  it('컨트롤·에디터·프리뷰·코드 패널을 모두 조립한다', () => {
    render(<TransitionLabPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'transition' })).toBeInTheDocument();
    expect(screen.getByLabelText('cubic-bezier 곡선 에디터')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '프리뷰' })).toBeInTheDocument();
    expect(screen.getByText('transition: transform 600ms ease 0ms;')).toBeInTheDocument();
  });

  it('프리셋을 바꾸면 코드 패널에 즉시 반영된다', () => {
    render(<TransitionLabPage />);

    fireEvent.click(screen.getByRole('radio', { name: 'linear' }));
    expect(screen.getByText('transition: transform 600ms linear 0ms;')).toBeInTheDocument();
  });

  it('프로퍼티를 바꾸면 코드 패널의 대상 프로퍼티가 바뀐다', () => {
    render(<TransitionLabPage />);

    fireEvent.click(screen.getByRole('radio', { name: '투명도' }));
    expect(screen.getByText('transition: opacity 600ms ease 0ms;')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/lab-transition/ui/TransitionLabPage.test.tsx`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 스타일 + 구현 + 라우트 작성**

```ts
// src/pages/lab-transition/ui/TransitionLabPage.css.ts
/** TransitionLabPage — 헤더와 2열 그리드 배치 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const main = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '32',
    px: { mobile: '20', tablet: '40' },
    py: '64',
  }),
  { width: '100%', maxWidth: '72rem', marginInline: 'auto' },
]);

export const header = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '8' })]);

export const eyebrow = style({
  color: vars.color.muted,
  fontSize: '0.875rem',
});

export const title = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  fontFamily: 'monospace',
  lineHeight: 1.1,
});

export const description = style({
  color: vars.color.muted,
  lineHeight: 1.7,
});

/** 본문 그리드 — 모바일 1열, 태블릿부터 컨트롤/프리뷰 2열 */
export const grid = style([
  sprinkles({ display: 'grid', gap: '32' }),
  {
    '@media': {
      'screen and (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' },
    },
  },
]);

export const column = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '24' })]);
```

```tsx
// src/pages/lab-transition/ui/TransitionLabPage.tsx
'use client';

/** transition 플레이그라운드 — 조작 상태를 소유하고 컨트롤·에디터·프리뷰·코드 패널을 조립 */
import { TIMING_PRESETS } from '../model/presets';
import { useTransitionConfig } from '../model/useTransitionConfig';
import { BezierEditor } from './BezierEditor';
import { CodePanel } from './CodePanel';
import { PreviewStage } from './PreviewStage';
import { TransitionControls } from './TransitionControls';
import * as s from './TransitionLabPage.css';

/** /lab/transition 페이지 — 단일 config가 아래로만 흐른다 */
export function TransitionLabPage() {
  const { config, setProperty, setDurationMs, setDelayMs, selectPreset, setCustomPoints } =
    useTransitionConfig();

  // 에디터는 항상 좌표가 필요하다 — 프리셋 선택 중이면 스펙 좌표를 그대로 보여준다
  const points = config.timing.kind === 'custom' ? config.timing.points : TIMING_PRESETS[config.timing.name];

  return (
    <main className={s.main}>
      <header className={s.header}>
        <p className={s.eyebrow}>Lab</p>
        <h1 className={s.title}>transition</h1>
        <p className={s.description}>
          transition은 속성값이 바뀌는 순간을 보간해 움직임으로 만든다. 네 가지 요소를 직접
          조작하면서 곡선이 체감을 어떻게 바꾸는지 관찰해보자.
        </p>
      </header>
      <div className={s.grid}>
        <div className={s.column}>
          <TransitionControls
            config={config}
            onPropertyChange={setProperty}
            onDurationChange={setDurationMs}
            onDelayChange={setDelayMs}
            onPresetSelect={selectPreset}
          />
          <BezierEditor
            points={points}
            onChange={setCustomPoints}
          />
        </div>
        <div className={s.column}>
          <PreviewStage config={config} />
          <CodePanel config={config} />
        </div>
      </div>
    </main>
  );
}
```

```ts
// src/pages/lab-transition/index.ts
/** pages/lab-transition public API */
export { TransitionLabPage as default } from './ui/TransitionLabPage';
```

```tsx
// app/lab/transition/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'transition — Lab',
  description: 'CSS transition을 실시간 조작하며 배우는 플레이그라운드',
};

export { default } from '@/pages/lab-transition';
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/lab-transition`
Expected: PASS 전체

- [ ] **Step 5: 커밋**

```bash
git add src/pages/lab-transition app/lab
git commit -m "feat(lab): transition 플레이그라운드 페이지 조립"
```

---

### Task 10: LabPage 목록 + 라우트

**Files:**

- Create: `src/pages/lab/ui/LabPage.css.ts`
- Create: `src/pages/lab/ui/LabPage.tsx`
- Create: `src/pages/lab/index.ts`
- Create: `app/lab/page.tsx`
- Test: `src/pages/lab/ui/LabPage.test.tsx`

**Interfaces:**

- Consumes: next/link
- Produces: `LabPage()` (default export), 라우트 `/lab`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
// src/pages/lab/ui/LabPage.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LabPage } from './LabPage';

describe('LabPage', () => {
  it('transition 실험으로 가는 링크를 노출한다', () => {
    render(<LabPage />);

    expect(screen.getByRole('link', { name: 'transition' })).toHaveAttribute(
      'href',
      '/lab/transition'
    );
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/lab/ui/LabPage.test.tsx`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: 스타일 + 구현 + 라우트 작성**

```ts
// src/pages/lab/ui/LabPage.css.ts
/** LabPage — 목록 페이지 배치, BlogPage와 같은 리듬 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const main = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '32',
    px: { mobile: '20', tablet: '40' },
    py: '64',
  }),
  { width: '100%', maxWidth: '56rem', marginInline: 'auto' },
]);

export const header = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '8' })]);

export const eyebrow = style({
  color: vars.color.muted,
  fontSize: '0.875rem',
});

export const title = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  lineHeight: 1.1,
});

export const description = style({
  color: vars.color.muted,
  lineHeight: 1.7,
});

export const list = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '16' })]);

export const item = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: '8', p: '20', r: 'md' }),
  { border: `1px solid ${vars.color.border}`, background: vars.color.surface },
]);

export const itemTitle = style({
  fontSize: '1.25rem',
  fontFamily: 'monospace',
  lineHeight: 1.3,
});

export const itemDescription = style({
  color: vars.color.muted,
});
```

```tsx
// src/pages/lab/ui/LabPage.tsx
/** 랩 목록 — 인터랙션 실험 페이지 인덱스 */
import Link from 'next/link';
import * as s from './LabPage.css';

// 아직 항목이 적어 로컬 상수로 관리 — 데이터 소스가 필요해지면 그때 분리한다
const LAB_ENTRIES = [
  {
    href: '/lab/transition',
    title: 'transition',
    description: 'CSS transition 4요소를 실시간 조작하며 배우는 플레이그라운드',
  },
];

/** /lab 페이지 — 실험 목록 카드 */
export function LabPage() {
  return (
    <main className={s.main}>
      <header className={s.header}>
        <p className={s.eyebrow}>Lab</p>
        <h1 className={s.title}>인터랙션 실험실</h1>
        <p className={s.description}>
          인터랙션 애니메이션 개념을 하나씩, 직접 만져보며 배우는 공간.
        </p>
      </header>
      <section
        aria-label='실험 목록'
        className={s.list}>
        {LAB_ENTRIES.map((entry) => {
          return (
            <article
              className={s.item}
              key={entry.href}>
              <h2 className={s.itemTitle}>
                <Link href={entry.href}>{entry.title}</Link>
              </h2>
              <p className={s.itemDescription}>{entry.description}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
```

```ts
// src/pages/lab/index.ts
/** pages/lab public API */
export { LabPage as default } from './ui/LabPage';
```

```tsx
// app/lab/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lab — 인터랙션 실험실',
  description: '인터랙션 애니메이션 개념을 실시간 조작하며 배우는 실험 페이지 모음',
};

export { default } from '@/pages/lab';
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/lab`
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add src/pages/lab app/lab/page.tsx
git commit -m "feat(lab): 랩 목록 페이지 추가"
```

---

### Task 11: 홈 진입 링크 + 전체 검증

**Files:**

- Modify: `src/pages/home/ui/HomePage.tsx` (panel 안 마지막에 링크 추가)
- Modify: `src/pages/home/ui/HomePage.css.ts` (labLink 스타일 추가)
- Test: `src/pages/home/ui/HomePage.test.tsx` (케이스 1개 추가)

**Interfaces:**

- Consumes: 기존 HomePage 구조
- Produces: 홈 → `/lab` 진입 링크

- [ ] **Step 1: 실패하는 테스트 추가**

`HomePage.test.tsx`의 기존 describe 안에 추가:

```tsx
it('랩 진입 링크를 노출한다', () => {
  render(<HomePage />);

  expect(screen.getByRole('link', { name: /인터랙션 실험실/ })).toHaveAttribute('href', '/lab');
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/pages/home`
Expected: 새 케이스만 FAIL

- [ ] **Step 3: 구현**

`HomePage.tsx` — `<GsapSmoke />` 다음 줄에 추가(파일 상단에 `import Link from 'next/link';`):

```tsx
<Link
  className={s.labLink}
  href='/lab'>
  Lab — 인터랙션 실험실 →
</Link>
```

`HomePage.css.ts` 끝에 추가:

```ts
/** 랩 진입 링크 — 본문과 구분되는 액센트 컬러 */
export const labLink = style({
  color: vars.color.accent,
  fontWeight: 600,
});
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/pages/home`
Expected: PASS 전체

- [ ] **Step 5: 전체 검증 + 커밋**

Run: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run format`
Expected: 전부 통과, format 후 diff 없음(있으면 재확인 후 포함해 커밋)

```bash
git add src/pages/home
git commit -m "feat(home): 랩 진입 링크 추가"
```
