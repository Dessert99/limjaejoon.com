# Button 공용 컴포넌트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `shared/ui`의 첫 디자인 프리미티브 Button을 만들고, 이후 컴포넌트가 복제할 표준 파이프라인(Radix headless + vanilla-extract recipe + 토큰 + Storybook + TDD)을 확립한다.

**Architecture:** Button은 native `<button>`을 기본 렌더하고 `asChild`일 때 Radix `Slot.Root`로 자식 엘리먼트에 props·className을 합성한다. 시각 변형(variant×size)은 `@vanilla-extract/recipes`의 `recipe()`로 정의하되, 레이아웃·간격·라운드는 기존 `sprinkles`를 recipe의 base/size 안에서 합성하고, variant별 색만 토큰(`vars.color.*`) 참조 `style()`로 둔다.

**Tech Stack:** React 19, TypeScript, `radix-ui` 1.5.0(Slot), `@vanilla-extract/recipes` 0.5.x, `@vanilla-extract/sprinkles`, Vitest + Testing Library, Storybook 10.

**설계 문서:** [2026-06-15-button-component-design.md](../specs/2026-06-15-button-component-design.md)

**커밋 규칙:** 모든 커밋 메시지 끝에 다음 트레일러를 붙인다(빈 줄 뒤):
`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## File Structure

생성/수정할 파일과 책임:

```
src/shared/ui/
├── Button/
│   ├── Button.tsx          # 생성: 컴포넌트 본체(forwardRef, asChild→Slot, className 병합)
│   ├── Button.css.ts       # 생성: recipe() variant×size 정의 + ButtonVariants 타입
│   ├── Button.test.tsx     # 생성: RTL 행동 테스트
│   ├── Button.stories.tsx  # 생성: Storybook 상태 문서(매트릭스/asChild/disabled)
│   └── index.ts            # 생성: slice public API (Button, ButtonProps)
└── index.ts                # 생성: shared/ui 배럴 (Steiger 요구)

src/shared/styles/
├── theme.types.ts          # 수정: ThemeValues.color에 accentForeground 추가
├── theme.css.ts            # 수정: 컨트랙트에 color.accentForeground 추가
└── themes/{afternoon,sunset,night,dawn}.ts  # 수정: 각 테마에 accentForeground 값

.storybook/preview.tsx      # 수정: defaultThemeClass → afternoonThemeClass (블로커)
package.json                # 수정: radix-ui, @vanilla-extract/recipes 의존성
```

---

## Task 1: 의존성 설치

**Files:**
- Modify: `package.json` (npm이 갱신)

- [ ] **Step 1: 패키지 설치**

Run:
```bash
npm i radix-ui@^1.5.0 && npm i -D @vanilla-extract/recipes@^0.5.7
```

- [ ] **Step 2: 설치 확인**

Run:
```bash
node -e "require('radix-ui'); require('@vanilla-extract/recipes'); console.log('ok')"
```
Expected: `ok` (모듈 해석 성공)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: radix-ui, vanilla-extract recipes 의존성 추가"
```

---

## Task 2: Storybook preview import 수정 (블로커)

직전 토큰 작업에서 `defaultThemeClass`가 `afternoonThemeClass`로 이름이 바뀌어 [.storybook/preview.tsx](../../../.storybook/preview.tsx)의 import가 깨져 있다. 이대로면 Storybook 전체가 뜨지 않아 Task 7 스토리가 렌더되지 않는다.

**Files:**
- Modify: `.storybook/preview.tsx:3,8`

- [ ] **Step 1: import와 사용처를 afternoonThemeClass로 교체**

`.storybook/preview.tsx`에서 아래 두 곳을 바꾼다.

```tsx
// 변경 전
import { defaultThemeClass } from '@/shared/styles/theme.css';
// 변경 후
import { afternoonThemeClass } from '@/shared/styles/theme.css';
```

```tsx
// 변경 전
document.documentElement.classList.add(defaultThemeClass);
// 변경 후
document.documentElement.classList.add(afternoonThemeClass);
```

- [ ] **Step 2: 잔존 참조 없음 확인**

