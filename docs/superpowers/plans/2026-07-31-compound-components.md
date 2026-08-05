# 합성 컴포넌트 패턴 도입 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `SectionHeading` 을 우회하게 만든 슬롯 props 구조를 걷어내고, 판정 기준을 통과한 대상만 compound 로 분해한다. 통과하지 못한 반복 구조는 단일 컴포넌트로 추출해 이름만 준다.

**Architecture:** compound 자격은 **배치가 사용처마다 다를 때**만 준다. 그중 파트 간 공유 상태가 없으면 dot-notation 네임스페이스 분해(서버 컴포넌트 유지), 있으면 context compound. **context 는 이미 `'use client'` 인 컴포넌트에만 쓴다** — 서버 트리를 클라이언트로 끌어내리면서까지 얻을 이득이 없다.

**Tech Stack:** React 19.2.3 (`use()`, ref as prop), Next 16.2.9 App Router, Tailwind v4, Vitest 4 + RTL, Storybook 10.

설계: [2026-07-31-compound-components-design.md](../specs/2026-07-31-compound-components-design.md)

## Global Constraints

- **시각 결과와 접근성 계약이 바뀌면 실패다.** heading 레벨, 랜드마크, `aria-labelledby` 연결, 화면에 보이는 결과가 변경 전과 같아야 한다. 순수 API 재구성이다.
- **클래스가 붙는 엘리먼트 위치는 시각 등가일 때만 옮길 수 있고, 옮기면 해당 Task 에 명시한다.** 부품이 기본 클래스를 소유하므로 완전한 바이트 동일은 불가능한 자리가 있다. 이 플랜에서 그런 자리는 Task 3 Step 2 한 곳뿐이다.
- **`'use client'` 가 새로 붙는 파일은 없다.** `HomePage` 와 5개 섹션은 서버 컴포넌트로 남는다.
- `src/shared/ui/` 에 per-component `index.ts` 를 만들지 않는다. `src/shared/ui/index.ts` 하나가 직접 re-export 한다.
- 주석은 파일 헤더와 모든 export 에 단일 라인 JSDoc(`/** ... */`), 본문 안 비자명 로직은 한 줄 `//` 로 WHY 를 적는다. 멀티라인 블록·`@param`·코드 받아쓰기 금지.
- 테스트 `describe`/`it` 설명문은 한국어, 고유 식별자만 영문.
- ESLint: named 컴포넌트는 **함수 선언문**(`react/function-component-definition`), 컴포넌트 **내부** 함수는 화살표(`no-restricted-syntax`), 화살표는 항상 블록 바디(`arrow-body-style: always`).
- Prettier: `singleQuote`, `jsxSingleQuote`, `singleAttributePerLine`, `bracketSameLine: true`, `printWidth: 80`.
- 단계 종료 검증에서 `npm run build` 를 빼지 않는다 — RSC 경계 위반은 build 만 잡는다.

---

## File Structure

**Task 1–3 — SectionHeading (등급 A)**

```
src/shared/ui/SectionHeading/SectionHeading.tsx        재작성 — Root·Label·Title·Description
src/shared/ui/SectionHeading/SectionHeading.test.tsx   재작성 — 부품별 계약
src/shared/ui/SectionHeading/SectionHeading.stories.tsx 재작성 — args 대신 render
src/pages/home/ui/WorkSection/WorkSection.tsx          부품 조립으로 전환
src/pages/home/ui/GallerySection/GallerySection.tsx    부품 조립으로 전환
src/pages/home/ui/ContactSection/ContactSection.tsx    우회 해소
src/pages/home/ui/IntroductionSection/IntroductionSection.tsx 우회 해소
```

**Task 4 — SiteNavigation (등급 B)**

```
src/widgets/site-navigation/model/navigationContext.ts  신규 — context·타입·useNavigation
src/widgets/site-navigation/ui/Navigation.tsx           신규 — 부품 묶음
src/widgets/site-navigation/ui/SiteNavigation.tsx       조립체로 축소
```

**Task 5–6 — 섹션 반복 구조 (compound 아님 — 단일 컴포넌트 추출)**

```
src/pages/home/ui/WorkSection/ProjectRow.tsx        신규
src/pages/home/ui/WorkSection/ProjectRow.test.tsx   신규
src/pages/home/ui/GallerySection/Rail.tsx           신규
src/pages/home/ui/GallerySection/Rail.test.tsx      신규
```

---

## Task 1: SectionHeading 부품 분해

**Files:**

- Modify: `src/shared/ui/SectionHeading/SectionHeading.tsx` (전체 재작성)
- Test: `src/shared/ui/SectionHeading/SectionHeading.test.tsx` (전체 재작성)
- Modify: `src/shared/ui/SectionHeading/SectionHeading.stories.tsx` (전체 재작성)

**Interfaces:**

- Consumes: `cn` from `@/shared/lib`
- Produces: `SectionHeading` — `{ Root, Label, Title, Description }` 객체. `Root`·`Label`·`Description` 은 각각 `ComponentPropsWithRef<'div'|'p'|'p'>`, `Title` 은 `ComponentPropsWithRef<'h2'> & { level?: 2 | 3 }`. `src/shared/ui/index.ts` 의 기존 `export { SectionHeading } from './SectionHeading/SectionHeading';` 줄은 **그대로 둔다** — 내보내는 이름이 함수에서 객체로 바뀔 뿐이다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`src/shared/ui/SectionHeading/SectionHeading.test.tsx` 전체를 아래로 바꾼다.

