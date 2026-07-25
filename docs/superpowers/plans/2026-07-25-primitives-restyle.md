# 나머지 프리미티브 리스타일 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.
>
> 설계 근거: `specs/2026-07-25-design-system-terracotta-retheme-design.md` (§2 모션·§3 재질·§4.2 컴포넌트별) + 승인된 리빙 스타일가이드 v2. 이 플랜은 스펙 **플랜3**(컬러=플랜1, 모션·재질+Button=플랜2 완료, Timeline 제거 완료). 엄격 토큰 ESLint는 이후 별도.

**Goal:** 플랜2에서 Button에 확립한 언어(스프링 촉감 + aged-bronze 재질 + 테라코타 semantic)를 나머지 13개 프리미티브에 확산하고, v2에서 승인한 개성 재설계(Toggle 상태칩·Segmented 슬라이드·Select 계기판·Accordion 360°)를 적용한다.

**Architecture:** 색은 플랜1로 이미 재도색됨 — 이 플랜은 주로 각 컴포넌트 `.css.ts`에 **모션(스프링/촉감)·재질(finish/shadow)·구조적 개성**을 더한다. 공유 언어는 Button.css가 정본 참조. "언어는 공유, 표현은 해부구조별 방언"(design-system-component.md). 대부분 CSS 변경이라 기존 동작 테스트를 green으로 유지하고, 새 상호작용을 도입한 곳만 테스트를 손본다.

**Tech Stack:** vanilla-extract(`style`/`recipe`/`createVar`·`keyframes`), Radix, TypeScript, Vitest + RTL, Storybook.

## Global Constraints

