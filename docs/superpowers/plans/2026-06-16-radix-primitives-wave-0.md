# Radix 프리미티브 Wave 0 (폼 토대) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `shared/ui`에 Radix 기반 폼 프리미티브 8종(Label·Separator·Toggle·Switch·Checkbox·RadioGroup·ToggleGroup·Progress)을 Button 파이프라인대로 추가한다.

**Architecture:** 각 프리미티브는 Radix 파트를 얇게 감싸 vanilla-extract 스타일만 입힌다. 멀티파트는 네임스페이스 객체(`Switch.Root`/`Switch.Thumb`), 단일파트는 평이 컴포넌트(`Label`). prop 타입은 DOM이 아니라 `ComponentPropsWithoutRef<typeof RadixPart>`에서 끌어와 Radix 고유 prop을 보존한다. 각 컴포넌트는 RED→GREEN→REFACTOR로 만들고, Radix가 처리해 주는 항목을 코드 인라인 주석 + `docs/learning/radix-primitives.md`에 남긴다.

**Tech Stack:** React + TypeScript, `radix-ui`@1.5.0(통합 패키지), `@vanilla-extract/css` + `sprinkles`, Vitest + React Testing Library + `@testing-library/user-event`, Storybook.

**Spec:** [2026-06-16-radix-primitives-design.md](../specs/2026-06-16-radix-primitives-design.md) (§8 Wave 0).

---

## 공통 규약 (모든 Task 적용)

- **import 별칭:** Radix는 `import { Switch as SwitchPrimitive } from 'radix-ui'`처럼 `Primitive` 접미사로 들여와 우리 export 이름과 충돌을 피한다.
- **className 병합:** `[internalClass, className].filter(Boolean).join(' ')` (Button과 동일).
- **주석:** 파일 헤더 1줄 `/** */`, 모든 export 1줄 `/** */`, JSX 안 WHY는 한 줄 `{/* */}`, JSX 밖은 `//`.
- **테스트:** describe/it 한국어, 접근성 역할·동작으로 검증하고 클래스명은 단언하지 않는다.
- **검증 명령:** 단일 파일 `npx vitest run src/shared/ui/<Name>/<Name>.test.tsx`, 전체 `npm run test`, 타입 `npm run type-check`.
- **커밋 트레일러:** 모든 커밋 메시지 끝에 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

## File Structure

```
src/shared/ui/
├── Label/            { Label.tsx, Label.css.ts, Label.test.tsx, Label.stories.tsx }
├── Separator/        { Separator.tsx, Separator.css.ts, Separator.test.tsx, Separator.stories.tsx }
├── Toggle/           { Toggle.tsx, Toggle.css.ts, Toggle.test.tsx, Toggle.stories.tsx }
├── Switch/           { Switch.tsx, Switch.css.ts, Switch.test.tsx, Switch.stories.tsx }
├── Checkbox/         { Checkbox.tsx, Checkbox.css.ts, Checkbox.test.tsx, Checkbox.stories.tsx }
├── RadioGroup/       { RadioGroup.tsx, RadioGroup.css.ts, RadioGroup.test.tsx, RadioGroup.stories.tsx }
├── ToggleGroup/      { ToggleGroup.tsx, ToggleGroup.css.ts, ToggleGroup.test.tsx, ToggleGroup.stories.tsx }
├── Progress/         { Progress.tsx, Progress.css.ts, Progress.test.tsx, Progress.stories.tsx }
└── index.ts          # 프리미티브당 한 줄 export 추가 (Task마다 1줄)

docs/learning/radix-primitives.md   # Task 1에서 생성, 이후 섹션 누적
```

---

## Task 1: Label

**Files:**
- Create: `src/shared/ui/Label/Label.tsx`, `Label.css.ts`, `Label.test.tsx`, `Label.stories.tsx`
- Create: `docs/learning/radix-primitives.md`
- Modify: `src/shared/ui/index.ts`

- [ ] **Step 1: 실패하는 테스트 작성** — `src/shared/ui/Label/Label.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  it('htmlFor로 지정한 컨트롤에 연결된 라벨을 렌더한다', () => {
    render(
      <>
        <Label htmlFor='email'>이메일</Label>
        <input id='email' />
      </>
    );

    expect(screen.getByText('이메일')).toHaveAttribute('for', 'email');
  });

  it('라벨을 클릭하면 연결된 컨트롤로 포커스가 이동한다', async () => {
    render(
      <>
        <Label htmlFor='email'>이메일</Label>
        <input id='email' />
      </>
    );

    await userEvent.click(screen.getByText('이메일'));

    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('외부 className을 내부 클래스와 병합한다', () => {
    render(<Label className='extra'>이름</Label>);

    expect(screen.getByText('이름')).toHaveClass('extra');
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/ui/Label/Label.test.tsx`
Expected: FAIL — `Cannot find module './Label'`.

- [ ] **Step 3: 스타일 작성** — `src/shared/ui/Label/Label.css.ts`

```ts
/** Label 기본 타이포 — 구조만, 색·굵기 강조는 소비자 몫 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 폼 컨트롤 위 라벨 — 본문 색 + 기본 굵기 */
export const label = style([
  sprinkles({ display: 'inline-block' }),
  { color: vars.color.text, fontWeight: 500 },
]);
```

- [ ] **Step 4: 구현 작성** — `src/shared/ui/Label/Label.tsx`

