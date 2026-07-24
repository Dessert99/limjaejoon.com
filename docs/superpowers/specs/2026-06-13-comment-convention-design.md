# 주석 컨벤션 설계

프로젝트의 모든 파일과 로직에 "한눈에 보고 이해하기 쉬운" 주석을 일관된 포맷으로 추가하기 위한 컨벤션. 과거 CLAUDE.md에 있던 "한 줄 이내 주석" 규칙이 모노레포 → Next 평탄화 리팩터에서 사라졌고, 현재 `src/` 코드에는 주석이 거의 없다. 이 설계는 그 규칙을 정식 컨벤션 문서로 복원·정립한다.

## 1. 목표와 비목표

**목표**
- 모든 파일·export·비자명 로직에 의도를 드러내는 주석을 일관된 포맷으로 둔다.
- 초보자가 코드를 열었을 때 "이 파일/함수가 왜 있고 무엇을 노리는지"를 한눈에 잡게 한다.
- 코드 가독성을 해치지 않는다(노이즈 최소화).

**비목표**
- 모든 코드 줄에 주석을 다는 것(라인별 받아쓰기)은 하지 않는다.
- `@param`/`@returns` 같은 JSDoc 태그로 인자를 풀어쓰는 것은 하지 않는다.
- 린트로 주석 품질을 강제하지 않는다(이번 범위 밖).

## 2. 핵심 원칙

- **한 줄 WHY.** 모든 주석은 한 줄. 멀티라인 설명 블록·불릿 풀이 금지. 코드가 *무엇을(WHAT)* 하는지 받아쓰지 말고 *왜(WHY)·의도·함정*을 적는다.
- **길이가 아니라 밀도.** 한 줄에 안 들어가면 주석 문제가 아니라 코드 분리·네이밍 신호다 → 함수 추출/식별자 명확화로 푼다.
- **초보 개념은 농축해서.** 기초 개념(예: `fail-fast`, `barrel`, `cookie store`)도 풀어쓰지 말고 한 줄 안에 단어로 녹인다.

## 3. 포맷

- **파일 헤더·모든 export = 단일 라인 JSDoc** `/** ... */`
  - 한 줄짜리 `/** ... */`를 대상 바로 윗줄에 둔다. IDE 호버 툴팁을 얻으면서 한 줄 원칙을 유지한다.
  - `@param`/`@returns`/`@throws` 등 태그는 쓰지 않는다(상시 멀티라인이 되어 원칙과 충돌).
- **함수 본문 안 인라인 = `//`**
  - 본문 안 구문에는 JSDoc을 붙일 수 없으므로 `//` 라인 주석을 대상 바로 윗줄에 둔다.
  - 한 줄로 끝나는 단일 값에는 트레일링 `// ...` 허용.
- **언어**: 주석 본문은 한국어, 식별자는 영어 유지.
- **금지**: 코드 받아쓰기(`// value를 가져온다`), 주석 처리된 죽은 코드, author/changelog 잡설.

## 4. 커버리지 (어디에 다는가)

- **파일 헤더 1줄 (필수)**: 모든 FSD 파일 맨 위에 역할을 1줄 `/** */`로 명시.
  - *예외*: 단순 re-export만 하는 `index.ts`(barrel)는 헤더 생략.
- **모든 export 1줄 (필수)**: export 함수·타입·상수 바로 윗줄에 목적 1줄 `/** */`.
- **비자명 인라인만**: 의도가 한눈에 안 보이는 로직(조건 분기·부수효과·트릭)에만 `//` WHY 1줄. **자명한 줄에는 주석을 달지 않는다.**

## 5. 예외 (한 줄 초과 허용)

- 보안 위험·법적 구속·외부 시스템 회피처럼 길게 풀어쓸 정당한 이유가 있을 때만 멀티라인 허용.
- 테스트 파일: `describe`/`it` 텍스트가 의도를 담으므로, 비자명한 setup에만 인라인 주석을 단다.

## 6. 예시 (실제 `src/shared/config/env.ts`)

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

나쁜 예: `// value를 가져온다`(WHAT 받아쓰기), 4줄 `@param` 블록.

## 7. 거주지 / 강제

- 신규 컨벤션 문서 `docs/conventions/comment-convention.md`를 작성한다(이 설계의 2~6절을 규칙 형태로).
- `CLAUDE.md`에 1줄 규칙 + 문서 링크를 추가해 에이전트가 따르도록 한다(기존 `folder-structure.md`/`tdd-convention.md` 참조와 동일 패턴).
- 린트 강제는 하지 않는다.

## 8. 적용 범위(이번 작업)

- 컨벤션 문서 + CLAUDE.md 갱신이 1차 산출물이다.
- 기존 `src/` 코드에 주석을 일괄 소급 적용할지는 별도 결정(이 설계의 직접 범위 밖). 우선 규칙을 세우고, 이후 변경되는 파일부터 점진 적용하는 것을 기본값으로 본다.