- 색은 `vars.color.*` semantic만 — raw hex 금지. 치수·모션·재질은 `vars.dimension`/`vars.radius`/`vars.motion`/`vars.easing`/`finish`/`shadow` 토큰 사용.
- 모션: hover 들림/썸 이동 = `vars.motion.tactileLift`/`controlSlide`(spring/springStrong), 눌림 = `tactilePress`. **모든 transform은 `(prefers-reduced-motion: no-preference)` 미디어로 게이트**(specificity 함정 회피 — 플랜2 교훈). hover는 `:not(:disabled):not([data-disabled])` 제외.
- 재질: 눌리는 금속 파트(썸·인디케이터)만 `finish.inset`. 표면/패널은 `vars.color.bg.surface` + `shadow.raise`.
- 화살표 블록 바디. 단일 라인 JSDoc. 테스트 설명 한국어. 컴포넌트별 배럴 없음.
- 각 컴포넌트의 **기존 공개 API·Radix 파트 구조·접근성 계약은 불변** — 스타일만 바꾼다(개성 재설계도 마크업 최소 변경).
- **per-task 검증에 `npm run lint` + `npx prettier --write <바뀐 파일>` 포함**(플랜2에서 서브에이전트가 prettier 누락 → 사후 포맷 필요했음). 마무리 전체: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`.
- 각 컴포넌트 `.css.ts` 수정 전 **현재 파일을 읽고**, Button.css의 토큰 사용 패턴을 참조해 같은 결로 적용한다.

---

## Task 1: Switch · Slider (물리 컨트롤 — 썸 재질 + 스프링 이동/확대)

**Files:** `src/shared/ui/Switch/Switch.css.ts`, `src/shared/ui/Slider/Slider.css.ts`

- [ ] **Step 1: 현재 파일 읽기** — 두 `.css.ts`의 현재 구조(트랙·썸·range) 파악.
- [ ] **Step 2: Switch 리스타일** — 트랙 배경은 off=`vars.color.bg.surfaceMuted`, on=`vars.color.bg.brand`(테라코타), 보더 `vars.color.stroke.neutral`. 썸은 `vars.color.bg.surface`(밝은 크림) + `boxShadow: finish.inset`, on일 때 `transform: translateX(...)`를 **`vars.motion.controlSlide`(springStrong) 트랜지션 + `(prefers-reduced-motion: no-preference)` 게이트**로. reduce에선 이동은 즉시(트랜지션 없음).
- [ ] **Step 3: Slider 리스타일** — 트랙=`bg.surfaceMuted`, range(채워진 구간)=`bg.brand`, 썸=`bg.surface` + `finish.inset` + `stroke.neutral` 보더. 썸 hover 확대(`transform: scale(1.15)`)는 `tactileLift` easing + no-preference 게이트. focus-visible 링은 기존 `stroke.brand` 유지.
- [ ] **Step 4: 검증** — `npm test -- Switch Slider && npx tsc --noEmit && npm run lint && npx prettier --write src/shared/ui/Switch/Switch.css.ts src/shared/ui/Slider/Slider.css.ts`. 기존 테스트 green 유지.
- [ ] **Step 5: 커밋** — `feat(controls): apply terracotta material/spring to Switch and Slider`

---

## Task 2: Toggle(상태 칩) · ToggleGroup(슬라이드 인디케이터) — 개성 재설계

**Files:** `src/shared/ui/Toggle/Toggle.css.ts`, `src/shared/ui/ToggleGroup/ToggleGroup.css.ts`

- [ ] **Step 1: 현재 파일 읽기.**
- [ ] **Step 2: Toggle → 상태 칩** (v2 승인). 솔리드 버튼과 구분되는 언어: 알약형(`borderRadius: vars.radius.pill`), 좌측 인디케이터 점(`::before` 원, off=`stroke` 테두리만·on=`bg.brand` 채움 + 링), 활성 시 `background`는 브랜드 약배경(`vars.color.bg.brandWeak`)·`borderColor: vars.color.stroke.brand`·`color: vars.color.fg.brand`, 눌린 듯 `boxShadow: shadow.press`(약하게). `:active` scale은 `tactilePress` + no-preference 게이트. **Radix Toggle Root의 `data-state="on"` 셀렉터로 상태 스타일.**
- [ ] **Step 3: ToggleGroup → 미끄러지는 인디케이터** (v2 승인). 리세스 트랙(`bg.surfaceMuted` + `inset` 그림자), 아이템은 투명 배경 텍스트 버튼(`fg.muted`), 선택 아이템은 `fg.onBrand`. 인디케이터는 등폭 그리드 기반 CSS 이동(`data-state` 또는 컨테이너 `data-active` 인덱스 → `transform: translateX(n*100%)`)을 `controlSlide`(springStrong) + no-preference 게이트로. **마크업이 인디케이터 span을 요구하면 ToggleGroup.tsx에 최소 추가**(Radix 파트 구조·접근성 불변, 순수 장식 span). 구현 난이도가 높으면 인디케이터 대신 선택 아이템 배경(`bg.brand`)+`finish.inset`으로 단순화하고 그 사실을 보고.
- [ ] **Step 4: 검증** — `npm test -- Toggle ToggleGroup && npx tsc --noEmit && npm run lint && npx prettier --write <두 파일>`. Radix 상태·키보드 계약 회귀 없어야 함.
- [ ] **Step 5: 커밋** — `feat(toggle): redesign Toggle as state chip and ToggleGroup with sliding indicator`

---

## Task 3: Select(리세스 계기판) · Accordion(360° 셰브론) — 개성 재설계

**Files:** `src/shared/ui/Select/Select.css.ts`, `src/shared/ui/Accordion/Accordion.css.ts` (+ 필요시 각 `.tsx`의 셰브론/셰브론 웰 마크업 최소 조정)

- [ ] **Step 1: 현재 파일·tsx 읽기.**
- [ ] **Step 2: Select → 리세스 계기판** (v2 승인). Trigger를 밋밋한 인풋에서 "계기판"으로: 리세스 배경(`bg.surface`/어두운 스텝 + `inset` 그림자), 값 텍스트는 `fg.brand`(테라코타), 우측 셰브론은 분리된 "웰"(좌측 보더 `stroke.muted`로 구분된 영역, hover 시 `bg.surfaceMuted`+`fg.brand`). 열린 Content 패널은 `bg.surface` + `shadow.raise`, 항목 hover=`bg.surfaceMuted`, 선택=`fg.brand` + 체크. **Radix Select 파트·Viewport·접근성 불변.**
- [ ] **Step 3: Accordion → 제자리 360° 셰브론** (v2 승인). 셰브론을 고정 크기 박스(`vars.dimension.x6`)의 SVG로, `data-state="open"`일 때 `transform: rotate(360deg)`(위아래 위치 안 바뀌게 transform-origin center), `tactileLift`(spring) 트랜지션 + no-preference 게이트, 열림 시 `color: vars.color.fg.brand`. 셰브론이 유니코드 글자면 SVG로 교체(마크업 최소 변경, `aria-hidden`). body는 기존 전개 유지. **Radix Accordion 파트·키보드 불변.**
- [ ] **Step 4: 검증** — `npm test -- Select Accordion && npx tsc --noEmit && npm run lint && npx prettier --write <파일들>`.
- [ ] **Step 5: 커밋** — `feat(select): recessed instrument Select trigger and 360-degree Accordion chevron`

---

## Task 4: RadioGroup · Progress · IconTile · Divider (경량 material/motion)

**Files:** 각 `.css.ts`.

- [ ] **Step 1: 현재 파일 읽기.**
- [ ] **Step 2: 적용** —
  - **RadioGroup:** 선택 점을 `bg.brand`(테라코타) 채움, 테두리 `stroke.neutral`→선택 시 `stroke.brand`. 선택 전환에 `tactileLift`(spring) 미세 scale(no-preference 게이트). `data-state="checked"` 셀렉터.
  - **Progress:** indicator(채워진 바)=`bg.brand`, 트랙=`bg.surfaceMuted`. 값 전환 트랜지션은 `vars.motion.colorTransition` 유지(모션 과함 금지).
  - **IconTile:** hover 들림(`transform: translateY(-3px)` + `tactileLift`, no-preference 게이트), 색 `fg.muted`→`fg.brand`, 보더 `stroke`→`stroke.brand`. focus-visible 유지.
  - **Divider:** `vars.color.stroke.muted` 헤어라인 확인만(이미 semantic이면 변경 최소).
- [ ] **Step 3: 검증** — `npm test -- RadioGroup Progress IconTile Divider && npx tsc --noEmit && npm run lint && npx prettier --write <파일들>`.
- [ ] **Step 4: 커밋** — `feat(ui): apply terracotta material/motion to RadioGroup, Progress, IconTile, Divider`

---

## Task 5: DropdownMenu · Dialog · AlertDialog (오버레이 패널)

**Files:** 각 `.css.ts`.

- [ ] **Step 1: 현재 파일 읽기.**
- [ ] **Step 2: 적용** —
  - **DropdownMenu:** Content 패널=`bg.surface` + `shadow.raise` + `stroke.muted` 보더, 항목 hover/`data-highlighted`=`bg.surfaceMuted`, 위험 항목이 있으면 `fg.critical`. 진입은 `vars.motion.overlayEnter`.
  - **Dialog:** 모달=`bg.surface` + `shadow.raise`(강한 그림자), 스크림=`vars.color.bg.overlay`(따뜻한 다크). Title/Description 색은 `fg.neutral`/`fg.muted`. 진입/퇴장 `overlayEnter`/`overlayExit`.
  - **AlertDialog:** Dialog와 동일 뼈대 + 파괴 강조는 `fg.critical`/`stroke.critical`, 삭제 버튼은 Button `variant='critical'`(스토리 이미 반영). 스크림 동일.
- [ ] **Step 3: 검증** — `npm test -- DropdownMenu Dialog AlertDialog && npx tsc --noEmit && npm run lint && npx prettier --write <파일들>`.
- [ ] **Step 4: 커밋** — `feat(overlay): apply terracotta surface/shadow/motion to DropdownMenu, Dialog, AlertDialog`

---

## Task 6: 전체 검증 + 잔재 정리

- [ ] **Step 1: 전체 CI** — `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`. 전부 PASS.
- [ ] **Step 2: raw 값 스캔** — `grep -rnE "#[0-9a-fA-F]{6}" src/shared/ui --include=*.css.ts` (토큰 파일 제외) → 컴포넌트 css에 하드코딩 hex 0이어야. 남으면 semantic 토큰으로 교체.
- [ ] **Step 3: 스토리북 빌드** — `npm run build-storybook`으로 전 프리미티브 스토리 컴파일 확인(시각 회귀 표면).
- [ ] **Step 4: (조건부) 수정 커밋** — 발견된 잔재만 외과적으로.

---

## Self-Review 결과 (스펙 §4.2 대비)

- **개성 재설계:** Toggle 상태칩(T2)·ToggleGroup 슬라이드(T2)·Select 계기판(T3)·Accordion 360°(T3) — v2 승인분 매핑.
- **material/motion 확산:** Switch/Slider 썸(T1)·RadioGroup/Progress/IconTile/Divider(T4)·오버레이 3종(T5).
- **경계:** 색 semantic만, transform은 no-preference 게이트, hover는 disabled 제외, Radix 파트·접근성 불변.
- **범위 밖(엄격 ESLint):** 이후 별도 — 이 플랜은 스타일만.
- 리스크: ToggleGroup 슬라이드 인디케이터가 마크업 추가를 요구할 수 있음(Step 명시, 어려우면 단순화 + 보고).
