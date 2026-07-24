# /lab/animation 플레이그라운드 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. 이 계획은 같은 세션에서 인라인 실행 전제로, 전체 코드 받아쓰기 대신 인터페이스·테스트 계약 중심으로 압축했다.

**Goal:** @keyframes 프리셋 4종 + animation 고유 속성(iteration-count·direction·fill-mode·play-state) 실시간 조작 플레이그라운드를 /lab/animation에 추가한다.

**Architecture:** transition 페이지와 동일 골격. `src/pages/lab-animation` 슬라이스에 model(타입·프리셋·변환·상태 훅) + ui(컨트롤·프리뷰·코드 패널·정리) 배치, 단일 config가 아래로만 흐른다. 연출은 CSS 변수 주입 + vanilla-extract `keyframes()`.

**Tech Stack:** Next.js(App Router) · vanilla-extract(sprinkles) · shared/ui(Radix 래퍼) · Vitest+RTL.

## Global Constraints

- 스펙: `docs/superpowers/specs/2026-07-06-lab-animation-design.md`
- 주석: 파일 헤더·export는 단일 라인 JSDoc, 본문은 한 줄 `//` WHY 주석
- 테스트 설명 한국어, TDD RED→GREEN→REFACTOR
- lab-transition 기존 코드는 수정하지 않는다 (스타일 로컬 복제)
- 검증 루틴: fsd+lint+type-check+test+format (build 제외)

---

### Task 1: model — presets.ts

**Files:** Create `src/pages/lab-animation/model/presets.ts`, Test `presets.test.ts`

**Produces:**

- 타입: `KeyframesPresetId`('slide'|'bounce'|'pulse'|'spin'), `TimingKeyword`(키워드 5종), `IterationCount`(1|2|3|'infinite'), `Direction`(4종), `FillMode`(4종), `PlayState`('running'|'paused'), `AnimationConfig`{preset, durationMs, delayMs, timing, iterationCount, direction, fillMode, playState}
- 데이터: `KEYFRAMES_PRESETS: {id, label, cssText}[]` (cssText는 CodePanel 표시용 @keyframes 원문, rest 대비용 opacity 1을 0%·100%에 포함), `ITERATION_OPTIONS`, `DIRECTION_OPTIONS`, `FILL_MODE_OPTIONS`, `DELAY_OPTIONS`(0·500·1000), `TIMING_OPTIONS`, `DEFAULT_CONFIG`(slide·1200ms·0ms·ease·infinite·alternate·none·running)

**Steps:** 테스트 먼저 — (1) DEFAULT_CONFIG.preset이 KEYFRAMES_PRESETS에 존재, (2) 각 프리셋 cssText가 `@keyframes <id>`로 시작(코드 패널 표시 계약) → 실패 확인 → 구현 → 통과 → 커밋 `feat(lab): animation 랩 프리셋·타입 정의`

### Task 2: model — toCssValue.ts

**Files:** Create `toCssValue.ts`, Test `toCssValue.test.ts`

**Produces:** `toCssValue(config): string` → `"slide 1200ms ease 0ms infinite alternate none running"` (축약형 순서: name duration timing delay count direction fill play-state)

**Steps:** 테스트 — (1) DEFAULT_CONFIG 변환 문자열, (2) 숫자 iterationCount(2)도 그대로 직렬화 → RED → 구현(한 줄 템플릿) → GREEN → 커밋 `feat(lab): animation 축약형 변환`

### Task 3: model — useAnimationConfig.ts

**Files:** Create `useAnimationConfig.ts`, Test `useAnimationConfig.test.ts`

**Produces:** `useAnimationConfig(): { config, update }` — `update(patch: Partial<AnimationConfig>)` 부분 갱신. 필드 간 파생 로직이 없어 transition처럼 필드별 setter를 두지 않는다.

**Steps:** renderHook 테스트 — (1) 초기값=DEFAULT_CONFIG, (2) update({direction:'reverse'})가 해당 필드만 바꾸고 나머지 유지 → RED → 구현 → GREEN → 커밋 `feat(lab): animation 조작 상태 훅`

### Task 4: ui — CodePanel, AnimationControls

**Files:** Create `ui/CodePanel.tsx(.css.ts)`, `ui/AnimationControls.tsx(.css.ts)` + 테스트

**Interfaces:**

- `CodePanel({config})` — `@keyframes` 원문 + `animation: <toCssValue>;` 두 블록 pre 표시, 복사 버튼(Toast). 복사 텍스트 = 두 블록 합본
- `AnimationControls({config, onChange})` — onChange는 `(patch: Partial<AnimationConfig>) => void`. 그룹: preset·duration(MsSlider 로컬 복제, max 3000)·iteration-count·direction·fill-mode·delay·timing (전부 ToggleGroup, Radix 재클릭 해제 '' 무시). 그룹마다 개념 노트

**Steps:** 그룹별 테스트(토글 클릭→onChange patch 검증, 슬라이더 키 조작, 노트 렌더 / CodePanel은 선언 표시·클립보드 목) → RED → 구현 → GREEN → 커밋 `feat(lab): animation 컨트롤·코드 패널`

### Task 5: ui — PreviewStage, AnimationReference, AnimationLabPage

**Files:** Create `ui/PreviewStage.tsx(.css.ts)`, `ui/AnimationReference.tsx(.css.ts)`, `ui/AnimationLabPage.tsx(.css.ts)` + 테스트

**Interfaces:**

- `PreviewStage({config, onPlayStateChange})` — `--lab-*` 변수 7종 주입, `key={runId}` 리마운트로 처음부터 재생(버튼 '처음부터 재생'), 일시정지 Switch→onPlayStateChange. 리마운트 vs play-state 차이 노트
- `PreviewStage.css.ts` — `keyframes()` 4종(0%·100% opacity 1 포함, slide는 `calc(100cqw - 100%)`), boxBase rest `opacity: 0.35`, animation-* 전부 `var(--lab-*)`, `styleVariants`로 animationName 연결
- `AnimationReference()` — 8종 세부 속성 표, 축약형 문법(시간값 2개 순서 규칙·name 키워드 충돌 주의), transition 대비 표
- `AnimationLabPage()` — 헤더(eyebrow Lab·타이틀·설명·CodePanel) + Controls + PreviewStage + Reference 조립, useAnimationConfig 소유

**Steps:** 테스트(변수 주입값, 리마운트로 노드 교체, 일시정지 콜백, 표 속성명 8종, 페이지 통합: direction 토글→코드 패널 문자열 갱신) → RED → 구현 → GREEN → 커밋 `feat(lab): animation 프리뷰·정리·페이지 조립`

### Task 6: 라우트·목록 연결 + 검증

**Files:** Create `src/pages/lab-animation/index.ts`, `app/lab/animation/page.tsx`; Modify `src/pages/lab/ui/LabPage.tsx`(LAB_ENTRIES 추가), `LabPage.test.tsx`

**Steps:** LabPage 테스트에 animation 링크 기대 추가 → RED → 엔트리·라우트 구현 → GREEN → `npm run fsd && npm run lint && npx tsc --noEmit && npm run test && npm run format` → 커밋 `feat(lab): animation 페이지 라우트·목록 연결`

## Self-Review

- 스펙 커버리지: 프리셋 4종(T1), 컨트롤 범위·play-state 위치(T4·T5), fill-mode 관찰 장치(T5 css), 재생 모델(T5), 라우트·목록(T6) — 누락 없음. 스펙의 timing 'Select'는 UI 일관성을 위해 ToggleGroup으로 확정(스펙에 반영).
- 타입 일관성: onChange patch 시그니처 T3 `update`와 동일 형태로 통일.
