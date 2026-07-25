# 모션·재질 파운데이션 + Button 파일럿 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 설계 근거: `specs/2026-07-25-design-system-terracotta-retheme-design.md` (§2 모션, §3 재질, §4.2 Button) + 승인된 리빙 스타일가이드 v2. 이 플랜은 스펙의 **플랜 2**다(컬러 토큰=플랜1 완료). 나머지 프리미티브+Timeline 제거=플랜3, 엄격 토큰 ESLint=별도.

**Goal:** 스프링/촉감 모션과 aged-bronze 재질을 디자인 토큰/헬퍼로 승격하고, 그 언어로 Button을 v2 variant 세트(primary·secondary·outline·ghost·critical)로 재설계한다.

**Architecture:** ① 모션은 기존 `tokens/motion`에 스프링 이징 + 촉감 시맨틱을 **추가**(컨트랙트 확장). ② 재질은 정적 box-shadow 문자열이라 `tokens/effect`에 상수로 둔다(테마 무관). ③ Button은 recipe variant를 7종→5종으로 재편하고 base에 촉감 전환·solid에 finish/shadow를 입힌다. 앱 런타임 variant 소비처는 ThemeToggle(ghost, 불변)뿐 — 나머지 마이그레이션은 스토리 3종.

**Tech Stack:** vanilla-extract(`createThemeContract`·`@vanilla-extract/recipes`·`createVar`), TypeScript, Vitest + RTL, Storybook.

## Global Constraints

- 파일 헤더·모든 export는 단일 라인 JSDoc(`/** ... */`). 멀티라인 블록·`@param`·코드 받아쓰기 금지.
- 테스트 describe/it 설명문은 한국어, 고유 식별자만 영문.
- 화살표 함수는 처음부터 블록 바디(`=> { return ... }`) — repo `arrow-body-style:always`.
- 색은 플랜1의 semantic 토큰(`vars.color.*`)만. raw hex 금지.
- 스프링은 CSS `cubic-bezier` 백아웃(단일 오버슈트) — 다중 바운스 금지(절제).
- reduced-motion(`@media (prefers-reduced-motion: reduce)`)에서 오버슈트·들림·눌림 중화. 색·마감 유지.
- per-task 검증에 `npm run lint` 포함. 마무리 전체: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`.
- 컴포넌트별 배럴 없음 — 슬라이스 공개 API가 파일 직접 re-export.
- **variant 매핑(확정):** primary←brandSolid(테라코타) · secondary=녹청 solid(신규) · outline←neutralOutline(중립 테두리) · ghost←ghost · critical←criticalSolid. **폐기:** neutralSolid·neutralWeak·brandOutline(소비처 0 또는 스토리만).

---

## Task 1: 모션 파운데이션 (스프링 이징 + 촉감 시맨틱)

**Files:**
- Modify: `src/shared/styles/tokens/motion/easing.ts`
- Modify: `src/shared/styles/tokens/motion/semantic.ts`
- Modify: `src/shared/styles/theme.css.ts` (contract `easing`·`motion` 블록 확장)
- Test: `src/shared/styles/tokens/tokens.test.ts`

**Interfaces:**
- Produces: `vars.easing.spring`·`vars.easing.springStrong`; `vars.motion.tactilePress`·`vars.motion.tactileLift`·`vars.motion.controlSlide` (각 `{duration,easing}`).

- [ ] **Step 1: 실패 테스트 추가**

`tokens.test.ts`의 기존 `it('radius와 motion semantic alias를 제공한다', ...)` 블록 안 마지막 `expect` 뒤에 아래 3줄을 추가한다(블록 자체는 유지):

```ts
    expect(easing.spring).toBe('cubic-bezier(0.34, 1.4, 0.64, 1)');
    expect(motion.tactileLift.easing).toBe(easing.spring);
    expect(motion.controlSlide.easing).toBe(easing.springStrong);
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- tokens`
Expected: FAIL (`easing.spring`·`motion.tactileLift` 미존재).

- [ ] **Step 3: 이징 추가**

`src/shared/styles/tokens/motion/easing.ts`의 `easing` 객체에 마지막 항목으로 추가:

```ts
  spring: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
  springStrong: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