Run:
```bash
grep -rn "defaultThemeClass" .storybook src
```
Expected: 출력 없음(매치 0건)

- [ ] **Step 3: Commit**

```bash
git add .storybook/preview.tsx
git commit -m "fix: storybook preview 테마 클래스 import 수정(afternoonThemeClass)"
```

---

## Task 3: accentForeground 토큰 추가

solid 변형이 accent 위에 올릴 어두운 전경색을 컨트랙트에 추가한다. accent 4개가 모두 밝은 톤이라 어두운 값을 쓴다.

**Files:**
- Modify: `src/shared/styles/theme.types.ts:11`
- Modify: `src/shared/styles/theme.css.ts:15`
- Modify: `src/shared/styles/themes/afternoon.ts:7`
- Modify: `src/shared/styles/themes/sunset.ts:7`
- Modify: `src/shared/styles/themes/night.ts:7`
- Modify: `src/shared/styles/themes/dawn.ts:7`

- [ ] **Step 1: ThemeValues에 필드 추가**

`src/shared/styles/theme.types.ts`의 `color` 블록을 수정한다.

```ts
// 변경 전
    border: string;
    accent: string;
  };
// 변경 후
    border: string;
    accent: string;
    accentForeground: string;
  };
```

- [ ] **Step 2: 컨트랙트에 토큰 추가**

`src/shared/styles/theme.css.ts`의 `createThemeContract` color 블록을 수정한다.

```ts
// 변경 전
    border: null,
    accent: null,
  },
// 변경 후
    border: null,
    accent: null,
    accentForeground: null,
  },
```

- [ ] **Step 3: 4테마에 값 채우기**

각 테마 파일의 `color: { ... }` 한 줄을 아래로 교체한다(끝에 `accentForeground` 추가).

`afternoon.ts`:
```ts
  color: { background: '#eef4fb', surface: '#ffffff', text: '#1c2630', muted: '#5d6b7a', border: '#d8e2ee', accent: '#c79338', accentForeground: '#1c2630' },
```

`sunset.ts`:
```ts
  color: { background: '#2c2030', surface: '#3a2b3c', text: '#f6e7d6', muted: '#c2a18d', border: '#4f3b49', accent: '#e07a45', accentForeground: '#2c2030' },
```

`night.ts`:
```ts
  color: { background: '#0a0b10', surface: '#14161e', text: '#e7eaf3', muted: '#8a93ac', border: '#232838', accent: '#d8c39a', accentForeground: '#14161e' },
```

`dawn.ts`:
```ts
  color: { background: '#1b2038', surface: '#262b46', text: '#e9eaf6', muted: '#a3a8cb', border: '#353b59', accent: '#cf8f86', accentForeground: '#1b2038' },
```

- [ ] **Step 4: 타입 검증**

Run:
```bash
npm run type-check
```
Expected: PASS (4테마가 모두 `accentForeground`를 제공하므로 `createTheme`/`ThemeValues` 타입 충족. 누락 시 여기서 에러)

- [ ] **Step 5: Commit**

```bash
git add src/shared/styles/theme.types.ts src/shared/styles/theme.css.ts src/shared/styles/themes
git commit -m "feat: accentForeground 색 토큰 추가(solid 버튼 전경색)"
```

---

## Task 4: Button 코어 (기본 렌더 + recipe + public API)

기본 `<button>` 렌더와 시각 변형 recipe, slice/segment public API를 한 번에 세운다. variant/size의 시각 차이는 단언하지 않고(브리틀) Storybook이 문서화한다.

**Files:**
- Create: `src/shared/ui/Button/Button.css.ts`
- Create: `src/shared/ui/Button/Button.tsx`
- Create: `src/shared/ui/Button/Button.test.tsx`
- Create: `src/shared/ui/Button/index.ts`
- Create: `src/shared/ui/index.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/shared/ui/Button/Button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button with its children', () => {
    render(<Button>저장</Button>);

    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run:
```bash
npx vitest run src/shared/ui/Button/Button.test.tsx
```
Expected: FAIL — `Failed to resolve import './Button'` (아직 파일 없음)

- [ ] **Step 3: recipe 작성**

`src/shared/ui/Button/Button.css.ts`:
```ts
/** Button 시각 변형 — base(레이아웃=sprinkles) + variant(색 연출) + size(간격) 합성 */
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';

