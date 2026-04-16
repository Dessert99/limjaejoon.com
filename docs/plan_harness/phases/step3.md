# Step 3: preamble-builder

## 읽어야 할 파일

- `/docs/plan_harness/ARCHITECTURE.md` ("claude/preamble.ts" 섹션, "런타임 레이어" 섹션)
- `/docs/plan_harness/ADR.md` (특히 ADR-005)
- `/docs/plan_harness/PRD.md` (가드레일 주입 규칙)
- `/tools/harness/src/state/schema.ts`

Claude 세션에 주입할 preamble(가드레일 + 이전 summary + 작업 규칙)을 조립한다.

## 작업

### 1. `tools/harness/src/claude/preamble.ts` 생성

다음을 export한다:

```ts
import { PhaseIndex } from '../state/schema.js';

// CLAUDE.md + docs/plan_<name>/*.md 를 합쳐 하나의 문자열로.
// phases/ 하위는 제외. 존재하지 않는 경로는 건너뛰되, CLAUDE.md는 없어도 예외를 던지지 않고 빈 문자열로 처리.
export function loadGuardrails(opts: {
  repoRoot: string;
  planDir: string; // 'plan_harness' 같은 디렉터리 이름 (docs/plan_<name>)
}): string;

// 완료된 step들의 summary를 목록으로 반환.
export function buildStepContext(phaseIndex: PhaseIndex): string;

export interface BuildPreambleInput {
  project: string;
  phaseName: string;
  phaseDirName: string; // phases/<...>/ 위치 해석에 사용
  guardrails: string;
  stepContext: string;
  prevError?: string;
  maxRetries: number;
}

export function buildPreamble(input: BuildPreambleInput): string;
```

`buildPreamble` 규칙:
- 첫 줄: `당신은 <project> 프로젝트의 개발자입니다. 아래 step을 수행하세요.`
- 이후 `guardrails` 포함.
- 이후 `stepContext` 포함 (비어 있으면 생략).
- `prevError`가 있으면 "⚠ 이전 시도 실패" 섹션으로 삽입.
- 마지막 "## 작업 규칙" 섹션: 예시 프로젝트의 6개 규칙을 이 프로젝트에 맞게 재작성:
  1. 이전 step에서 작성된 코드와 일관성 유지.
  2. 이 step에 명시된 작업만 수행. 추가 기능 금지.
  3. 기존 테스트를 깨뜨리지 마라.
  4. AC 커맨드를 직접 실행해 검증하라.
  5. `docs/plan_<name>/phases/index.json`의 해당 step status를 업데이트. (completed + summary / error + error_message / blocked + blocked_reason)
  6. 커밋 형식은 하네스가 자동 처리하므로 직접 커밋하지 마라 (이 부분은 예시와 다름 — 설명 넣을 것).

### 2. `tools/harness/tests/claude/preamble.test.ts` 생성

실물 파일 시스템 기반(`tmpdir` + CLAUDE.md/docs/plan_<name>/*.md 배치).

커버 케이스:
- `loadGuardrails`가 CLAUDE.md 내용과 plan 디렉터리의 모든 .md를 "---" 구분자로 합친다.
- `loadGuardrails`가 `phases/` 하위 파일은 포함하지 않는다.
- `loadGuardrails`가 CLAUDE.md 없으면 빈 문자열 + plan docs만 반환 (예외 없음).
- `buildStepContext`가 completed + summary 있는 step만 열거하고, status=pending은 제외.
- `buildStepContext`가 대상 0개면 빈 문자열 반환.
- `buildPreamble`이 prevError 없으면 retry 섹션을 포함하지 않는다.
- `buildPreamble`이 prevError 있으면 "이전 시도 실패" 문자열과 에러 본문을 포함한다.
- `buildPreamble`이 모든 6개 작업 규칙 문장을 포함한다(문자열 매칭).

## Acceptance Criteria

```bash
npm run build -w @limjaejoon/harness
npm run test -w @limjaejoon/harness
npm run lint -w @limjaejoon/harness
```

## 검증 절차

1. AC 실행.
2. preamble 샘플을 테스트에서 출력해 육안 확인(스냅샷 필요 없음 — console.log 1회로 충분).
3. `phases/index.json` step 3 업데이트.

## 금지사항

- **실제 repo의 CLAUDE.md를 테스트에서 읽지 마라**. 이유: 내용이 바뀌면 테스트가 깨진다. tmpdir로 격리.
- **`loadGuardrails`에서 `node_modules`나 `.git`을 스캔하지 마라**. 이유: 가드레일은 문서만.
- **프롬프트 안에 실제 커밋 커맨드 예시를 박지 마라**. 이유: 커밋은 하네스가 담당하며, Claude가 직접 커밋하면 2단계 커밋 원자성이 깨진다.
- **state/, git/, verify/, orchestrator/ 건드리지 마라**.
- **기존 테스트를 깨뜨리지 마라**.