```

- [ ] **Step 4: 촉감 시맨틱 추가**

`src/shared/styles/tokens/motion/semantic.ts`의 `motion` 객체에 마지막 항목으로 추가(기존 `duration`/`easing` import 사용):

```ts
  tactilePress: {
    duration: duration.d1,
    easing: easing.enter,
  },
  tactileLift: {
    duration: duration.d6,
    easing: easing.spring,
  },
  controlSlide: {
    duration: duration.d6,
    easing: easing.springStrong,
  },
```

- [ ] **Step 5: 컨트랙트 확장**

`src/shared/styles/theme.css.ts`의 `vars` 컨트랙트에서:
- `easing` 블록에 `spring: null,`·`springStrong: null,` 추가(기존 5개 뒤).
- `motion` 블록에 아래 3개 추가(기존 5개 뒤):

```ts
    tactilePress: {
      duration: null,
      easing: null,
    },
    tactileLift: {
      duration: null,
      easing: null,
    },
    controlSlide: {
      duration: null,
      easing: null,
    },
```

(themes/night.ts·light.ts는 `easing`·`motion` 객체를 통째로 참조하므로 수정 불필요 — 확인만.)

- [ ] **Step 6: 통과·타입·린트**

Run: `npm test -- tokens && npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 7: 커밋**

```bash
git add src/shared/styles/tokens/motion/easing.ts src/shared/styles/tokens/motion/semantic.ts src/shared/styles/theme.css.ts src/shared/styles/tokens/tokens.test.ts
git commit -m "feat(motion): add spring easings and tactile motion semantics"
```

---

## Task 2: 재질 파운데이션 (finish/shadow 상수)

**Files:**
- Create: `src/shared/styles/tokens/effect/effect.ts`
- Create: `src/shared/styles/tokens/effect/index.ts`
- Modify: `src/shared/styles/tokens/index.ts` (re-export)
- Test: `src/shared/styles/tokens/tokens.test.ts`

**Interfaces:**
- Produces: `finish.inset`(놋쇠 각인 box-shadow), `shadow.raise`·`shadow.press`(솔리드 raise/눌림 box-shadow). 테마 무관 정적 문자열.

- [ ] **Step 1: 실패 테스트 추가**

`tokens.test.ts` 상단 import에 `finish, shadow`를 추가하고(`from '.'`), 새 `it` 블록을 `describe('design tokens', ...)` 안에 추가:

```ts
  it('aged-bronze 재질 효과 상수를 제공한다', () => {
    expect(finish.inset).toContain('inset');
    expect(shadow.raise).toContain('rgba');
    expect(shadow.press).toContain('inset');
  });
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- tokens`
Expected: FAIL (`finish`/`shadow` export 없음).

- [ ] **Step 3: effect 상수 작성**

`src/shared/styles/tokens/effect/effect.ts`:

```ts
/** aged-bronze 각인 마감 — 상단 광택 + 하단 각인 음영(정적, 테마 무관) */
export const finish = {
  inset:
    'inset 0 1px 0 rgba(255, 236, 214, 0.16), inset 0 -2px 3px rgba(60, 20, 10, 0.34)',
} as const;

/** solid 표면 그림자 — 떠 있는 raise, 눌린 press */
export const shadow = {
  raise: '0 2px 6px rgba(0, 0, 0, 0.32)',
  press: 'inset 0 2px 6px rgba(0, 0, 0, 0.42)',
} as const;
```

`src/shared/styles/tokens/effect/index.ts`:

```ts
/** effect 토큰 재노출 — aged-bronze 재질 상수 */
export { finish, shadow } from './effect';
```

- [ ] **Step 4: tokens 배럴 re-export**

`src/shared/styles/tokens/index.ts`에 아래 한 줄 추가:

```ts
export { finish, shadow } from './effect';
```

- [ ] **Step 5: 통과·타입·린트**

