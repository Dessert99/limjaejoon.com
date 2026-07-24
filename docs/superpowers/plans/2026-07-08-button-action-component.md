# Button Action Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework `src/shared/ui/Button` into a SEED-inspired action button with explicit variants, compound icon slots, loading display, browser-safe states, and accessibility checks.

**Architecture:** Keep the current `Button.tsx` + `Button.css.ts` boundary. `Button.tsx` owns render structure, `asChild`, state attributes, loading layer, and development warnings. `Button.css.ts` owns recipe variants, size/layout classes, icon slot styles, browser hover/active behavior, nowrap layout, and reduced-motion handling.

**Tech Stack:** React 19, Radix Slot, TypeScript, vanilla-extract recipe, Vitest, Testing Library, Storybook.

---

### Task 1: Button Behavior Contract

**Files:**
- Modify: `src/shared/ui/Button/Button.test.tsx`
- Modify: `src/shared/ui/Button/Button.tsx`
- Modify: `src/shared/ui/Button/Button.css.ts`

- [ ] **Step 1: Write failing tests**

Cover the desired public contract:

```tsx
it('기본 button type을 button으로 설정하고 명시 type은 유지한다', () => {
  render(<Button>저장</Button>);
  expect(screen.getByRole('button', { name: '저장' })).toHaveAttribute('type', 'button');
});

it('loading 상태에서는 aria-busy와 data-loading을 붙이고 기존 라벨 이름을 유지한다', () => {
  render(<Button loading>저장하기</Button>);
  const button = screen.getByRole('button', { name: '저장하기' });
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button).toHaveAttribute('data-loading');
  expect(button).not.toBeDisabled();
});

it('disabled와 loading은 분리한다', () => {
  render(<Button loading disabled>저장하기</Button>);
  expect(screen.getByRole('button', { name: '저장하기' })).toBeDisabled();
});

it('iconOnly layout은 접근성 이름이 없으면 개발 경고를 남긴다', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  render(<Button layout="iconOnly"><Button.Icon><span aria-hidden>+</span></Button.Icon></Button>);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('iconOnly'));
  warn.mockRestore();
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm run test -- src/shared/ui/Button/Button.test.tsx
```

Expected: FAIL because `loading`, `layout`, compound icon slots, and default `type="button"` are not implemented.

- [ ] **Step 3: Implement minimal Button contract**

Add `variant`, `size`, `layout`, `loading`, `asChild`, compound `PrefixIcon`, `SuffixIcon`, and `Icon`. Render content and loading layers so loading keeps the accessible label and button dimensions.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
npm run test -- src/shared/ui/Button/Button.test.tsx
```

Expected: PASS.

### Task 2: Button Visual Contract

**Files:**
- Modify: `src/shared/ui/Button/Button.css.ts`
- Modify: `src/shared/ui/Button/Button.stories.tsx`

- [ ] **Step 1: Implement recipe variants and slots**

Use `brandSolid`, `neutralSolid`, `neutralWeak`, `criticalSolid`, `brandOutline`, `neutralOutline`, and `ghost`; sizes `xsmall`, `small`, `medium`, `large`; layouts `withText`, `iconOnly`.

- [ ] **Step 2: Add browser-state CSS**

Add `whiteSpace: 'nowrap'`, hover media query behavior, active fallback, disabled/loading selectors, loading overlay, spinner, and reduced-motion rule.

- [ ] **Step 3: Update Storybook matrix**

Update stories for variants, sizes, prefix/suffix icons, icon-only accessibility, loading, disabled, and `asChild`.

- [ ] **Step 4: Run focused verification**

Run:

```bash
npm run test -- src/shared/ui/Button/Button.test.tsx
npm run type-check
```

Expected: both commands pass.
