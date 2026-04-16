# Step 6: orchestrator

## 읽어야 할 파일

- `/docs/plan_harness/ARCHITECTURE.md` (특히 "데이터 흐름" 실행 단계, "상태 전이", "2단계 커밋 전략")
- `/docs/plan_harness/PRD.md` (핵심 기능 #5)
- `/docs/plan_harness/ADR.md` (ADR-005)
- `/tools/harness/src/state/schema.ts`
- `/tools/harness/src/state/io.ts`
- `/tools/harness/src/git/commands.ts`
- `/tools/harness/src/claude/preamble.ts`
- `/tools/harness/src/claude/invoker.ts`
- `/tools/harness/src/verify/ac.ts`

지금까지 만든 모듈을 조립해 step을 순차 실행하는 루프를 만든다. Trust but Verify(AC 재실행)가 이 단계에서 처음 통합된다.

## 작업

### 1. `tools/harness/src/orchestrator/blocker.ts`

```ts
import { PhaseIndex } from '../state/schema.js';

export type BlockReason =
  | { kind: 'none' }
  | { kind: 'error'; step: number; name: string; message: string }
  | { kind: 'blocked'; step: number; name: string; reason: string };

// 뒤에서부터 훑어 가장 최근 비-pending step을 찾는다. error/blocked면 차단.
export function checkBlockers(index: PhaseIndex): BlockReason;
```

### 2. `tools/harness/src/orchestrator/loop.ts`

```ts
export interface OrchestratorContext {
  repoRoot: string;
  planDirName: string;          // 예: 'plan_harness'
  phaseIndexPath: string;       // docs/plan_<name>/phases/index.json
  plansIndexPath: string;       // docs/plans-index.json
  stepFilePath: (stepNum: number) => string;   // docs/plan_<name>/phases/stepN.md
  stepOutputPath: (stepNum: number) => string; // docs/plan_<name>/phases/step{N}-output.json
  project: string;
  phaseName: string;
  maxRetries: number;           // 기본 3
  claudeInvoke: typeof import('../claude/invoker.js').invokeClaude;
  verifyAc: typeof import('../verify/ac.js').runACCommands;
  parseAc: typeof import('../verify/ac.js').parseACFromStep;
  nowIso: () => string;         // 시간 의존성 주입용(테스트 용이성)
}

export interface StepRunOutcome {
  kind: 'completed' | 'error' | 'blocked';
  stepNum: number;
  stepName: string;
  message?: string;
}

// 핵심 루프
export function executeAllSteps(ctx: OrchestratorContext): void;
// 단일 step 실행 (최대 maxRetries 회)
export function executeSingleStep(ctx: OrchestratorContext, stepNum: number): StepRunOutcome;
```

**executeSingleStep 흐름 (구현 지시)**:

1. `updateStep(phaseIndexPath, stepNum, { started_at: nowIso() })` — 이미 있으면 덮어쓰지 않음(기존 값 유지하도록 io에서 분기 필요).
2. for attempt in 1..maxRetries:
   a. `loadGuardrails()` + `buildStepContext()` + `buildPreamble({prevError})`
   b. `prompt = preamble + stepN.md 파일 내용`
   c. `result = claudeInvoke({ prompt, outputPath: stepOutputPath(stepNum), timeoutMs: 1_800_000 })`
   d. 세션 후 `phaseIndex` 다시 읽어 해당 step의 status 확인.
   e. status === 'completed':
      - `cmds = parseAc(stepFilePath(stepNum))`
      - `verify = verifyAc(cmds, repoRoot)`
      - `verify.ok === true`:
        - `updateStep(..., { completed_at: nowIso() })`
        - `twoStageCommit({ featMessage, choreMessage, excludeFromFeat: [phaseIndexRelPath, stepOutputRelPath] })`
        - return `{ kind: 'completed', ... }`
      - `verify.ok === false`:
        - status를 'error'로 강등: `updateStep(..., { status: 'error', error_message: "AC 재실행 실패: " + failedCommand + " (exit " + failedExitCode + ")" })`
        - (이후 아래 error 분기로 낙하)
   f. status === 'blocked':
      - `updateStep(..., { blocked_at: nowIso() })`
      - `upsertPlanStatus(plansIndexPath, planDirName, 'blocked', nowIso())`
      - return `{ kind: 'blocked', message: blocked_reason }`
   g. status === 'error' 또는 위 e에서 강등:
      - attempt < maxRetries:
        - `prevError = step.error_message` (다음 루프에서 주입)
        - `updateStep(..., { status: 'pending', error_message: null })` — error_message 필드를 비운다(io.update가 null 전달 시 삭제하도록 구현).
        - continue
      - attempt === maxRetries:
        - `updateStep(..., { status: 'error', error_message: '[3회 시도 후 실패] ' + prevError, failed_at: nowIso() })`
        - 이 단계에서도 chore 커밋은 남겨야 함(다음 재실행 시 이력 추적). twoStageCommit을 호출하되 featMessage는 failure 표시로.
        - `upsertPlanStatus(plansIndexPath, planDirName, 'error', nowIso())`
        - return `{ kind: 'error', message: error_message }`
   h. 그 외 status(여전히 pending — Claude가 아무 보고도 안 함):
      - error_message = 'Step did not report status' 로 간주하고 위 g와 동일 처리.

3. 반환 없이 함수 끝까지 오면 unreachable.

**executeAllSteps 흐름**:

1. `checkBlockers(readPhaseIndex(...))` → 'error' or 'blocked' 이면 즉시 exit(1 or 2).
2. while pending step이 있으면:
   - 첫 pending step의 번호로 `executeSingleStep`.
   - outcome이 'error'이면 `process.exit(1)`.
   - outcome이 'blocked'이면 `process.exit(2)`.
3. 모든 step 완료 시:
   - `updateStep`이 아닌 `readPhaseIndex` → `completed_at = nowIso()` → `writePhaseIndex`.
   - `upsertPlanStatus(plansIndexPath, planDirName, 'completed', nowIso())`.
   - 최종 커밋: `phases/index.json`과 `plans-index.json` 변경에 대해 `chore(<plan>): mark phase completed` 단일 커밋 생성.

### 3. `tools/harness/tests/orchestrator/loop.test.ts`

OrchestratorContext의 `claudeInvoke` / `verifyAc` / `parseAc` / `nowIso`를 **전부 주입형**이라는 특성을 활용해 모킹.

시나리오 (각각 독립 테스트):
- 모든 step이 1회 시도로 completed → 각 step별 started_at/completed_at 기록 + 2단계 커밋 발생.
- step 1이 첫 시도에 error 보고 → 2번째 시도에 completed → prevError가 두 번째 preamble에 주입되는지 확인(claudeInvoke 호출 인자 검증).
- step 1이 3회 모두 실패 → 최종 error 상태 + upsertPlanStatus 호출 + exit 1 (테스트에서는 예외로 승격해 검증).
- step 1이 blocked → 즉시 중단 + upsertPlanStatus('blocked') + exit 2.
- Claude가 completed 보고했지만 AC 재실행 실패 → error로 강등 → 재시도 발생.
- 이미 error 상태로 시작 → checkBlockers가 즉시 중단.

공용 git 호출도 spy/mock 주입이 필요하면 OrchestratorContext에 `twoStageCommit`, `checkoutBranch` 필드 추가해서 주입형으로 구성. (주입형 설계는 테스트 용이성의 핵심.)

### 4. `tools/harness/src/execute.ts` (임시 엔트리)

지금까지는 `export {};`만 있던 파일을 이 step에서 확장한다. 단, 이 step에서는 **CLI 인자 파싱을 완성하지 않는다**(step 7이 담당). 대신:

```ts
// step 6의 책임: OrchestratorContext를 실제 파일 경로로 채워 executeAllSteps를 호출하는 함수 export.
export function runHarness(planDirName: string): void;
```

`runHarness`는 OrchestratorContext를 조립해서 `executeAllSteps(ctx)`를 호출한다. top-level 실행 코드(process.argv 파싱)는 넣지 않는다.

## Acceptance Criteria

```bash
npm run build -w @limjaejoon/harness
npm run test -w @limjaejoon/harness
npm run lint -w @limjaejoon/harness
```

## 검증 절차

1. AC 실행.
2. 시나리오 6개가 전부 유닛 테스트로 커버됨을 확인.
3. `runHarness`가 export 되어 있지만 execute.ts가 자동 실행되지 않음을 확인(`tsx tools/harness/src/execute.ts` 호출 시 no-op).
4. `phases/index.json` step 6 업데이트.

## 금지사항

- **실제 `claude` 바이너리를 테스트에서 호출하지 마라**. 반드시 mock을 주입.
- **실제 repo의 phases/index.json을 테스트에서 수정하지 마라**. 모든 경로는 tmpdir.
- **`process.exit()`를 orchestrator loop 내부에서 직접 호출하지 마라**. 대신 outcome을 반환하고 `execute.ts`의 최상단(`runHarness` 또는 이후 step 7의 main)이 exit를 책임진다. 이유: 테스트에서 exit 핸들링 번거로움.
- **CLI 인자 파싱, `--push` 플래그 처리 여기서 금지**. step 7로 미뤄라.
- **재시도 간 지연(sleep) 추가 금지**. 이유: YAGNI, 테스트 느려짐.
- **기존 테스트를 깨뜨리지 마라**.
