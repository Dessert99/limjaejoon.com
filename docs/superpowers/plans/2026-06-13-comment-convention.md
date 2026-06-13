# 주석 컨벤션 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 프로젝트의 모든 파일·로직에 "한 줄 WHY" 주석을 일관 포맷으로 강제하는 컨벤션 문서를 만들고 CLAUDE.md에 연결한다.

**Architecture:** 신규 컨벤션 문서 `docs/conventions/comment-convention.md`에 규칙을 적고, 기존 `folder-structure.md`/`tdd-convention.md`와 동일한 패턴으로 `CLAUDE.md` "구조" 절에 1줄 참조를 추가한다. 코드 변경·린트 강제는 없다(범위 밖).

**Tech Stack:** Markdown. 검증은 `npm run format`(마크다운 포매터 훅)과 육안 검토.

**Note:** 문서 작업이므로 TDD RED-GREEN 루프를 적용하지 않는다(tdd-convention.md §3 "문서 수정" 예외). 각 태스크는 작성 → 포맷 → 검토 → 커밋 단위다.

> 설계 근거: [2026-06-13-comment-convention-design.md](../specs/2026-06-13-comment-convention-design.md)

---

### Task 1: 주석 컨벤션 문서 작성

**Files:**
- Create: `docs/conventions/comment-convention.md`

- [ ] **Step 1: 컨벤션 문서 작성**

아래 내용을 그대로 `docs/conventions/comment-convention.md`에 쓴다.

````markdown
# 주석 컨벤션

모든 파일과 로직에 의도를 드러내는 주석을 일관된 포맷으로 둔다. 목표는 "이 파일·함수가 왜 있고 무엇을 노리는지"를 한눈에 잡게 하는 것이지, 코드를 줄마다 받아쓰는 것이 아니다.

## 1. 핵심 원칙

- **한 줄 WHY.** 모든 주석은 한 줄. 멀티라인 설명 블록·불릿 풀이 금지. 코드가 *무엇을(WHAT)* 하는지 받아쓰지 말고 *왜·의도·함정(WHY)*을 적는다.
- **길이가 아니라 밀도.** 한 줄에 안 들어가면 주석 문제가 아니라 코드 분리·네이밍 신호다. 함수 추출이나 식별자 명확화로 푼다.
- **초보 개념은 농축해서.** 기초 개념(`fail-fast`, `barrel`, `cookie store` 등)도 풀어쓰지 말고 한 줄 안에 단어로 녹인다.

## 2. 포맷

- **파일 헤더·모든 export = 단일 라인 JSDoc** `/** ... */`
  - 한 줄짜리 `/** ... */`를 대상 바로 윗줄에 둔다. IDE 호버 툴팁을 얻으면서 한 줄 원칙을 유지한다.
  - `@param`/`@returns`/`@throws` 태그는 쓰지 않는다. 상시 멀티라인이 되어 한 줄 원칙과 충돌한다.
- **함수 본문 안 인라인 = `//`**
  - 본문 안 구문에는 JSDoc을 붙일 수 없으니 `//` 라인 주석을 대상 바로 윗줄에 둔다.
  - 한 줄로 끝나는 단일 값에는 트레일링 `// ...`를 허용한다.
- **언어**: 주석 본문은 한국어, 식별자는 영어로 둔다.

## 3. 커버리지

- **파일 헤더 1줄(필수)**: 모든 FSD 파일 맨 위에 역할을 1줄 `/** */`로 명시한다. 단순 re-export만 하는 `index.ts`(barrel)는 생략한다.
- **모든 export 1줄(필수)**: export 함수·타입·상수 바로 윗줄에 목적 1줄 `/** */`.
- **비자명 인라인만**: 의도가 한눈에 안 보이는 로직(조건 분기·부수효과·트릭)에만 `//` WHY 1줄. 자명한 줄에는 주석을 달지 않는다.

## 4. 예시

`src/shared/config/env.ts` 기준.