```tsx
/** SectionHeading 테스트 — 부품별 계약과 heading 계층을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('Title 의 기본 heading 레벨은 2 다', () => {
    render(<SectionHeading.Title>선택한 작업</SectionHeading.Title>);

    expect(
      screen.getByRole('heading', { level: 2, name: '선택한 작업' })
    ).toBeInTheDocument();
  });

  it('level 로 heading 계층을 낮출 수 있다', () => {
    render(<SectionHeading.Title level={3}>선택한 작업</SectionHeading.Title>);

    expect(
      screen.getByRole('heading', { level: 3, name: '선택한 작업' })
    ).toBeInTheDocument();
  });

  it('id 는 래퍼가 아니라 heading 에 붙는다', () => {
    // 래퍼에 붙으면 aria-labelledby 가 라벨·부연까지 이름으로 끌어와 랜드마크 이름이 장황해진다
    render(
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title id='work-title'>선택한 작업</SectionHeading.Title>
        <SectionHeading.Description>
          최근에 만든 것들.
        </SectionHeading.Description>
      </SectionHeading.Root>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: '선택한 작업' })
    ).toHaveAttribute('id', 'work-title');
  });

  it('고르지 않은 부품은 엘리먼트를 남기지 않는다', () => {
    const { container } = render(
      <SectionHeading.Root>
        <SectionHeading.Title>선택한 작업</SectionHeading.Title>
      </SectionHeading.Root>
    );

    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  it('Title 을 다른 엘리먼트로 감싸도 heading 계약이 유지된다', () => {
    // 슬롯 props 로는 불가능했던 조립이다 — Contact 가 SectionHeading 을 우회하던 이유
    render(
      <div data-testid='mask'>
        <SectionHeading.Title id='contact-title'>
          같이 만들 것이 있나요
        </SectionHeading.Title>
      </div>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: '같이 만들 것이 있나요' })
    ).toHaveAttribute('id', 'contact-title');
  });

  it('소비자 className 이 기본 클래스와 병합된다', () => {
    // Introduction 은 라벨을 12칼럼 그리드의 한 칸으로 밀어야 한다
    render(
      <SectionHeading.Label className='md:col-span-4'>
        Work
      </SectionHeading.Label>
    );

    expect(screen.getByText('Work')).toHaveClass(
      'text-label',
      'text-subtle',
      'uppercase',
      'md:col-span-4'
    );
  });
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `npx vitest run src/shared/ui/SectionHeading/SectionHeading.test.tsx`
Expected: FAIL — `SectionHeading.Title is not a function` 계열. 기존 `SectionHeading` 은 함수라 `.Title` 이 `undefined` 다.

- [ ] **Step 3: 구현한다**

`src/shared/ui/SectionHeading/SectionHeading.tsx` 전체를 아래로 바꾼다.

```tsx
/** 섹션 머리말 — Root·Label·Title·Description 부품으로 나눠 배치를 소비자가 소유한다 */
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib';

/** level 은 2·3 만 연다 — h1 은 페이지에 하나뿐이라 섹션이 가져가면 안 된다 */
type SectionHeadingTitleProps = ComponentPropsWithRef<'h2'> & {
  level?: 2 | 3;
};

const HEADING_TAG = { 2: 'h2', 3: 'h3' } as const;

/** 머리말 기본 배치 — 소비자가 className 으로 그리드로 덮을 수 있다 */
function SectionHeadingRoot({
  className,
  ...rest
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-4', className)}
      {...rest}
    />
  );
}

/** 섹션 라벨 — 머리말 역할의 text-label 계열을 단독으로 소유한다 */
function SectionHeadingLabel({
  className,
  ...rest
}: ComponentPropsWithRef<'p'>) {
  return (
    <p
      className={cn('text-label text-subtle uppercase', className)}
      {...rest}
    />
  );
}

/** 섹션 제목 — id 는 여기 붙는다. 래퍼에 붙이면 이름이 라벨·부연까지 번진다 */
function SectionHeadingTitle({
  level = 2,
  className,
  ...rest
}: SectionHeadingTitleProps) {
  const Heading = HEADING_TAG[level];

  // break-keep — 한글은 어절 중간에서 끊기면 읽기가 급격히 나빠진다
  return (
    <Heading
      className={cn('text-section break-keep', className)}
      {...rest}
    />
  );
}

/** 제목 아래 부연 */
function SectionHeadingDescription({
  className,
  ...rest
}: ComponentPropsWithRef<'p'>) {
  return (
    <p
      className={cn('text-body-lg break-keep text-muted', className)}
      {...rest}
    />
  );
}

/** 섹션 머리말 부품 묶음 — 소비자가 필요한 것만 골라 조립한다 */
export const SectionHeading = {
  Root: SectionHeadingRoot,
  Label: SectionHeadingLabel,
  Title: SectionHeadingTitle,
  Description: SectionHeadingDescription,
};
```

- [ ] **Step 4: 테스트 통과를 확인한다**

Run: `npx vitest run src/shared/ui/SectionHeading/SectionHeading.test.tsx`
Expected: PASS (6 tests)

- [ ] **Step 5: 스토리를 재작성한다**

compound 조립은 args 로 표현되지 않으므로 `render` 로 직접 그린다. `src/shared/ui/SectionHeading/SectionHeading.stories.tsx` 전체를 아래로 바꾼다.

```tsx
/** SectionHeading 스토리 — 한글 줄바꿈과 부품 조립 자유도를 본다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from '../Container/Container';
import { SectionHeading } from './SectionHeading';

// compound 는 args 로 조립이 표현되지 않는다 — component 를 Root 로 두고 본문은 render 가 그린다
const meta = {
  title: 'UI/SectionHeading',
  component: SectionHeading.Root,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => {
      return (
        <div className='min-h-svh bg-background py-10 text-foreground'>
          <Container>
            <Story />
          </Container>
        </div>
      );
    },
  ],
} satisfies Meta<typeof SectionHeading.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title>선택한 작업</SectionHeading.Title>
        <SectionHeading.Description>
          최근에 만든 것들 가운데 설명할 거리가 있는 것만 골랐다.
        </SectionHeading.Description>
      </SectionHeading.Root>
    );
  },
};

/** 제목만 — 고르지 않은 부품이 여백을 남기지 않아야 한다 */
export const TitleOnly: Story = {
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Title>선택한 작업</SectionHeading.Title>
      </SectionHeading.Root>
    );
  },
};