```tsx
/** 공용 Label — Radix Label 위에 타이포만 입힌 폼 라벨 */
import { Label as LabelPrimitive } from 'radix-ui'; // htmlFor 연결·더블클릭 텍스트선택 방지를 Radix가 처리
import { forwardRef } from 'react';
import { label } from './Label.css';

/** Radix Label.Root props + 외부 className 병합 */
type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

/** label 요소를 렌더하고 연결된 컨트롤로 포커스를 넘긴다 */
export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={[label, className].filter(Boolean).join(' ')}
    {...props}
  />
));

Label.displayName = 'Label';
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/ui/Label/Label.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: 스토리 작성** — `src/shared/ui/Label/Label.stories.tsx`

```tsx
/** Label 상태 문서 — 기본, 컨트롤 연결 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from './Label';

const meta = {
  title: 'shared/ui/Label',
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: '이메일' } };

export const WithControl: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Label htmlFor='email'>이메일</Label>
      <input
        id='email'
        placeholder='you@example.com'
      />
    </div>
  ),
};
```

- [ ] **Step 7: public API 노출** — `src/shared/ui/index.ts`에 한 줄 추가

```ts
export { Label } from './Label/Label';
```

- [ ] **Step 8: 학습 문서 생성** — `docs/learning/radix-primitives.md`

```markdown
# Radix 프리미티브가 대신 해주는 것

`shared/ui`에서 감싼 Radix 프리미티브별로 Radix가 처리해 주는 항목을 누적 정리한다. "내가 왜 이걸 쓰는지"를 한눈에 보기 위한 학습 로그.

## Label — Radix가 해주는 것
- 연결: `htmlFor`로 라벨↔컨트롤 연결
- 동작: 라벨 클릭 시 연결 컨트롤 포커스 이동
- UX: 라벨 더블클릭 시 텍스트가 선택되지 않게 막아 폼 조작 방해를 줄임
```

- [ ] **Step 9: 전체 검증**

Run: `npm run type-check && npx vitest run src/shared/ui/Label`
Expected: 타입 에러 없음, 테스트 PASS.

- [ ] **Step 10: 커밋**

```bash
git add src/shared/ui/Label src/shared/ui/index.ts docs/learning/radix-primitives.md
git commit -m "feat(ui): Label 프리미티브 추가" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Separator

**Files:**
- Create: `src/shared/ui/Separator/Separator.tsx`, `Separator.css.ts`, `Separator.test.tsx`, `Separator.stories.tsx`
- Modify: `src/shared/ui/index.ts`, `docs/learning/radix-primitives.md`

- [ ] **Step 1: 실패하는 테스트 작성** — `src/shared/ui/Separator/Separator.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator';

describe('Separator', () => {
  it('기본은 의미 있는 separator 역할로 렌더한다', () => {
    render(<Separator />);

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('decorative면 스크린리더에서 역할을 숨긴다', () => {
    render(<Separator decorative />);

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('orientation을 data-orientation으로 반영한다', () => {
    render(
      <Separator
        orientation='vertical'
        data-testid='sep'
      />
    );

    expect(screen.getByTestId('sep')).toHaveAttribute(
      'data-orientation',
      'vertical'
    );
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/ui/Separator/Separator.test.tsx`
Expected: FAIL — `Cannot find module './Separator'`.

- [ ] **Step 3: 스타일 작성** — `src/shared/ui/Separator/Separator.css.ts`

```ts
/** Separator 선 — 1px, 방향은 data-orientation으로 분기 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 가로면 너비 가득 1px 높이, 세로면 높이 가득 1px 너비 */
export const separator = style({
  backgroundColor: vars.color.border,
  selectors: {
    '&[data-orientation="horizontal"]': { height: '1px', width: '100%' },
    '&[data-orientation="vertical"]': { width: '1px', height: '100%' },
  },
});
```

- [ ] **Step 4: 구현 작성** — `src/shared/ui/Separator/Separator.tsx`

```tsx
/** 공용 Separator — Radix Separator 위에 선 스타일만 입힌 구분선 */
import { Separator as SeparatorPrimitive } from 'radix-ui'; // role=separator/decorative·aria-orientation을 Radix가 처리
import { forwardRef } from 'react';
import { separator } from './Separator.css';

/** Radix Separator.Root props(orientation·decorative 포함) + 외부 className */
type SeparatorProps = React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
>;

/** 가로/세로 구분선 — decorative면 보조기기에서 숨김 */
export const Separator = forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    className={[separator, className].filter(Boolean).join(' ')}
    {...props}
  />
));

Separator.displayName = 'Separator';
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/ui/Separator/Separator.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: 스토리 작성** — `src/shared/ui/Separator/Separator.stories.tsx`

```tsx
/** Separator 상태 문서 — 가로, 세로 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Separator } from './Separator';

const meta = {
  title: 'shared/ui/Separator',
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <p>위 문단</p>
      <Separator />
      <p>아래 문단</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', height: 24 }}>
      <span>홈</span>
      <Separator orientation='vertical' />
      <span>소개</span>
    </div>
  ),
};
```

- [ ] **Step 7: public API 노출** — `src/shared/ui/index.ts`에 추가

```ts
export { Separator } from './Separator/Separator';
```

- [ ] **Step 8: 학습 문서 추가** — `docs/learning/radix-primitives.md` 끝에 섹션 추가

```markdown

## Separator — Radix가 해주는 것
- 접근성: `decorative=false`면 `role="separator"`, `true`면 역할 제거(순수 장식)
- 방향: `orientation`을 `aria-orientation` + `data-orientation`으로 노출(세로/가로 스타일 분기 근거)
```

- [ ] **Step 9: 전체 검증**

Run: `npm run type-check && npx vitest run src/shared/ui/Separator`
Expected: 타입 에러 없음, 테스트 PASS.

