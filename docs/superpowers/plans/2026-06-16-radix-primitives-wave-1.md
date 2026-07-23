# Radix 프리미티브 Wave 1 (디스클로저) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:test-driven-development. RED→GREEN→REFACTOR로 Task별 구현. Steps use checkbox (`- [ ]`).

**Goal:** `shared/ui`에 Radix 기반 디스클로저 프리미티브 2종(Accordion·Tabs)을 Button/Wave 0 파이프라인대로 추가한다.

**Architecture:** 멀티파트 네임스페이스 객체. Accordion = `{ Root, Item, Header, Trigger, Content }`, Tabs = `{ Root, List, Trigger, Content }`. 각 파트는 Radix 파트를 얇게 감싸 vanilla-extract 스타일만 입히고, prop 타입은 `ComponentPropsWithoutRef<typeof RadixPart>`에서 끌어온다. 열고닫기 슬라이드 애니메이션은 deferred(이펙트는 사용자 손맛 — Wave 0 선례 따라 keyframes 미사용). 활성 표시는 `data-state` 기반 정적 스타일(ToggleGroup의 `data-state="on"` 틴트와 동형).

**Tech Stack:** React + TypeScript, `radix-ui`@1.5.0(통합), `@vanilla-extract/css` + `sprinkles`, Vitest + RTL + `@testing-library/user-event`, Storybook.

**Spec:** [2026-06-16-radix-primitives-design.md](../specs/2026-06-16-radix-primitives-design.md) (§7 Wave 1).

---

## 공통 규약 (모든 Task 적용)

- **import 별칭:** `import { Accordion as AccordionPrimitive } from 'radix-ui'` — `Primitive` 접미사로 우리 export 이름과 충돌 회피.
- **className 병합:** `[internalClass, className].filter(Boolean).join(' ')`.
- **forwardRef/타입:** `forwardRef<React.ComponentRef<typeof X.Part>, React.ComponentPropsWithoutRef<typeof X.Part>>` (Wave 0과 동일, `React.ComponentRef` 사용).
- **화살표 본문은 블록형:** `({ className, ...props }, ref) => { return (...) }` — `arrow-body-style:always` 룰 준수(사후수정 금지).
- **주석:** 파일 헤더·export 1줄 `/** */`, JSX 안 WHY는 한 줄 `{/* */}`, JSX 밖은 `//`.
- **테스트:** describe/it 한국어, 접근성 역할·동작으로 검증(클래스명 단언 금지).
- **검증(Task별):** `npx vitest run src/shared/ui/<Name>/<Name>.test.tsx` → `npm run lint` → `npm run type-check`.
- **커밋 트레일러:** `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

## File Structure

```
src/shared/ui/
├── Accordion/  { Accordion.tsx, Accordion.css.ts, Accordion.test.tsx, Accordion.stories.tsx }
├── Tabs/       { Tabs.tsx, Tabs.css.ts, Tabs.test.tsx, Tabs.stories.tsx }
└── index.ts    # 프리미티브당 한 줄 export 추가

docs/learning/radix-primitives.md   # Accordion·Tabs 섹션 누적
```

---

## Task 1: Accordion

**Parts:** `Root`(컨테이너 테두리) · `Item`(구분선) · `Header`(h3 마진 리셋) · `Trigger`(클릭 헤더, 전폭) · `Content`(접이 패널). 모두 래핑.

**Radix가 해주는 것(학습 문서 근거):** single/multiple·collapsible 상태(`useControllableState`), `Header`=heading 의미, `Trigger`=`<button aria-expanded aria-controls>`, `Content`=`role="region"`(`Presence`로 열림에만 마운트), 키보드(↑↓ 항목 이동·Home/End), `data-state="open|closed"` + `--radix-accordion-content-height` CSS 변수(애니메이션용, 우리는 deferred).

- [ ] **Step 1: RED** — `Accordion.test.tsx`. 검증: ① 트리거 클릭 시 패널이 열린다(`region` 등장 + `aria-expanded`), ② `type="single"`은 새 패널을 열면 이전 패널이 닫힌다, ③ `onValueChange` 호출.
- [ ] **Step 2: GREEN** — `Accordion.tsx`(네임스페이스) + `Accordion.css.ts`(sprinkles 레이아웃 + `data-state` 정적 스타일). 테스트 GREEN.
- [ ] **Step 3:** `Accordion.stories.tsx`(single+collapsible 매트릭스) + `index.ts` 1줄 + 학습 문서 `## Accordion` 섹션.
- [ ] **Step 4:** lint + type-check 통과.

## Task 2: Tabs

**Parts:** `Root`(세로 컨테이너) · `List`(탭 줄, 하단 보더) · `Trigger`(탭 버튼, 활성 밑줄) · `Content`(패널). 모두 래핑.

**Radix가 해주는 것:** `List`=`role="tablist"`+roving focus, `Trigger`=`role="tab"`+`aria-selected`+`aria-controls`, `Content`=`role="tabpanel"`+`aria-labelledby`(선택된 것만 표시), 자동/수동 활성화(`activationMode`), 화살표 이동, `data-state="active|inactive"`.

- [ ] **Step 1: RED** — `Tabs.test.tsx`. 검증: ① 탭 클릭 시 해당 `tabpanel`이 보인다, ② 한 번에 한 패널만 활성, ③ 화살표 키로 탭 이동(roving + 자동 활성화), ④ `onValueChange` 호출.
- [ ] **Step 2: GREEN** — `Tabs.tsx` + `Tabs.css.ts`(`data-state="active"` 밑줄·색). 테스트 GREEN.
- [ ] **Step 3:** `Tabs.stories.tsx` + `index.ts` 1줄 + 학습 문서 `## Tabs` 섹션.
- [ ] **Step 4:** lint + type-check 통과.

## Task 3: 웨이브 마감

- [ ] 전체 검증: `npm run fsd` + `npm run lint` + `npm run type-check` + `npm run test`.
- [ ] 자기 리뷰(diff 외과성·주석 규약·역할 기반 테스트 확인).
- [ ] 메모리 `project_design_system.md`에 Wave 1 완료 반영, Wave 2를 다음 작업으로.