Run: `npm test -- tokens && npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 6: 커밋**

```bash
git add src/shared/styles/tokens/effect src/shared/styles/tokens/index.ts src/shared/styles/tokens/tokens.test.ts
git commit -m "feat(effect): add aged-bronze finish and raise/press shadow tokens"
```

---

## Task 3: Button 재설계 (variant 5종 + 스프링/촉감 + 재질)

**Files:**
- Modify: `src/shared/ui/Button/Button.css.ts`
- Modify: `src/shared/ui/Button/Button.tsx` (block prop)
- Modify: `src/shared/ui/Button/Button.stories.tsx`
- Test: `src/shared/ui/Button/Button.test.tsx`

**Interfaces:**
- Consumes: `vars.motion.tactileLift`·`tactilePress`·`controlSlide`, `vars.easing.spring`, `finish`·`shadow`(Task 1·2), `vars.color.*`(플랜1).
- Produces: recipe `button` variant = `primary|secondary|outline|ghost|critical`, size = `xsmall|small|medium|large`, layout = `withText|iconOnly`; `ButtonProps`에 `block?: boolean`.

- [ ] **Step 1: 실패 테스트 갱신**

`Button.test.tsx`에 새 variant/ block 계약 테스트를 추가한다(기존 role/loading/asChild 테스트는 유지). 정확한 assertion:

```tsx
  it('secondary variant와 block prop을 렌더한다', () => {
    render(
      <Button
        variant='secondary'
        block>
        저장
      </Button>
    );
    const btn = screen.getByRole('button', { name: '저장' });
    expect(btn.className).not.toBe('');
  });
```

(기존 테스트가 `variant='brandSolid'` 등 폐기된 이름을 쓰면 새 이름으로 교체 — primary/secondary/outline/ghost/critical.)

- [ ] **Step 2: 실패 확인**

Run: `npm test -- Button`
Expected: FAIL (타입 에러: `secondary`·`block` 미존재).

- [ ] **Step 3: Button.css.ts recipe 재작성**

`base` 스타일의 `transition`을 촉감 토큰으로 바꾸고 press/lift·finish를 넣는다. `base`의 `transition` 값을 아래로 교체(색 전환은 유지, transform 추가):

```ts
    transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, border-color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, transform ${vars.motion.tactileLift.duration} ${vars.motion.tactileLift.easing}, box-shadow ${vars.motion.tactilePress.duration} ${vars.motion.tactilePress.easing}`,
```

`base`의 `selectors`에 press/lift + reduced-motion 무력화를 추가한다(기존 `:disabled`/`:focus-visible`/`data-loading` 셀렉터 유지, 아래를 병합):

```ts
      '&:active:not(:disabled):not([data-disabled])': {
        transform: 'scale(0.97)',
      },
```

그리고 `base` 스타일 배열의 style 객체에 reduced-motion 미디어를 추가:

```ts
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
        transform: 'none',
      },
    },
```

`variants.variant`를 아래 5종으로 **교체**(기존 7종 삭제). solid 3종(primary·secondary·critical)은 finish/shadow + hover 들림, outline·ghost는 배경 전환만:

```ts
    variant: {
      primary: {
        background: vars.color.bg.brand,
        color: vars.color.fg.onBrand,
        boxShadow: `${finish.inset}, ${shadow.raise}`,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': {
              background: vars.color.bg.brandPressed,
              transform: 'translateY(-2px)',
            },
          },
        },
        selectors: {
          '&:active:not(:disabled):not([data-disabled])': { boxShadow: shadow.press },
        },
      },
      secondary: {
        background: vars.color.bg.positiveWeak,
        color: vars.color.fg.positive,
        border: `1px solid ${vars.color.stroke.positive}`,
        boxShadow: finish.inset,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { transform: 'translateY(-2px)' },
          },
        },
        selectors: {
          '&:active:not(:disabled):not([data-disabled])': { boxShadow: shadow.press },
        },
      },
      outline: {
        background: 'transparent',
        borderColor: vars.color.stroke.neutral,
        color: vars.color.fg.neutral,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': {
              background: vars.color.bg.surfaceMuted,
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      ghost: {
        background: 'transparent',
        color: vars.color.fg.neutral,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { background: vars.color.bg.surfaceMuted },
          },
        },
      },
      critical: {
        background: vars.color.bg.critical,
        color: vars.color.fg.onBrand,
        boxShadow: `${finish.inset}, ${shadow.raise}`,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { transform: 'translateY(-2px)' },
          },
        },
        selectors: {
          '&:active:not(:disabled):not([data-disabled])': { boxShadow: shadow.press },
        },
      },
    },
```

`variants.size`의 height/fontSize는 v2대로 조정(xsmall·small 더 작게, large 크게):

```ts
    size: {
      xsmall: { height: vars.dimension.x6, fontSize: vars.typography.fontSize[12] },
      small: { height: vars.dimension.x8, fontSize: vars.typography.fontSize[12] },
      medium: { height: vars.dimension.x12, fontSize: vars.typography.fontSize[14] },
      large: { height: vars.dimension.x16, fontSize: vars.typography.fontSize[16] },
    },
```