- [ ] **Step 10: 커밋**

```bash
git add src/shared/ui/Separator src/shared/ui/index.ts docs/learning/radix-primitives.md
git commit -m "feat(ui): Separator 프리미티브 추가" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Toggle

**Files:**
- Create: `src/shared/ui/Toggle/Toggle.tsx`, `Toggle.css.ts`, `Toggle.test.tsx`, `Toggle.stories.tsx`
- Modify: `src/shared/ui/index.ts`, `docs/learning/radix-primitives.md`

- [ ] **Step 1: 실패하는 테스트 작성** — `src/shared/ui/Toggle/Toggle.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('클릭하면 눌림 상태가 토글된다', async () => {
    render(<Toggle aria-label='굵게'>B</Toggle>);

    const btn = screen.getByRole('button', { name: '굵게' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(btn);

    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('onPressedChange로 변경을 알린다', async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle
        aria-label='굵게'
        onPressedChange={onPressedChange}>
        B
      </Toggle>
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('disabled면 토글되지 않는다', async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle
        aria-label='굵게'
        disabled
        onPressedChange={onPressedChange}>
        B
      </Toggle>
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onPressedChange).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/ui/Toggle/Toggle.test.tsx`
Expected: FAIL — `Cannot find module './Toggle'`.

- [ ] **Step 3: 스타일 작성** — `src/shared/ui/Toggle/Toggle.css.ts`

```ts
/** Toggle 버튼 — ghost 모양, on이면 accent 틴트(구조적 상태색) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 단일 on/off 버튼 — 눌림은 data-state="on"으로 표시 */
export const toggle = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: '12',
    py: '8',
    r: 'md',
    gap: '8',
  }),
  {
    cursor: 'pointer',
    background: 'transparent',
    color: vars.color.text,
    border: `1px solid ${vars.color.border}`,
    selectors: {
      '&[data-state="on"]': {
        background: `color-mix(in srgb, ${vars.color.accent} 16%, transparent)`,
        borderColor: vars.color.accent,
      },
    },
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
]);
```

- [ ] **Step 4: 구현 작성** — `src/shared/ui/Toggle/Toggle.tsx`

```tsx
/** 공용 Toggle — Radix Toggle 위에 눌림 스타일만 입힌 단일 on/off 버튼 */
import { Toggle as TogglePrimitive } from 'radix-ui'; // aria-pressed·data-state·controlled/uncontrolled를 Radix가 처리
import { forwardRef } from 'react';
import { toggle } from './Toggle.css';

/** Radix Toggle.Root props(pressed·onPressedChange 포함) + 외부 className */
type ToggleProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>;

/** 단일 토글 버튼 — 눌림 상태를 스스로/외부 제어로 관리 */
export const Toggle = forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={[toggle, className].filter(Boolean).join(' ')}
    {...props}
  />
));

Toggle.displayName = 'Toggle';
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/ui/Toggle/Toggle.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: 스토리 작성** — `src/shared/ui/Toggle/Toggle.stories.tsx`

```tsx
/** Toggle 상태 문서 — 기본, 눌림 기본값, 비활성 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toggle } from './Toggle';

const meta = {
  title: 'shared/ui/Toggle',
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'B', 'aria-label': '굵게' } };

export const Pressed: Story = {
  args: { children: 'B', 'aria-label': '굵게', defaultPressed: true },
};

export const Disabled: Story = {
  args: { children: 'B', 'aria-label': '굵게', disabled: true },
};
```

- [ ] **Step 7: public API 노출** — `src/shared/ui/index.ts`에 추가

```ts
export { Toggle } from './Toggle/Toggle';
```

- [ ] **Step 8: 학습 문서 추가** — `docs/learning/radix-primitives.md` 끝에 섹션 추가

```markdown

## Toggle — Radix가 해주는 것
- 상태: controlled(`pressed`)/uncontrolled(`defaultPressed`) 둘 다
- 접근성: 버튼에 `aria-pressed` 부여
- 스타일 훅: 눌림을 `data-state="on|off"`로 노출
```

- [ ] **Step 9: 전체 검증**

Run: `npm run type-check && npx vitest run src/shared/ui/Toggle`
Expected: 타입 에러 없음, 테스트 PASS.

- [ ] **Step 10: 커밋**