```ts
/** 환경변수 읽기·검증 — 없으면 앱이 못 도는 값을 시작 시 한 번에 확인(fail-fast) */
type EnvSource = Record<string, string | undefined>;

/** 필수 env 누락 시 즉시 throw — 조용히 undefined로 새지 않게 */
const requireEnv = (source: EnvSource, key: string): string => {
  const value = source[key];
  // 빈 문자열도 누락으로 취급
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

/** 서버 전용 키 포함 — 브라우저로 새 나가면 안 되는 값 */
export const readServerEnv = (source: EnvSource = process.env): ServerEnv => ({
  ...readPublicEnv(source),
  supabaseServiceRoleKey: requireEnv(source, 'SUPABASE_SERVICE_ROLE_KEY'),
});
```

## 5. 금지

- 코드 받아쓰기(`// value를 가져온다`처럼 WHAT 중계).
- 주석 처리된 죽은 코드.
- author·changelog·날짜 같은 잡설.
- `@param`/`@returns` 태그 블록(4줄짜리 인자 풀이).

## 6. 예외

- 보안 위험·법적 구속·외부 시스템 회피처럼 길게 풀어쓸 정당한 이유가 있을 때만 멀티라인을 허용한다.
- 테스트 파일: `describe`/`it` 텍스트가 의도를 담으므로 비자명한 setup에만 인라인 주석을 단다.

## 7. 적용

규칙을 세운 시점부터 새로 작성·변경되는 파일에 적용한다. 기존 코드 일괄 소급은 하지 않는다(변경되는 파일부터 점진 적용).
````

- [ ] **Step 2: 포맷 실행**

Run: `npm run format`
Expected: 성공(에러 없음). 마크다운 포매터 훅이 코드 펜스를 보존하는지 확인.

- [ ] **Step 3: 읽어보며 검토**

`docs/conventions/comment-convention.md`를 열어 코드 펜스(```ts)가 한 줄로 뭉개지지 않았는지, 1~7절이 다 있는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add docs/conventions/comment-convention.md
git commit -m "docs: 주석 컨벤션 문서 추가"
```

---

### Task 2: CLAUDE.md에 컨벤션 연결

**Files:**
- Modify: `CLAUDE.md` (the "## 구조" 절)

- [ ] **Step 1: 구조 절에 참조 1줄 추가**

`CLAUDE.md`에서 아래 기존 문장을 찾는다.

```markdown
코드 변경 작업은 기본적으로 [tdd-convention.md](docs/conventions/tdd-convention.md)의 RED -> GREEN -> REFACTOR 루프를 따른다.
```

바로 다음 줄에 아래 문단을 추가한다.

```markdown
모든 파일·로직에는 [comment-convention.md](docs/conventions/comment-convention.md)에 따라 주석을 남긴다. 파일 헤더와 모든 export는 단일 라인 JSDoc(`/** ... */`), 본문 안 비자명 로직은 한 줄 `//` 주석으로 WHY(의도·함정)를 적는다. 멀티라인 블록·`@param` 태그·코드 받아쓰기는 금지.
```

- [ ] **Step 2: 포맷 실행**

Run: `npm run format`
Expected: 성공(에러 없음).

- [ ] **Step 3: 링크 확인**

`CLAUDE.md`의 새 링크 경로 `docs/conventions/comment-convention.md`가 Task 1에서 만든 파일과 일치하는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md에 주석 컨벤션 참조 추가"
```

---

## Self-Review

- **Spec coverage:** 설계 2~7절(원칙·포맷·커버리지·예시·예외·거주지)이 Task 1 문서에 모두 들어감. 설계 7절의 "CLAUDE.md 참조"는 Task 2가 처리. 설계 8절 "린트 강제 안 함 / 소급 안 함"은 문서 7절·plan 범위로 반영됨.
- **Placeholder scan:** TBD/TODO 없음. 모든 단계에 실제 내용 포함.
- **Type consistency:** 파일 경로 `docs/conventions/comment-convention.md`가 Task 1 생성 경로와 Task 2 참조 경로에서 동일.