`compoundVariants`에서 **변형별 disabled/loading을 primary/secondary/outline/ghost/critical로 재작성**한다. 각 solid(primary·secondary·critical) disabled는 `background: vars.color.bg.disabled, color: vars.color.fg.disabled, boxShadow: 'none'`; outline disabled는 `borderColor: vars.color.stroke.muted, color: vars.color.fg.disabled`; ghost disabled는 `color: vars.color.fg.disabled`. loading 상태는 각 base 배경 유지(primary=brandPressed, critical=bg.critical, secondary=positiveWeak). size×layout compound(패딩·아이콘 크기)는 기존 값 유지하되 xsmall/small height 변경에 맞춰 paddingBlock만 한 단계 축소.

`defaultVariants`를 `{ variant: 'primary', size: 'medium', layout: 'withText' }`로 변경.

파일 하단에 block용 스타일 추가:

```ts
/** block — 풀폭 버튼(로그인 등) */
export const block = style({ width: '100%' });
```

- [ ] **Step 4: Button.tsx에 block prop 배선**

`ButtonProps`에 `block?: boolean;` 추가. `Button.css`에서 `block`을 import. `classNames` 조합에 block을 조건부로 넣는다:

```ts
    const classNames = [button({ variant, size, layout }), block ? blockClass : null, className]
      .filter(Boolean)
      .join(' ');
```

(import는 `import { button, block as blockClass, ... } from './Button.css';` — 이름 충돌 피해 alias. 구조분해에서 `block`을 props로 뽑아낸다.)

- [ ] **Step 5: 스토리 갱신**

`Button.stories.tsx`의 variant 예시를 primary/secondary/outline/ghost/critical로 교체하고 block·size 예시 추가.

- [ ] **Step 6: 통과·검증**

Run: `npm test -- Button && npx tsc --noEmit && npm run lint && npm run fsd`
Expected: PASS.

- [ ] **Step 7: 커밋**

```bash
git add src/shared/ui/Button
git commit -m "feat(button): redesign variants (primary/secondary/outline/ghost/critical) with spring+aged-bronze"
```

---

## Task 4: 소비처 마이그레이션 + 전체 검증

**Files:**
- Modify: `src/shared/ui/Dialog/Dialog.stories.tsx`
- Modify: `src/shared/ui/AlertDialog/AlertDialog.stories.tsx`
- Modify: `src/shared/ui/DropdownMenu/DropdownMenu.stories.tsx`

**Interfaces:**
- Consumes: 새 Button variant(Task 3).

- [ ] **Step 1: 스토리 variant 개명**

세 스토리 파일에서 폐기된 variant를 매핑대로 교체:
- `brandSolid` → `primary`
- `neutralSolid` → `secondary`
- `neutralOutline` → `outline`
- `criticalSolid` → `critical`
- `ghost` → `ghost` (변경 없음)

(런타임 앱: ThemeToggle=`ghost` 불변, HeroSection·lab=default variant → 손대지 않음. 확인만.)

- [ ] **Step 2: 폐기 variant 잔재 스캔**

Run: `grep -rnE "brandSolid|neutralSolid|neutralWeak|brandOutline|neutralOutline|criticalSolid" src`
Expected: 결과 없음(전부 새 이름으로 교체됨). 남으면 교체.

- [ ] **Step 3: 전체 검증**

Run: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`
Expected: 전부 PASS.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "refactor(stories): migrate Button variants to new names"
```

---

## Self-Review 결과 (스펙 §2/§3/§4.2 대비)

- **§2 모션:** spring·springStrong 이징 + tactilePress/tactileLift/controlSlide 시맨틱 + reduced-motion 중화 → Task 1·3.
- **§3 재질:** finish.inset·shadow.raise·press 상수 + solid 적용 → Task 2·3.
- **§4.2 Button:** variant 5종(primary/secondary/outline/ghost/critical)·size 조정·block·hover 들림(spring)·active 눌림(press)·disabled/loading 유지 → Task 3.
- **경계 원칙:** 색은 플랜1 semantic만, raw hex 0. 스프링 단일 오버슈트.
- **마이그레이션:** 폐기 variant 소비처(스토리 3종)만, 런타임 안 깨짐 → Task 4.
- 범위 밖(플랜3 나머지 프리미티브·Timeline·ESLint) 미포함 — 의도적.
- 타입 일관성: 새 `motion`/`easing`/`finish`/`shadow`(Task1·2) ↔ Button.css 소비(Task3) 이름 일치.