/** variant×size 매트릭스 — 색은 토큰 참조, 간격/레이아웃은 sprinkles */
export const button = recipe({
  base: [
    sprinkles({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8',
      r: 'md',
    }),
    {
      cursor: 'pointer',
      fontWeight: 600,
      border: '1px solid transparent',
      // hover/active 연출은 의도적으로 비움 — 사용자가 직접 얹는다
      ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
    },
  ],
  variants: {
    variant: {
      solid: { background: vars.color.accent, color: vars.color.accentForeground },
      outline: { borderColor: vars.color.border, color: vars.color.text },
      ghost: { color: vars.color.text },
    },
    size: {
      sm: sprinkles({ px: '12', py: '8' }),
      md: sprinkles({ px: '16', py: '10' }),
    },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
});

/** recipe variant prop 타입 — Button props의 단일 출처 */
export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;
```

- [ ] **Step 4: 컴포넌트 작성 (최소 — native button)**

이 단계는 기본 렌더 테스트만 통과시키는 최소 구현이다. asChild는 Task 5에서 도입한다.

`src/shared/ui/Button/Button.tsx`:
```tsx
/** 공용 Button — recipe 변형을 입힌 native button */
import { forwardRef } from 'react';
import { button, type ButtonVariants } from './Button.css';

/** 표준 button 속성 + 시각 변형 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {}

/** recipe 클래스를 외부 className과 병합해 native button을 렌더 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => (
    <button
      ref={ref}
      className={[button({ variant, size }), className].filter(Boolean).join(' ')}
      {...props}
    />
  )
);

Button.displayName = 'Button';
```

- [ ] **Step 5: public API 작성**

`src/shared/ui/Button/index.ts`:
```ts
/** Button slice public API */
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

`src/shared/ui/index.ts`:
```ts
/** shared/ui — 디자인 프리미티브 public API */
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

- [ ] **Step 6: 테스트 통과 확인**

Run:
```bash
npx vitest run src/shared/ui/Button/Button.test.tsx
```
Expected: PASS (1 passed)

- [ ] **Step 7: Commit**

```bash
git add src/shared/ui
git commit -m "feat: Button 공용 컴포넌트 코어(recipe + native button)"
```

---

## Task 5: asChild (Slot) 지원

`asChild`면 wrapper button이 사라지고 자식 엘리먼트가 그 자리에 렌더되어야 한다. 이를 못박는 테스트를 먼저 실패시키고 Slot으로 구현한다.

**Files:**
- Modify: `src/shared/ui/Button/Button.test.tsx`
- Modify: `src/shared/ui/Button/Button.tsx`

- [ ] **Step 1: 실패하는 테스트 추가**

`Button.test.tsx`의 `describe` 블록 안, 기존 it 다음에 추가. button wrapper가 사라지는 것까지 단언해 native 렌더와 구분한다.
```tsx
  it('renders as the child element instead of a button when asChild is set', () => {
    render(
      <Button asChild>
        <a href='/about'>소개</a>
      </Button>
    );

    expect(screen.getByRole('link', { name: '소개' })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: 테스트 실패 확인**

Run:
```bash
npx vitest run src/shared/ui/Button/Button.test.tsx
```
Expected: FAIL — 최소 구현은 `<button>`이 `<a>`를 감싸므로 `queryByRole('button')`이 노드를 찾아 `not.toBeInTheDocument()`가 실패.

- [ ] **Step 3: Slot으로 asChild 구현**

`src/shared/ui/Button/Button.tsx` 전체를 아래로 교체한다.
```tsx
/** 공용 Button — native button 기본, asChild면 Radix Slot으로 자식에 합성 */
import { forwardRef } from 'react';
import { Slot } from 'radix-ui';
import { button, type ButtonVariants } from './Button.css';

/** 표준 button 속성 + 시각 변형 + asChild 합성 플래그 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean;
}

/** asChild=true면 Slot.Root, 아니면 button을 렌더하고 recipe 클래스를 외부 className과 병합 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    return (
      <Comp
        ref={ref}
        className={[button({ variant, size }), className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

- [ ] **Step 4: 테스트 통과 확인**

Run:
```bash
npx vitest run src/shared/ui/Button/Button.test.tsx
```
Expected: PASS (2 passed)

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/Button/Button.tsx src/shared/ui/Button/Button.test.tsx
git commit -m "feat: Button asChild 지원(Radix Slot)"
```

---

## Task 6: ref 전달 + native 속성 통과 검증

ref가 실제 DOM 노드에 연결되고, `disabled`/`onClick` 같은 표준 속성이 통과하는지 검증한다.

**Files:**
- Modify: `src/shared/ui/Button/Button.test.tsx`

- [ ] **Step 1: 실패하는 테스트 추가**

`Button.test.tsx` 상단 import를 보강한다.
```tsx
// 변경 전
import { describe, expect, it } from 'vitest';
// 변경 후
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
```

`describe` 블록 안에 두 테스트를 추가:
```tsx
  it('forwards ref to the underlying button node', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>확인</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes through native button attributes', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        비활성
      </Button>
    );

    const btn = screen.getByRole('button', { name: '비활성' });
    expect(btn).toBeDisabled();

    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
```

- [ ] **Step 2: 테스트 실행**

Run:
```bash
npx vitest run src/shared/ui/Button/Button.test.tsx
```
Expected: PASS (4 passed) — 구현이 이미 forwardRef와 `{...props}` 통과를 지원하므로 통과.

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/Button/Button.test.tsx
git commit -m "test: Button ref 전달과 native 속성 통과 검증"
```

---

## Task 7: Storybook 스토리

variant×size 매트릭스와 asChild/disabled 상태를 문서화한다. a11y 애드온이 axe 검사를 수행한다.

**Files:**
- Create: `src/shared/ui/Button/Button.stories.tsx`

- [ ] **Step 1: 스토리 작성**

`src/shared/ui/Button/Button.stories.tsx`:
```tsx
/** Button 상태 문서 — variant 매트릭스, 크기, asChild 링크, 비활성 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta = {
  title: 'shared/ui/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: '버튼' } };

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant='solid'>solid</Button>
      <Button variant='outline'>outline</Button>
      <Button variant='ghost'>ghost</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size='sm'>sm</Button>
      <Button size='md'>md</Button>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Button asChild>
      <a href='#'>링크 버튼</a>
    </Button>
  ),
};

export const Disabled: Story = { args: { children: '비활성', disabled: true } };
```

- [ ] **Step 2: Storybook 빌드로 스토리 렌더 검증**

Run:
```bash
npm run build-storybook
```
Expected: 빌드 성공(에러 없이 `storybook-static` 생성). Button 스토리가 컴파일·인덱싱된다.

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/Button/Button.stories.tsx
git commit -m "docs: Button Storybook 스토리 추가"
```

---

## Task 8: 전체 검증

**Files:** 없음(검증 전용)

- [ ] **Step 1: 외부에서 public API import 가능 확인**

`src/shared/ui` 밖에서 `@/shared/ui`로 import 되는지는 다음 단계의 type-check/build로 함께 검증된다(별도 소비처는 만들지 않음 — YAGNI).

- [ ] **Step 2: FSD 경계 검증**

Run:
```bash
npm run fsd
```
Expected: PASS — `shared/ui` slice가 `index.ts` public API를 갖추어 Steiger 경고 없음.

- [ ] **Step 3: 전체 CI 게이트**

Run:
```bash
npm run ci
```
Expected: PASS (fsd + lint + type-check + test + build 전부 통과)

- [ ] **Step 4: Storybook 정적 빌드 재확인**

Run:
```bash
npm run build-storybook
```
Expected: 빌드 성공.

---

## 완료 기준 (설계 §11 대응)

- `npm run ci` 통과.
- Button RTL 테스트 4종 통과(기본 렌더 / asChild / ref 전달 / native 속성 통과).
- `npm run build-storybook` 성공, Button 스토리 5개(Default/Variants/Sizes/AsLink/Disabled) 컴파일.
- `@/shared/ui`에서 `Button`, `ButtonProps` 노출.