export const LevelThree: Story = {
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title level={3}>선택한 작업</SectionHeading.Title>
      </SectionHeading.Root>
    );
  },
};

/** 긴 한글 제목 — 어절 중간에서 끊기지 않는지가 관찰 대상 */
export const LongTitle: Story = {
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title>
          브라우저가 이미 할 수 있는 일을 라이브러리 없이 다시 세우기
        </SectionHeading.Title>
        <SectionHeading.Description>
          스크롤 구동 애니메이션과 IntersectionObserver 만으로 어디까지 되는지
          확인하면서, 런타임 패키지를 늘리지 않는 선을 지켰다.
        </SectionHeading.Description>
      </SectionHeading.Root>
    );
  },
};

/** 비대칭 배치 — Introduction 이 실제로 쓰는 조립이다. 슬롯 props 로는 불가능했다 */
export const AsymmetricGrid: Story = {
  render: () => {
    return (
      <SectionHeading.Root className='grid gap-grid-gap md:grid-cols-12'>
        <SectionHeading.Label className='md:col-span-4'>
          About
        </SectionHeading.Label>
        <SectionHeading.Title className='md:col-span-8'>
          쓰는 사람이 걸리지 않는 화면을 만든다
        </SectionHeading.Title>
      </SectionHeading.Root>
    );
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
  render: () => {
    return (
      <SectionHeading.Root>
        <SectionHeading.Label>Work</SectionHeading.Label>
        <SectionHeading.Title>
          브라우저가 이미 할 수 있는 일을 라이브러리 없이 다시 세우기
        </SectionHeading.Title>
      </SectionHeading.Root>
    );
  },
};

/** 두 surface 에서 라벨·부연의 대비를 같이 본다 — subtle·muted 는 반전 때 가장 얕아진다 */
export const Surfaces: Story = {
  globals: { theme: 'dark' },
  render: () => {
    return (
      <div className='flex flex-col gap-10'>
        <div className='bg-surface p-8'>
          <SectionHeading.Root>
            <SectionHeading.Label>Work</SectionHeading.Label>
            <SectionHeading.Title>선택한 작업</SectionHeading.Title>
            <SectionHeading.Description>
              최근에 만든 것들 가운데 설명할 거리가 있는 것만 골랐다.
            </SectionHeading.Description>
          </SectionHeading.Root>
        </div>
        <div
          className='bg-surface p-8'
          data-surface='light'>
          <SectionHeading.Root>
            <SectionHeading.Label>Work</SectionHeading.Label>
            <SectionHeading.Title>선택한 작업</SectionHeading.Title>
            <SectionHeading.Description>
              최근에 만든 것들 가운데 설명할 거리가 있는 것만 골랐다.
            </SectionHeading.Description>
          </SectionHeading.Root>
        </div>
      </div>
    );
  },
};
```

- [ ] **Step 6: 타입 검사와 린트를 돌린다**

Run: `npm run type-check && npm run lint`
Expected: 소비자 4곳(`WorkSection`·`GallerySection` 은 슬롯 props 사용 중)에서 **타입 에러가 난다.** 이것이 정상이며 Task 2·3 에서 해소한다. 이 시점에 커밋하지 않는다.

---

## Task 2: SectionHeading 을 쓰던 소비자 2곳 전환

**Files:**

- Modify: `src/pages/home/ui/WorkSection/WorkSection.tsx:17-23`
- Modify: `src/pages/home/ui/GallerySection/GallerySection.tsx:13-18`

**Interfaces:**

- Consumes: Task 1 의 `SectionHeading.{Root,Label,Title,Description}`
- Produces: 없음 (소비자 전환)

- [ ] **Step 1: WorkSection 의 머리말을 부품 조립으로 바꾼다**

`src/pages/home/ui/WorkSection/WorkSection.tsx` 에서 `<SectionHeading ... />` 한 덩어리를 아래로 교체한다. import 줄은 바꾸지 않는다.

```tsx
        <SectionHeading.Root className='mb-section-sm'>
          <SectionHeading.Label>{WORK.label}</SectionHeading.Label>
          <SectionHeading.Title id={TITLE_ID}>
            {WORK.title}
          </SectionHeading.Title>
          <SectionHeading.Description>
            {WORK.description}
          </SectionHeading.Description>
        </SectionHeading.Root>
```

- [ ] **Step 2: GallerySection 의 머리말을 부품 조립으로 바꾼다**

`src/pages/home/ui/GallerySection/GallerySection.tsx` 에서 `<SectionHeading ... />` 를 아래로 교체한다. `description` 은 원래 없으므로 부품도 만들지 않는다.

```tsx
          <SectionHeading.Root className='mb-section-sm'>
            <SectionHeading.Label>{GALLERY.label}</SectionHeading.Label>
            <SectionHeading.Title id={TITLE_ID}>
              {GALLERY.title}
            </SectionHeading.Title>
          </SectionHeading.Root>
```

- [ ] **Step 3: 섹션 테스트가 그대로 통과하는지 확인한다**

Run: `npx vitest run src/pages/home/ui/WorkSection src/pages/home/ui/GallerySection`
Expected: PASS. 기존 테스트는 접근성 계약(heading, `aria-labelledby`) 기준이라 **한 줄도 고치지 않고 통과해야 한다.** 실패하면 마크업이 바뀐 것이므로 Global Constraints 위반이다.

- [ ] **Step 4: 커밋하지 않는다**

Contact·Introduction 이 아직 옛 라벨 클래스를 들고 있어 이 시점은 자족적이지 않다. Task 3 과 함께 커밋한다.

---

## Task 3: SectionHeading 을 우회하던 소비자 2곳 해소

**Files:**

- Modify: `src/pages/home/ui/ContactSection/ContactSection.tsx:18-26`
- Modify: `src/pages/home/ui/IntroductionSection/IntroductionSection.tsx:19-32`

**Interfaces:**

- Consumes: Task 1 의 `SectionHeading.{Root,Label,Title}`
- Produces: 없음 (소비자 전환)

- [ ] **Step 1: ContactSection 의 손조립을 부품으로 바꾼다**

import 에 `SectionHeading` 을 더한다. 네 개가 되면 printWidth 80 을 넘어 Prettier 가 줄을 편다.

```tsx
import {
  Container,
  MaskReveal,
  SectionHeading,
  ShowcaseButton,
} from '@/shared/ui';
```

`<p className='text-label ...'>` 과 `<MaskReveal><h2>` 두 덩어리를 아래로 교체한다.

```tsx
        <SectionHeading.Label>{CONTACT.label}</SectionHeading.Label>

        {/* 제목만 마스크로 감싼다 — 부품이라 래퍼를 끼워도 id 가 heading 에 그대로 남는다 */}
        <MaskReveal className='mt-6 text-section break-keep text-foreground'>
          <SectionHeading.Title id={TITLE_ID}>
            {CONTACT.headline}
          </SectionHeading.Title>
        </MaskReveal>
```

`MaskReveal` 이 이미 `text-section` 을 들고 있고 `SectionHeading.Title` 도 같은 클래스를 낸다. 중복은 `cn` 이 아니라 **다른 엘리먼트**에 붙으므로 서로를 지우지 않는다 — 마스크 오버행이 `em` 기준이라 래퍼가 글자 크기를 알아야 하고, heading 자신도 알아야 한다. 이것이 현행 동작이며 바꾸지 않는다.

- [ ] **Step 2: IntroductionSection 의 손조립을 부품으로 바꾼다**

import 에 `SectionHeading` 을 더한다.

```tsx
import {
  Container,
  MaskReveal,
  RevealText,
  SectionHeading,
  ShowcaseButton,
} from '@/shared/ui';
```

`<div className='grid ...'>` 부터 `</h2>` 까지를 아래로 교체한다. 나머지(본문 문단, 스킬 목록, CTA)는 그대로 둔다.

```tsx
        {/* 비대칭 — 라벨 4 / 본문 8. 모바일은 단일 열로 떨어진다 */}
        <SectionHeading.Root className='grid gap-grid-gap md:grid-cols-12'>
          <SectionHeading.Label className='md:col-span-4'>
            {INTRODUCTION.label}
          </SectionHeading.Label>

          <div className='flex flex-col gap-10 md:col-span-8'>
            {/* RevealText 는 span 을 낸다 — heading 안에 들어가도 콘텐츠 모델이 깨지지 않는다 */}
            <SectionHeading.Title
              id={TITLE_ID}
              className='text-statement'>
              <RevealText
                unit='word'
                className='text-foreground'>
                {INTRODUCTION.statement}
              </RevealText>
            </SectionHeading.Title>
```

`className='text-statement'` 가 `SectionHeading.Title` 의 기본 `text-section` 을 덮는다. `cn` 의 tailwind-merge 레지스트리가 두 이름을 같은 `text` 그룹으로 알고 있어야 이 병합이 성립한다 — Step 4 에서 실제로 확인한다.

닫는 태그도 `</h2>` → `</SectionHeading.Title>` 로 바꾸고, 감싸던 `<div className='grid ...'>` 의 닫는 `</div>` 는 `</SectionHeading.Root>` 가 된다.

**이 자리가 플랜에서 유일하게 클래스 위치가 옮겨지는 곳이다**(Global Constraints 2항). 글자 크기가 `RevealText` 의 span 에서 `h2` 로 올라간다.

```
변경 전  h2(클래스 없음) > span.block.break-keep.text-statement.text-foreground
변경 후  h2.text-statement.break-keep > span.block.break-keep.text-foreground
```

span 이 `display: block` 이라 `h2` 의 font-size 를 그대로 상속하므로 **시각 결과는 같다.** `break-keep` 은 span 이 이미 갖고 있어 `h2` 에 추가돼도 무동작이다. Step 3 의 기존 `IntroductionSection.test.tsx` 통과가 접근성 계약 쪽 증거고, 시각 등가는 Step 6 이후 `npm run dev` 에서 사람이 확인한다.

- [ ] **Step 3: 섹션 테스트가 그대로 통과하는지 확인한다**

Run: `npx vitest run src/pages/home/ui`
Expected: PASS. 기존 테스트를 고치지 않는다.

- [ ] **Step 4: `text-statement` 가 `text-section` 을 실제로 덮는지 확인한다**

`cn` 의 tailwind-merge 레지스트리에 두 이름이 같은 그룹으로 등록돼 있지 않으면 클래스가 **둘 다 남아** 나중 선언이 이기는 CSS 순서 의존이 된다. 2단계 기록의 `cn('text-hero', 'text-muted')` 사고와 같은 계열이다.

Run: `npx vitest run src/shared/lib/cn.test.ts`

그리고 `src/shared/lib/cn.ts` 를 열어 `text-statement` 와 `text-section` 이 같은 font-size 그룹에 등록돼 있는지 눈으로 확인한다. 없으면 등록을 추가하고, `cn.test.ts` 에 아래 케이스를 더한다.

```ts
  it('타이포 토큰끼리는 뒤에 온 것만 남는다', () => {
    expect(cn('text-section', 'text-statement')).toBe('text-statement');
  });
```

- [ ] **Step 5: 라벨 중복이 사라졌는지 확인한다**

Run:

```sh
grep -rn 'text-label text-subtle uppercase' src --include='*.tsx' | grep -v stories
```

Expected: `SectionHeading.tsx` 1건 + `HeroSection.tsx` 1건 + `WorkSection.tsx` 1건. 뒤 두 건은 머리말 라벨이 아니라 각각 Hero 메타와 `dl` 메타라 대상이 아니다(설계 8절 3항). `ContactSection` 과 `IntroductionSection` 은 **나오지 않아야 한다.**

- [ ] **Step 6: 전체 검증**

Run: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`
Expected: 전부 통과. 출력을 잘라 보지 말고 exit code 로 판정한다.

- [ ] **Step 7: 커밋**

```sh
git add src/shared/ui/SectionHeading src/pages/home/ui src/shared/lib
git commit -m "refactor: split SectionHeading into composable parts"
```

---

## Task 4: SiteNavigation context compound

**Files:**

- Create: `src/widgets/site-navigation/model/navigationContext.ts`
- Create: `src/widgets/site-navigation/ui/Navigation.tsx`
- Modify: `src/widgets/site-navigation/ui/SiteNavigation.tsx` (조립체로 축소)

**Interfaces:**

- Consumes: `NAV_ITEMS` from `../config/navItems`, `Container`·`SITE` from shared
- Produces: `Navigation` — `{ Provider, Root, Brand, Menu, Link, MenuTrigger, MenuDialog, MenuLink }`. `useNavigation()` 는 `NavigationContextValue` 를 반환하고 Provider 밖에서 호출하면 throw 한다. `SiteNavigation` 의 public API(인자 없는 컴포넌트)는 바뀌지 않으므로 `src/widgets/site-navigation/index.ts` 는 손대지 않는다.

- [ ] **Step 1: 기존 테스트가 계약이라는 것을 확인한다**

`src/widgets/site-navigation/ui/SiteNavigation.test.tsx` 는 이미 6개 계약을 검증한다 — banner 랜드마크, 모든 항목이 링크로 닿음, 메뉴가 닫힌 채 시작, 여는 버튼, 이동 시 포커스 이전, 링크 클릭 시 닫힘.

Run: `npx vitest run src/widgets/site-navigation`
Expected: PASS (6 tests). **이 파일은 한 줄도 고치지 않는다.** 리팩터링 안전망이다.

- [ ] **Step 2: context 를 만든다**

`src/widgets/site-navigation/model/navigationContext.ts` 를 만든다.

```ts
'use client';

/** 내비게이션 context — 부품이 상태 구현이 아니라 인터페이스에 의존하게 한다 */
import { createContext, use } from 'react';

/** 항목 한 건 — config 의 as const 배열이 이 형태로 좁혀진다 */
export interface NavItem {
  label: string;
  href: string;
}

/** state·actions·meta 3분할 — 어떤 Provider 든 이 계약만 채우면 부품이 그대로 돈다 */
export interface NavigationContextValue {
  state: { items: readonly NavItem[] };
  actions: {
    open: () => void;
    close: () => void;
    navigate: (href: string) => void;
  };
  // RefObject 가 아니라 콜백 ref 다 — context 의 ref 를 렌더 중에 쓰면 react-hooks/refs 가 막는다
  meta: { attachDialog: (element: HTMLDialogElement | null) => void };
}

export const NavigationContext = createContext<NavigationContextValue | null>(
  null
);

/** 부품이 context 를 읽는 유일한 통로 — Provider 밖 사용은 조용히 죽지 않고 즉시 터진다 */
export function useNavigation(): NavigationContextValue {
  const value = use(NavigationContext);

  if (value === null) {
    throw new Error('Navigation 부품은 Navigation.Provider 안에서만 쓴다');
  }

  return value;
}
```

- [ ] **Step 3: 부품을 만든다**

`src/widgets/site-navigation/ui/Navigation.tsx` 를 만든다.

```tsx
'use client';

/** 내비게이션 부품 — 데스크톱 목록과 모바일 dialog 가 같은 부품을 골라 쓴다 */
import { useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Container } from '@/shared/ui';
import {
  NavigationContext,
  useNavigation,
  type NavItem,
} from '../model/navigationContext';

// hover·focus 에서 같이 커지는 점 — 색만 바꾸면 어느 항목을 짚었는지가 얕게 읽힌다
const LINK_CLASS =
  'group inline-flex items-center gap-2 text-body text-muted transition-colors duration-quick ease-standard hover:text-foreground focus-visible:text-foreground';

const DOT_CLASS =
  'size-1.5 scale-0 rounded-full bg-accent transition-transform duration-quick ease-standard group-hover:scale-100 group-focus-visible:scale-100';

type ProviderProps = {
  items: readonly NavItem[];
  children: ReactNode;
};

// 목록을 렌더 함수로 받는다 — 부품이 데이터를 내려주는 경우라 children 보다 render prop 이 맞다
type MenuProps = Omit<ComponentPropsWithRef<'ul'>, 'children'> & {
  renderItem: (item: NavItem) => ReactNode;
};

type LinkProps = {
  item: NavItem;
};

/** dialog 참조와 열고·닫고·이동 세 동작을 소유한다 */
function NavigationProvider({ items, children }: ProviderProps) {
  const menuRef = useRef<HTMLDialogElement | null>(null);

  // 콜백 ref 로 넘긴다 — RefObject 를 context 에 실으면 소비 쪽 ref={...} 가 "렌더 중 ref 접근" 으로 걸린다
  const attachDialog = (element: HTMLDialogElement | null): void => {
    menuRef.current = element;
  };

  // showModal 이라야 Escape 닫기와 포커스 가둠을 브라우저가 대신 해준다(show 는 안 해준다)
  const open = (): void => {
    menuRef.current?.showModal();
  };

  const close = (): void => {
    menuRef.current?.close();
  };

  // 메뉴를 닫고 목적지로 포커스까지 옮긴다 — 화면만 스크롤되면 포커스가 뒤에 남아 눈과 손이 갈린다
  const navigate = (href: string): void => {
    close();
    const target = document.querySelector(href);

    if (target instanceof HTMLElement) {
      target.focus();
    }
  };

  return (
    <NavigationContext
      value={{
        state: { items },
        actions: { open, close, navigate },
        meta: { attachDialog },
      }}>
      {children}
    </NavigationContext>
  );
}

/** 상단 고정 골격 — fixed 다. Hero 가 min-h-svh 라 sticky 면 첫 화면을 다 지나야 나타난다 */
/* Bar 와 MenuDialog 를 형제로 받는다 — dialog 는 header 안이되 Container 밖이어야 전체 화면을 덮는다 */
function NavigationRoot({ children }: { children: ReactNode }) {
  return (
    <header className='fixed inset-x-0 top-0 z-(--ds-z-navigation)'>
      {children}
    </header>
  );
}

/** 헤더 한 줄 — 높이를 토큰으로 고정한다. global.css 의 scroll-padding-top 이 같은 값을 본다 */
function NavigationBar({ children }: { children: ReactNode }) {
  return (
    <Container
      size='wide'
      className='flex h-header items-center justify-between'>
      {children}
    </Container>
  );
}

/** 홈으로 돌아가는 사이트 이름 */
function NavigationBrand({ children }: { children: ReactNode }) {
  return (
    <a
      href='#top'
      className='text-body font-medium text-foreground'>
      {children}
    </a>
  );
}

/** 항목 목록 — ul·li·key 배선을 소유하고 링크 표현만 넘긴다. 순회가 여기 한 번뿐이다 */
function NavigationMenu({ renderItem, ...rest }: MenuProps) {
  const { state } = useNavigation();

  return (
    <ul {...rest}>
      {state.items.map((item) => {
        return <li key={item.href}>{renderItem(item)}</li>;
      })}
    </ul>
  );
}

/** 데스크톱 항목 링크 — 앵커 기본 동작에 맡긴다 */
function NavigationLink({ item }: LinkProps) {
  return (
    <a
      href={item.href}
      className={LINK_CLASS}>
      <span
        aria-hidden='true'
        className={DOT_CLASS}
      />
      {item.label}
    </a>
  );
}

/** 모바일 메뉴 여는 버튼 */
function NavigationMenuTrigger({ children }: { children: ReactNode }) {
  const { actions } = useNavigation();

  return (
    <button
      type='button'
      onClick={actions.open}
      className='text-body text-muted transition-colors duration-quick ease-standard hover:text-foreground md:hidden'>
      {children}
    </button>
  );
}

/** 네이티브 dialog — Escape·포커스 가둠·backdrop 을 브라우저가 처리해 Radix 가 필요 없다 */
function NavigationMenuDialog({ children }: { children: ReactNode }) {
  const { actions, meta } = useNavigation();

  return (
    <dialog
      ref={meta.attachDialog}
      // dialog 자체에 이름을 준다 — 안쪽 nav 의 이름은 모달의 이름으로 쓰이지 않는다
      aria-label='모바일 메뉴'
      className='h-svh max-h-none w-full max-w-none bg-surface text-foreground backdrop:bg-background/80'>
      <Container
        size='wide'
        className='flex h-full flex-col'>
        <div className='flex h-header items-center justify-end'>
          <button
            type='button'
            onClick={actions.close}
            className='text-body text-muted'>
            메뉴 닫기
          </button>
        </div>
        {children}
      </Container>
    </dialog>
  );
}

/** 모바일 항목 링크 — 같은 문서 앵커라 이동해도 dialog 가 저절로 닫히지 않는다 */
function NavigationMenuLink({ item }: { item: NavItem }) {
  const { actions } = useNavigation();

  return (
    <a
      href={item.href}
      onClick={() => {
        actions.navigate(item.href);
      }}
      className='text-section text-foreground'>
      {item.label}
    </a>
  );
}

/** 내비게이션 부품 묶음 */
export const Navigation = {
  Provider: NavigationProvider,
  Root: NavigationRoot,
  Bar: NavigationBar,
  Brand: NavigationBrand,
  Menu: NavigationMenu,
  Link: NavigationLink,
  MenuTrigger: NavigationMenuTrigger,
  MenuDialog: NavigationMenuDialog,
  MenuLink: NavigationMenuLink,
};
```

- [ ] **Step 3b: 린트를 먼저 돌린다 (조립 전 관문)**

Run: `npm run lint`
Expected: PASS.

**여기서 `react-hooks/refs` 가 터지면 콜백 ref 우회가 실패한 것이다.** Codex 사전 리뷰가 잡은 지점이다 — `meta` 에 `RefObject` 를 실으면 소비 쪽 `ref={meta.menuRef}` 가 "Cannot access refs during render" 로 걸린다. `attachDialog` 는 ref 객체가 아니라 함수라 이 규칙을 지나야 한다.

지나지 못하면 `eslint-disable` 로 덮지 **않는다.** 대신 `MenuDialog` 가 `useRef` 를 직접 갖고 `useEffect` 로 Provider 에 등록하는 형태로 바꾼다 — 규칙이 막는 것은 실제 위험(렌더 중 ref 읽기)이라 우회가 아니라 구조를 고치는 게 맞다.

- [ ] **Step 4: SiteNavigation 을 조립체로 축소한다**

`src/widgets/site-navigation/ui/SiteNavigation.tsx` 전체를 아래로 바꾼다.

```tsx
'use client';

/** 사이트 내비게이션 — 데스크톱 목록과 모바일 dialog 메뉴로 갈리는 조립체 */
import { SITE } from '@/shared/config';
import { NAV_ITEMS } from '../config/navItems';
import { Navigation } from './Navigation';

/** 홈 상단에 고정되는 내비게이션 */
export function SiteNavigation() {
  return (
    <Navigation.Provider items={NAV_ITEMS}>
      <Navigation.Root>
        <Navigation.Bar>
          <Navigation.Brand>{SITE.name}</Navigation.Brand>

          <nav
            aria-label='주요 메뉴'
            className='hidden md:block'>
            <Navigation.Menu
              className='flex items-center gap-8'
              renderItem={(item) => {
                return <Navigation.Link item={item} />;
              }}
            />
          </nav>

          <Navigation.MenuTrigger>메뉴 열기</Navigation.MenuTrigger>
        </Navigation.Bar>

        {/* Container 밖이다 — dialog 가 전체 화면을 덮어야 하므로 Bar 와 형제로 둔다 */}
        <Navigation.MenuDialog>
          <nav
            aria-label='모바일 메뉴'
            className='flex-1'>
            <Navigation.Menu
              className='flex flex-col gap-6'
              renderItem={(item) => {
                return <Navigation.MenuLink item={item} />;
              }}
            />
          </nav>
        </Navigation.MenuDialog>
      </Navigation.Root>
    </Navigation.Provider>
  );
}
```

`Root` 를 `header` 만 그리게 하고 `Bar` 를 따로 둔 이유가 여기서 드러난다. 현행 마크업에서 `<dialog>` 는 `<header>` **안**이면서 `<Container>` **밖**이다. `Root` 가 `Container` 까지 소유하면 dialog 가 gutter 안으로 들어가 전체 화면을 못 덮는다. 부품을 둘로 쪼개야 이 배치가 그대로 나온다.

- [ ] **Step 5: 기존 테스트로 검증한다**

Run: `npx vitest run src/widgets/site-navigation`
Expected: PASS (6 tests). 한 줄도 고치지 않았는데 통과해야 한다. 실패하면 마크업이 바뀐 것이다.

- [ ] **Step 6: 순회가 한 번으로 줄었는지 확인한다**

Run:

```sh
grep -rn 'state.items.map\|NAV_ITEMS.map' src/widgets --include='*.tsx'
```

Expected: `Navigation.tsx` 의 `state.items.map` 1건만. `SiteNavigation.tsx` 에는 `.map` 이 없어야 한다.

- [ ] **Step 7: 전체 검증과 커밋**

Run: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`

```sh
git add src/widgets/site-navigation
git commit -m "refactor: split SiteNavigation into context-backed parts"
```

---

## Task 5: ProjectRow 단일 컴포넌트 추출

**Files:**

- Create: `src/pages/home/ui/WorkSection/ProjectRow.tsx`
- Create: `src/pages/home/ui/WorkSection/ProjectRow.test.tsx`
- Modify: `src/pages/home/ui/WorkSection/WorkSection.tsx`

**Interfaces:**

- Consumes: `Project` from `@/entities/project`, `Media`·`MediaReveal` from `@/shared/ui`
- Produces: `ProjectRow` — `{ project: Project; staggerIndex: number }` 를 받는 단일 컴포넌트. 슬라이스 내부 파일이라 상대경로로 import 하고 `shared/ui` 로 올리지 않는다.

**compound 가 아니다.** 소비자가 `WorkSection` 한 곳뿐이고 늘 같은 순서로 조립하므로 설계 3절 관문 2번을 통과하지 못한다. 여기서 필요한 것은 조립 자유도가 아니라 이름이다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`ProjectRow.test.tsx` 에 픽스처 `PROJECT` 를 두고 다섯 계약을 검증한다 — heading 레벨 3, 목록 항목, `dl` 메타, 링크 이름에 제목 접두, 링크 0건일 때 목록 미생성.

목록 항목 단언은 `getByRole('listitem')` 로 쓰면 **안 된다.** 안쪽 링크 목록도 `listitem` 을 내서 "Found multiple elements" 로 터진다. 바깥 항목은 제목을 품은 쪽으로 가린다.

```tsx
expect(screen.getAllByRole('listitem')[0]).toContainElement(
  screen.getByRole('heading', { level: 3, name: '사내 대시보드' })
);
```

- [ ] **Step 2: 실패를 확인한다**

Run: `npx vitest run src/pages/home/ui/WorkSection/ProjectRow.test.tsx`
Expected: FAIL — `Failed to resolve import './ProjectRow'`

- [ ] **Step 3: 구현한다**

`WorkSection` 의 `<li>` 블록을 그대로 `ProjectRow.tsx` 로 옮긴다. 마크업은 한 글자도 바꾸지 않는다 — 이것이 시각 등가의 근거다.

`project` 객체를 통째로 받는다. 필드를 낱개로 펴면 props 가 8개가 되고 그 목록은 `Project` 타입을 받아쓴 것에 지나지 않는다.

- [ ] **Step 4: 테스트 통과를 확인한다**

Run: `npx vitest run src/pages/home/ui/WorkSection/ProjectRow.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: WorkSection 을 전환한다**

```tsx
{projects.map((project, index) => {
  return (
    <ProjectRow
      key={project.slug}
      project={project}
      staggerIndex={index}
    />
  );
})}
```

`Media`·`MediaReveal` import 가 `WorkSection.tsx` 에서 고아가 된다 — 제거한다(이 Task 가 만든 고아이므로 치우는 것이 맞다).

- [ ] **Step 6: 기존 WorkSection 테스트로 검증한다**

Run: `npx vitest run src/pages/home/ui/WorkSection`
Expected: PASS. `WorkSection.test.tsx` 는 고치지 않는다.

---

## Task 6: Rail 단일 컴포넌트 추출

**Files:**

- Create: `src/pages/home/ui/GallerySection/Rail.tsx`
- Create: `src/pages/home/ui/GallerySection/Rail.test.tsx`
- Modify: `src/pages/home/ui/GallerySection/GallerySection.tsx`

**Interfaces:**

- Consumes: `Media`·`MediaRatio` from `@/shared/ui`
- Produces: `Rail` — `{ direction: 'forward' | 'reverse'; label: string; items: RailItem[] }`. `RailItem` 타입도 함께 export 한다.

**compound 가 아니다.** 소비자가 `GallerySection` 한 곳이고, 두 줄은 배치가 다른 게 아니라 같은 배치에 `direction` 값만 다르다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`Rail.test.tsx` 에서 다섯 가지를 본다 — 이름 있는 `group`, `tabindex=0`, `data-rail=reverse`, `data-rail=""`, 항목 개수.

`src` 가 `null` 이면 `Media` 가 `<img>` 대신 `aria-hidden` 자리표시를 그리므로 **`alt` 로 조회할 수 없다.** 항목 개수는 트랙의 자식 수로 센다.

```tsx
expect(container.querySelectorAll('[data-rail] > *')).toHaveLength(2);
```

- [ ] **Step 2: 실패를 확인한다**

Run: `npx vitest run src/pages/home/ui/GallerySection/Rail.test.tsx`
Expected: FAIL — `Failed to resolve import './Rail'`

- [ ] **Step 3: 구현한다**

`GallerySection` 의 rail 한 줄을 그대로 옮긴다. `RailItem` 인터페이스를 `Rail.tsx` 가 소유한다 — `config/gallery.ts` 의 `GalleryItem` 은 구조적으로 같아 그대로 들어가므로 config 를 고칠 필요가 없다.

`overflow-x-auto` · `tabIndex={0}` · `role='group'` · `aria-label` 넷은 5단계 결정("감쇠에서 정보가 안 빠지도록 키보드 스크롤 가능")의 결과라 함께 움직여야 한다. 하나라도 빠지면 접근성 계약이 깨지므로 소비자에게 흩어 두지 않는다.

- [ ] **Step 4: 테스트 통과를 확인한다**

Run: `npx vitest run src/pages/home/ui/GallerySection/Rail.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: GallerySection 을 전환한다**

```tsx
{GALLERY_ROWS.map((row, rowIndex) => {
  const direction = rowIndex % 2 === 1 ? 'reverse' : 'forward';

  return (
    <Rail
      key={direction}
      direction={direction}
      label={`작업 기록 ${rowIndex + 1}번째 줄`}
      items={row}
    />
  );
})}
```

`key={direction}` 은 현행 `key={isReverse ? 'reverse' : 'forward'}` 와 같은 값이다. 줄이 2개를 넘으면 중복 key 가 되므로 `GALLERY_ROWS` 가 늘어나면 `key={rowIndex}` 로 바꾼다.

- [ ] **Step 6: 전체 검증**

Run: `npm run format && npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`
Expected: 전부 통과. 출력을 잘라 보지 말고 exit code 로 판정한다.

---

## 계획과 달랐던 것

**ProjectRow · Rail 은 compound 가 아니라 단일 컴포넌트가 됐다.** 초안은 둘을 등급 A 로 넣었다. "12칼럼 비대칭", "forward/reverse 2줄" 을 배치 변형으로 셌기 때문이다. 구현 도중 사람이 "상태 로직은 하나인데 그리는 배치가 사용처마다 다를 때 쓰는 것 아니냐" 고 물었고, 그 기준으로 다시 세니 **둘 다 소비자가 1곳이고 늘 같은 순서로 조립**한다 — 관문 2번 미달이었다. 한 가지 복잡한 배치는 배치 변형이 아니다. 얻으려던 것은 가독성이었고 그건 단일 컴포넌트로 충분하다. API 표면이 10개에서 2개로 줄었다.

**`meta` 의 콜백 ref 도 그대로는 린트를 통과하지 못했다.** Codex 사전 리뷰가 `ref={meta.menuRef}`(RefObject)를 잡아 콜백 ref 로 바꿨는데, `ref={meta.attachDialog}`(함수) **역시** `react-hooks/refs` 에 걸렸다. 규칙이 막는 것은 ref 객체가 아니라 **`ref=` 자리에 온 멤버 접근 표현식 자체**다. 인라인 화살표로 감싸 해결했다.

```tsx
ref={(element) => {
  meta.attachDialog(element);
}}
```

플랜이 예비책으로 적어 둔 `useEffect` 등록은 쓰지 않았다. 인라인 콜백이 통과했고 더 단순하다.

**`getByRole('listitem')` 은 ProjectRow 테스트에서 쓸 수 없다.** 안쪽 링크 목록도 `listitem` 을 내서 "Found multiple elements" 로 터진다. 처음 쓴 단언이 실제로 이걸로 실패했고, 제목을 품은 항목으로 가리도록 고쳤다. 구현이 아니라 테스트가 틀린 경우였다.

**`cn` 레지스트리는 이미 준비돼 있었다.** Task 3 Step 4 가 `text-statement`·`text-section` 등록 여부를 확인하라고 했는데, `cn.ts` 의 `text` 테마 스케일에 둘 다 이미 있었고 `cn.test.ts` 가 같은 그룹 축약을 이미 검증하고 있었다. 중복 테스트는 추가하지 않았다.

**Introduction 의 클래스 위치 이동은 계획대로 한 곳뿐이었다.** 글자 크기가 `RevealText` 의 span 에서 `h2` 로 올라갔고, span 이 `display: block` 이라 시각 결과는 같다.

## 완료 기준

설계 8절의 여섯 항목을 그대로 쓴다.

1. `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build` 전부 통과
2. `'use client'` 가 새로 붙은 파일 없음 — 확인: `grep -rln "use client" src app` 결과가 기존 7개 + `model/navigationContext.ts` + `ui/Navigation.tsx` 뿐이고 **둘 다 이미 클라이언트였던 `site-navigation` 슬라이스 안**이다
3. 섹션 라벨 역할의 `text-label text-subtle uppercase` 를 `SectionHeading.Label` 이 단독 소유
4. `NAV_ITEMS` 순회가 한 번
5. `SectionHeading` 우회 섹션 0
6. 렌더 마크업 동일 — 기존 테스트를 **한 줄도 고치지 않고** 통과한 것이 증거다