```bash
git add src/shared/ui/Toggle src/shared/ui/index.ts docs/learning/radix-primitives.md
git commit -m "feat(ui): Toggle 프리미티브 추가" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Switch

**Files:**
- Create: `src/shared/ui/Switch/Switch.tsx`, `Switch.css.ts`, `Switch.test.tsx`, `Switch.stories.tsx`
- Modify: `src/shared/ui/index.ts`, `docs/learning/radix-primitives.md`

- [ ] **Step 1: 실패하는 테스트 작성** — `src/shared/ui/Switch/Switch.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('switch 역할로 렌더하고 클릭하면 on/off가 토글된다', async () => {
    render(
      <Switch.Root aria-label='알림'>
        <Switch.Thumb />
      </Switch.Root>
    );

    const sw = screen.getByRole('switch', { name: '알림' });
    expect(sw).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(sw);

    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('Space 키로도 토글된다', async () => {
    render(
      <Switch.Root aria-label='알림'>
        <Switch.Thumb />
      </Switch.Root>
    );

    const sw = screen.getByRole('switch', { name: '알림' });
    sw.focus();
    await userEvent.keyboard(' ');

    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('disabled면 onCheckedChange가 호출되지 않는다', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch.Root
        aria-label='알림'
        disabled
        onCheckedChange={onCheckedChange}>
        <Switch.Thumb />
      </Switch.Root>
    );

    await userEvent.click(screen.getByRole('switch'));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/ui/Switch/Switch.test.tsx`
Expected: FAIL — `Cannot find module './Switch'`.

- [ ] **Step 3: 스타일 작성** — `src/shared/ui/Switch/Switch.css.ts`

```ts
/** Switch 트랙·썸 — off는 border, on은 accent. 썸 위치만 data-state로 이동 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 트랙 — 치수/위치는 sprinkles 밖이라 style()에 직접 둔다 */
export const root = style({
  position: 'relative',
  width: '2.5rem',
  height: '1.5rem',
  flexShrink: 0,
  padding: 0,
  border: 'none',
  borderRadius: '9999px',
  background: vars.color.border,
  cursor: 'pointer',
  transition: 'background 120ms ease',
  selectors: {
    '&[data-state="checked"]': { background: vars.color.accent },
  },
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
});

/** 손잡이 — on이면 오른쪽으로 슬라이드(트랙 폭 - 썸 - 좌우 2px) */
export const thumb = style({
  display: 'block',
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: '9999px',
  background: vars.color.background,
  transform: 'translateX(2px)',
  transition: 'transform 120ms ease',
  willChange: 'transform',
  selectors: {
    '&[data-state="checked"]': {
      transform: 'translateX(calc(2.5rem - 1.25rem - 2px))',
    },
  },
});
```

- [ ] **Step 4: 구현 작성** — `src/shared/ui/Switch/Switch.tsx`

```tsx
/** 공용 Switch — Radix Switch 위에 트랙/썸 스타일만 입힌 on/off 토글 */
import { Switch as SwitchPrimitive } from 'radix-ui'; // checked 상태·키보드·ARIA switch·폼 input을 Radix가 처리
import { forwardRef } from 'react';
import { root, thumb } from './Switch.css';

/** 트랙 — Radix Switch.Root props + 외부 className 병합 */
const Root = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={[root, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Root.displayName = 'Switch.Root';

/** 손잡이 — 위치 연출만 우리 몫, data-state는 Radix가 채운다 */
const Thumb = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    className={[thumb, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Thumb.displayName = 'Switch.Thumb';

/** 네임스페이스 — <Switch.Root><Switch.Thumb /></Switch.Root> */
export const Switch = { Root, Thumb };
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/ui/Switch/Switch.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: 스토리 작성** — `src/shared/ui/Switch/Switch.stories.tsx`

```tsx
/** Switch 상태 문서 — 기본, 켜짐 기본값, 비활성 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Switch } from './Switch';

const meta = { title: 'shared/ui/Switch' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Switch.Root aria-label='알림'>
      <Switch.Thumb />
    </Switch.Root>
  ),
};

export const On: Story = {
  render: () => (
    <Switch.Root
      aria-label='알림'
      defaultChecked>
      <Switch.Thumb />
    </Switch.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Switch.Root
      aria-label='알림'
      disabled>
      <Switch.Thumb />
    </Switch.Root>
  ),
};
```

- [ ] **Step 7: public API 노출** — `src/shared/ui/index.ts`에 추가

```ts
export { Switch } from './Switch/Switch';
```

- [ ] **Step 8: 학습 문서 추가** — `docs/learning/radix-primitives.md` 끝에 섹션 추가

```markdown

## Switch — Radix가 해주는 것
- 상태: controlled(`checked`)/uncontrolled(`defaultChecked`) 둘 다
- 접근성: `role="switch"` + `aria-checked`
- 키보드: Space/Enter로 토글
- 폼: 숨은 input으로 `name`/`value` 제출 연동
- 스타일 훅: 트랙·썸에 `data-state="checked|unchecked"`
```

- [ ] **Step 9: 전체 검증**

Run: `npm run type-check && npx vitest run src/shared/ui/Switch`
Expected: 타입 에러 없음, 테스트 PASS.

- [ ] **Step 10: 커밋**

```bash
git add src/shared/ui/Switch src/shared/ui/index.ts docs/learning/radix-primitives.md
git commit -m "feat(ui): Switch 프리미티브 추가" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Checkbox

**Files:**
- Create: `src/shared/ui/Checkbox/Checkbox.tsx`, `Checkbox.css.ts`, `Checkbox.test.tsx`, `Checkbox.stories.tsx`
- Modify: `src/shared/ui/index.ts`, `docs/learning/radix-primitives.md`

- [ ] **Step 1: 실패하는 테스트 작성** — `src/shared/ui/Checkbox/Checkbox.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('클릭하면 체크 상태가 토글된다', async () => {
    render(
      <Checkbox.Root aria-label='동의'>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
    );

    const box = screen.getByRole('checkbox', { name: '동의' });
    expect(box).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(box);

    expect(box).toHaveAttribute('aria-checked', 'true');
  });

  it('indeterminate면 aria-checked를 mixed로 표시한다', () => {
    render(
      <Checkbox.Root
        aria-label='전체'
        checked='indeterminate'>
        <Checkbox.Indicator>−</Checkbox.Indicator>
      </Checkbox.Root>
    );

    expect(screen.getByRole('checkbox', { name: '전체' })).toHaveAttribute(
      'aria-checked',
      'mixed'
    );
  });

  it('disabled면 토글되지 않는다', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox.Root
        aria-label='동의'
        disabled
        onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
    );

    await userEvent.click(screen.getByRole('checkbox'));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/ui/Checkbox/Checkbox.test.tsx`
Expected: FAIL — `Cannot find module './Checkbox'`.

- [ ] **Step 3: 스타일 작성** — `src/shared/ui/Checkbox/Checkbox.css.ts`

```ts
/** Checkbox 박스·체크 — checked/indeterminate면 accent로 채움 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 박스 — 1.25rem 정사각, 체크 표시는 accentForeground 색으로 */
export const root = style({
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.background,
  color: vars.color.accentForeground,
  cursor: 'pointer',
  selectors: {
    '&[data-state="checked"], &[data-state="indeterminate"]': {
      background: vars.color.accent,
      borderColor: vars.color.accent,
    },
  },
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
});

/** 체크/대시 — checked·indeterminate일 때만 Radix가 마운트 */
export const indicator = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  lineHeight: 1,
  color: 'currentColor',
});
```

- [ ] **Step 4: 구현 작성** — `src/shared/ui/Checkbox/Checkbox.tsx`

```tsx
/** 공용 Checkbox — Radix Checkbox 위에 박스/체크 스타일만 입힌 체크박스 */
import { Checkbox as CheckboxPrimitive } from 'radix-ui'; // checked/indeterminate·aria-checked=mixed·폼 input을 Radix가 처리
import { forwardRef } from 'react';
import { indicator, root } from './Checkbox.css';

/** 박스 — Radix Checkbox.Root props + 외부 className 병합 */
const Root = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={[root, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Root.displayName = 'Checkbox.Root';

/** 체크 표시 — children(아이콘/문자)을 받아 표시 */
const Indicator = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Indicator
    ref={ref}
    className={[indicator, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Indicator.displayName = 'Checkbox.Indicator';

/** 네임스페이스 — <Checkbox.Root><Checkbox.Indicator>✓</Checkbox.Indicator></Checkbox.Root> */
export const Checkbox = { Root, Indicator };
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/ui/Checkbox/Checkbox.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: 스토리 작성** — `src/shared/ui/Checkbox/Checkbox.stories.tsx`

```tsx
/** Checkbox 상태 문서 — 기본, 체크됨, indeterminate */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from './Checkbox';

const meta = { title: 'shared/ui/Checkbox' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Checkbox.Root aria-label='동의'>
      <Checkbox.Indicator>✓</Checkbox.Indicator>
    </Checkbox.Root>
  ),
};

export const Checked: Story = {
  render: () => (
    <Checkbox.Root
      aria-label='동의'
      defaultChecked>
      <Checkbox.Indicator>✓</Checkbox.Indicator>
    </Checkbox.Root>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <Checkbox.Root
      aria-label='전체'
      checked='indeterminate'>
      <Checkbox.Indicator>−</Checkbox.Indicator>
    </Checkbox.Root>
  ),
};
```

- [ ] **Step 7: public API 노출** — `src/shared/ui/index.ts`에 추가

```ts
export { Checkbox } from './Checkbox/Checkbox';
```

- [ ] **Step 8: 학습 문서 추가** — `docs/learning/radix-primitives.md` 끝에 섹션 추가

```markdown

## Checkbox — Radix가 해주는 것
- 상태: `checked`에 `boolean | "indeterminate"` 허용(3-상태)
- 접근성: `role="checkbox"` + `aria-checked`(true/false/mixed)
- 마운트: Indicator는 checked·indeterminate일 때만 렌더
- 폼: 숨은 input으로 제출 연동
```

- [ ] **Step 9: 전체 검증**

Run: `npm run type-check && npx vitest run src/shared/ui/Checkbox`
Expected: 타입 에러 없음, 테스트 PASS.

- [ ] **Step 10: 커밋**

```bash
git add src/shared/ui/Checkbox src/shared/ui/index.ts docs/learning/radix-primitives.md
git commit -m "feat(ui): Checkbox 프리미티브 추가" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: RadioGroup

**Files:**
- Create: `src/shared/ui/RadioGroup/RadioGroup.tsx`, `RadioGroup.css.ts`, `RadioGroup.test.tsx`, `RadioGroup.stories.tsx`
- Modify: `src/shared/ui/index.ts`, `docs/learning/radix-primitives.md`

- [ ] **Step 1: 실패하는 테스트 작성** — `src/shared/ui/RadioGroup/RadioGroup.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('radiogroup과 radio 항목을 렌더한다', () => {
    render(
      <RadioGroup.Root
        aria-label='요금제'
        defaultValue='free'>
        <RadioGroup.Item value='free'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <RadioGroup.Item value='pro'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </RadioGroup.Root>
    );

    expect(
      screen.getByRole('radiogroup', { name: '요금제' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('항목을 클릭하면 단일 선택된다', async () => {
    render(
      <RadioGroup.Root
        aria-label='요금제'
        defaultValue='free'>
        <RadioGroup.Item value='free'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <RadioGroup.Item value='pro'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </RadioGroup.Root>
    );

    const [free, pro] = screen.getAllByRole('radio');
    expect(free).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(pro);

    expect(pro).toHaveAttribute('aria-checked', 'true');
    expect(free).toHaveAttribute('aria-checked', 'false');
  });

  it('onValueChange로 선택을 알린다', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root
        aria-label='요금제'
        onValueChange={onValueChange}>
        <RadioGroup.Item value='free'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <RadioGroup.Item value='pro'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </RadioGroup.Root>
    );

    await userEvent.click(screen.getAllByRole('radio')[1]);

    expect(onValueChange).toHaveBeenCalledWith('pro');
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/ui/RadioGroup/RadioGroup.test.tsx`
Expected: FAIL — `Cannot find module './RadioGroup'`.

- [ ] **Step 3: 스타일 작성** — `src/shared/ui/RadioGroup/RadioGroup.css.ts`

```ts
/** RadioGroup 묶음·원·점 — 선택 시 accent 점 표시 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 세로 묶음 — 항목 간격만 */
export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: '8' }),
]);

/** 항목 원 — 1.25rem, 선택되면 테두리 accent */
export const item = style({
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '9999px',
  border: `1px solid ${vars.color.border}`,
  background: vars.color.background,
  cursor: 'pointer',
  selectors: {
    '&[data-state="checked"]': { borderColor: vars.color.accent },
  },
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
});

/** 선택 점 — Indicator가 마운트될 때만 보임 */
export const indicator = style({
  display: 'inline-flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  '::after': {
    content: '""',
    display: 'block',
    width: '0.625rem',
    height: '0.625rem',
    borderRadius: '9999px',
    background: vars.color.accent,
  },
});
```

- [ ] **Step 4: 구현 작성** — `src/shared/ui/RadioGroup/RadioGroup.tsx`

```tsx
/** 공용 RadioGroup — Radix RadioGroup 위에 원/점 스타일만 입힌 단일선택 그룹 */
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'; // radiogroup·roving tabindex·화살표 단일선택을 Radix가 처리
import { forwardRef } from 'react';
import { indicator, item, root } from './RadioGroup.css';

/** 묶음 — Radix RadioGroup.Root props + 외부 className 병합 */
const Root = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={[root, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Root.displayName = 'RadioGroup.Root';

/** 항목 — 각 선택지(value 필수) */
const Item = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={[item, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Item.displayName = 'RadioGroup.Item';

/** 선택 점 — 선택된 항목에서만 Radix가 마운트 */
const Indicator = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Indicator
    ref={ref}
    className={[indicator, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Indicator.displayName = 'RadioGroup.Indicator';

/** 네임스페이스 — <RadioGroup.Root><RadioGroup.Item><RadioGroup.Indicator /></RadioGroup.Item></RadioGroup.Root> */
export const RadioGroup = { Root, Item, Indicator };
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/ui/RadioGroup/RadioGroup.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: 스토리 작성** — `src/shared/ui/RadioGroup/RadioGroup.stories.tsx`

```tsx
/** RadioGroup 상태 문서 — 라벨과 함께 단일선택 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from '../Label/Label';
import { RadioGroup } from './RadioGroup';

const meta = { title: 'shared/ui/RadioGroup' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup.Root
      aria-label='요금제'
      defaultValue='free'>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <RadioGroup.Item
          id='r-free'
          value='free'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor='r-free'>무료</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <RadioGroup.Item
          id='r-pro'
          value='pro'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor='r-pro'>프로</Label>
      </div>
    </RadioGroup.Root>
  ),
};
```

- [ ] **Step 7: public API 노출** — `src/shared/ui/index.ts`에 추가

```ts
export { RadioGroup } from './RadioGroup/RadioGroup';
```

- [ ] **Step 8: 학습 문서 추가** — `docs/learning/radix-primitives.md` 끝에 섹션 추가

```markdown

## RadioGroup — Radix가 해주는 것
- 접근성: 묶음 `role="radiogroup"`, 항목 `role="radio"` + `aria-checked`
- 키보드: roving tabindex로 화살표 이동, 이동 시 단일 선택
- 상태: controlled(`value`)/uncontrolled(`defaultValue`), `onValueChange` 알림
- 폼: 숨은 input으로 제출 연동
```

- [ ] **Step 9: 전체 검증**

Run: `npm run type-check && npx vitest run src/shared/ui/RadioGroup`
Expected: 타입 에러 없음, 테스트 PASS.

- [ ] **Step 10: 커밋**

```bash
git add src/shared/ui/RadioGroup src/shared/ui/index.ts docs/learning/radix-primitives.md
git commit -m "feat(ui): RadioGroup 프리미티브 추가" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: ToggleGroup

**Files:**
- Create: `src/shared/ui/ToggleGroup/ToggleGroup.tsx`, `ToggleGroup.css.ts`, `ToggleGroup.test.tsx`, `ToggleGroup.stories.tsx`
- Modify: `src/shared/ui/index.ts`, `docs/learning/radix-primitives.md`

- [ ] **Step 1: 실패하는 테스트 작성** — `src/shared/ui/ToggleGroup/ToggleGroup.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToggleGroup } from './ToggleGroup';

describe('ToggleGroup', () => {
  it('single 타입은 한 번에 한 항목만 선택한다', async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup.Root
        type='single'
        aria-label='정렬'
        onValueChange={onValueChange}>
        <ToggleGroup.Item value='left'>왼쪽</ToggleGroup.Item>
        <ToggleGroup.Item value='center'>가운데</ToggleGroup.Item>
      </ToggleGroup.Root>
    );

    await userEvent.click(screen.getByText('왼쪽'));
    expect(onValueChange).toHaveBeenLastCalledWith('left');

    await userEvent.click(screen.getByText('가운데'));
    expect(onValueChange).toHaveBeenLastCalledWith('center');
  });

  it('multiple 타입은 여러 항목을 선택한다', async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup.Root
        type='multiple'
        aria-label='스타일'
        onValueChange={onValueChange}>
        <ToggleGroup.Item value='bold'>B</ToggleGroup.Item>
        <ToggleGroup.Item value='italic'>I</ToggleGroup.Item>
      </ToggleGroup.Root>
    );

    await userEvent.click(screen.getByText('B'));
    await userEvent.click(screen.getByText('I'));

    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/ui/ToggleGroup/ToggleGroup.test.tsx`
Expected: FAIL — `Cannot find module './ToggleGroup'`.

- [ ] **Step 3: 스타일 작성** — `src/shared/ui/ToggleGroup/ToggleGroup.css.ts`

```ts
/** ToggleGroup 분절 버튼 — 선택 항목은 accent 틴트 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 가로 묶음 — 항목 간격만 */
export const root = style([sprinkles({ display: 'inline-flex', gap: '4' })]);

/** 항목 버튼 — on이면 accent 틴트 + 테두리 강조 */
export const item = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: '12',
    py: '8',
    r: 'md',
  }),
  {
    cursor: 'pointer',
    background: 'transparent',
    color: vars.color.text,
    border: `1px solid ${vars.color.border}`,
    selectors: {
      '&[data-state="on"]': {
        background: `color-mix(in srgb, ${vars.color.accent} 16%, transparent)`,
        borderColor: vars.color.accent,
      },
    },
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
]);
```

- [ ] **Step 4: 구현 작성** — `src/shared/ui/ToggleGroup/ToggleGroup.tsx`

```tsx
/** 공용 ToggleGroup — Radix ToggleGroup 위에 분절 버튼 스타일만 입힌 토글 묶음 */
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'; // single/multiple 선택·roving focus·그룹 aria를 Radix가 처리
import { forwardRef } from 'react';
import { item, root } from './ToggleGroup.css';

/** 묶음 — Radix ToggleGroup.Root props(type·value 포함) + 외부 className */
const Root = forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={[root, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Root.displayName = 'ToggleGroup.Root';

/** 항목 — 각 토글(value 필수) */
const Item = forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={[item, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Item.displayName = 'ToggleGroup.Item';

/** 네임스페이스 — <ToggleGroup.Root type="single"><ToggleGroup.Item /></ToggleGroup.Root> */
export const ToggleGroup = { Root, Item };
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/ui/ToggleGroup/ToggleGroup.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: 스토리 작성** — `src/shared/ui/ToggleGroup/ToggleGroup.stories.tsx`

```tsx
/** ToggleGroup 상태 문서 — single(정렬), multiple(스타일) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToggleGroup } from './ToggleGroup';

const meta = { title: 'shared/ui/ToggleGroup' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <ToggleGroup.Root
      type='single'
      aria-label='정렬'
      defaultValue='left'>
      <ToggleGroup.Item value='left'>왼쪽</ToggleGroup.Item>
      <ToggleGroup.Item value='center'>가운데</ToggleGroup.Item>
      <ToggleGroup.Item value='right'>오른쪽</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup.Root
      type='multiple'
      aria-label='스타일'>
      <ToggleGroup.Item value='bold'>B</ToggleGroup.Item>
      <ToggleGroup.Item value='italic'>I</ToggleGroup.Item>
      <ToggleGroup.Item value='underline'>U</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};
```

- [ ] **Step 7: public API 노출** — `src/shared/ui/index.ts`에 추가

```ts
export { ToggleGroup } from './ToggleGroup/ToggleGroup';
```

- [ ] **Step 8: 학습 문서 추가** — `docs/learning/radix-primitives.md` 끝에 섹션 추가

```markdown

## ToggleGroup — Radix가 해주는 것
- 선택 모드: `type="single"`(string 값)/`type="multiple"`(string[] 값)
- 키보드: roving focus로 화살표 이동
- 접근성: 묶음 그룹 의미론, 항목 `data-state="on|off"`
- 상태: controlled(`value`)/uncontrolled(`defaultValue`), `onValueChange` 알림
```

- [ ] **Step 9: 전체 검증**

Run: `npm run type-check && npx vitest run src/shared/ui/ToggleGroup`
Expected: 타입 에러 없음, 테스트 PASS.

- [ ] **Step 10: 커밋**

```bash
git add src/shared/ui/ToggleGroup src/shared/ui/index.ts docs/learning/radix-primitives.md
git commit -m "feat(ui): ToggleGroup 프리미티브 추가" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Progress

**Files:**
- Create: `src/shared/ui/Progress/Progress.tsx`, `Progress.css.ts`, `Progress.test.tsx`, `Progress.stories.tsx`
- Modify: `src/shared/ui/index.ts`, `docs/learning/radix-primitives.md`

- [ ] **Step 1: 실패하는 테스트 작성** — `src/shared/ui/Progress/Progress.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('progressbar 역할과 현재값을 노출한다', () => {
    render(
      <Progress
        value={40}
        aria-label='업로드'
      />
    );

    const bar = screen.getByRole('progressbar', { name: '업로드' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('value 미지정이면 indeterminate 상태로 둔다', () => {
    render(<Progress aria-label='대기' />);

    expect(screen.getByRole('progressbar', { name: '대기' })).toHaveAttribute(
      'data-state',
      'indeterminate'
    );
  });

  it('max 기준으로 현재값을 반영한다', () => {
    render(
      <Progress
        value={5}
        max={10}
        aria-label='단계'
      />
    );

    expect(screen.getByRole('progressbar', { name: '단계' })).toHaveAttribute(
      'aria-valuenow',
      '5'
    );
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/shared/ui/Progress/Progress.test.tsx`
Expected: FAIL — `Cannot find module './Progress'`.

- [ ] **Step 3: 스타일 작성** — `src/shared/ui/Progress/Progress.css.ts`

```ts
/** Progress 트랙·막대 — 막대는 value/max 비율만큼 채움 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 트랙 — text 10% 틴트로 4테마 공통 은은한 배경 */
export const root = style({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '0.5rem',
  borderRadius: '9999px',
  background: `color-mix(in srgb, ${vars.color.text} 10%, transparent)`,
});

/** 채움 막대 — 너비 100%를 두고 translateX로 비율만큼만 노출 */
export const indicator = style({
  width: '100%',
  height: '100%',
  background: vars.color.accent,
  transition: 'transform 200ms ease',
});
```

- [ ] **Step 4: 구현 작성** — `src/shared/ui/Progress/Progress.tsx`

```tsx
/** 공용 Progress — Radix Progress 위에 트랙/막대 스타일을 입힌 진행 표시 */
import { Progress as ProgressPrimitive } from 'radix-ui'; // role=progressbar·aria-valuenow/max·indeterminate data-state를 Radix가 처리
import { forwardRef } from 'react';
import { indicator, root } from './Progress.css';

/** Radix Progress.Root props(value·max 포함) + 외부 className */
type ProgressProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
>;

/** value(0~max) 비율만큼 막대를 채운다. value 미지정이면 Radix가 indeterminate 처리 */
export const Progress = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, max = 100, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={value}
    max={max}
    className={[root, className].filter(Boolean).join(' ')}
    {...props}>
    {/* 채움 막대 위치 연출만 우리 몫 — 부족분만큼 왼쪽으로 밀어 비율 표시 */}
    <ProgressPrimitive.Indicator
      className={indicator}
      style={{ transform: `translateX(-${100 - ((value ?? 0) / max) * 100}%)` }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = 'Progress';
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npx vitest run src/shared/ui/Progress/Progress.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: 스토리 작성** — `src/shared/ui/Progress/Progress.stories.tsx`

```tsx
/** Progress 상태 문서 — 진행 중, 완료, indeterminate */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Progress } from './Progress';

const meta = {
  title: 'shared/ui/Progress',
  component: Progress,
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Half: Story = { args: { value: 50, 'aria-label': '업로드' } };

export const Complete: Story = { args: { value: 100, 'aria-label': '업로드' } };

export const Indeterminate: Story = { args: { 'aria-label': '대기' } };
```

- [ ] **Step 7: public API 노출** — `src/shared/ui/index.ts`에 추가

```ts
export { Progress } from './Progress/Progress';
```

- [ ] **Step 8: 학습 문서 추가** — `docs/learning/radix-primitives.md` 끝에 섹션 추가

```markdown

## Progress — Radix가 해주는 것
- 접근성: `role="progressbar"` + `aria-valuenow`/`aria-valuemax`/`aria-valuemin`
- 상태: `value`가 `null`/미지정이면 indeterminate(`data-state="indeterminate"`)
- 단위: `max`로 분모 지정(기본 100)
```

- [ ] **Step 9: 전체 검증**

Run: `npm run type-check && npx vitest run src/shared/ui/Progress`
Expected: 타입 에러 없음, 테스트 PASS.

- [ ] **Step 10: 커밋**

```bash
git add src/shared/ui/Progress src/shared/ui/index.ts docs/learning/radix-primitives.md
git commit -m "feat(ui): Progress 프리미티브 추가" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Wave 0 마무리 검증

**Files:** 없음 (검증 전용)

- [ ] **Step 1: FSD 경계 검사**

Run: `npm run fsd`
Expected: Steiger 위반 없음 (각 프리미티브가 `shared/ui` 안에서만 의존, public API로 노출).

- [ ] **Step 2: 린트 + 타입 + 테스트**

Run: `npm run lint && npm run type-check && npm run test`
Expected: 전부 PASS. Wave 0 신규 테스트(8개 컴포넌트)와 기존 Button 테스트 모두 통과.

- [ ] **Step 3: 포맷 정리**

Run: `npm run format`
Expected: 변경 파일 prettier 정리. (마무리 검증 루틴: fsd + lint + type-check + test + format)

- [ ] **Step 4: Storybook 빌드 + a11y 수동 확인 (선택)**

Run: `npm run build-storybook`
Expected: 빌드 성공. `npm run storybook`으로 띄워 8개 컴포넌트 스토리의 a11y 패널을 눈으로 확인한다. (이 단계는 `npm run ci` 게이트에 포함되지 않으므로 수동.)

- [ ] **Step 5: 포맷 변경분 커밋 (있으면)**

```bash
git add -A
git commit -m "style(ui): Wave 0 프리미티브 포맷 정리" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review (작성자 점검 완료)

- **Spec 커버리지:** Wave 0 8종(§8) 전부 Task 1~8로 1:1 매핑. 공통 규약(§3 네임스페이스/평이, §3 prop 타입 from Radix, §5 인라인 WHY + 학습 md, §6 역할·동작 테스트)이 각 Task 단계에 반영됨. overlay 토큰(§4)·Wave 1~4는 본 플랜 범위 밖(스펙대로 이후 웨이브).
- **플레이스홀더:** 모든 Step에 실제 코드/명령/기대값 명시. "TBD"·"적절히 처리" 없음.
- **타입 일관성:** 멀티파트는 `{ Root, ... }` 네임스페이스, 단일파트는 `forwardRef` 단일 컴포넌트로 통일. import 별칭 `*Primitive` 일관. prop 타입은 전부 `ComponentPropsWithoutRef<typeof XPrimitive.Part>`.
- **주의(구현 중 확인):** Radix 단일파트 export가 `Label.Root`/`Label.Label` 양쪽으로 노출되나 `.Root` 사용으로 통일. `:disabled`·`::after`·`selectors` 패턴은 Button.css.ts에서 검증된 vanilla-extract 문법.
