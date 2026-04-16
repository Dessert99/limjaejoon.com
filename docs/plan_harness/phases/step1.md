# Step 1: state-schema

## 읽어야 할 파일

- `/docs/plan_harness/ARCHITECTURE.md` (특히 "상태 파일 스키마" 섹션)
- `/docs/plan_harness/ADR.md` (ADR-003)
- `/tools/harness/package.json`
- `/tools/harness/tsconfig.json`

phases/index.json과 plans-index.json의 타입을 TypeScript로 고정하고, 안전한 I/O 헬퍼를 제공한다. 이후 모든 step이 여기 모듈에 의존한다.

## 작업

### 1. `tools/harness/src/state/schema.ts` 생성

다음 타입을 export한다:

```ts
export type StepStatus = 'pending' | 'completed' | 'error' | 'blocked';

export interface StepEntry {
  step: number;
  name: string;
  status: StepStatus;
  summary?: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  failed_at?: string;
  blocked_reason?: string;
  blocked_at?: string;
}

export interface PhaseIndex {
  project: string;
  phase: string;
  created_at?: string;
  completed_at?: string;
  steps: StepEntry[];
}

export interface PlanEntry {
  dir: string;
  status: StepStatus;
  completed_at?: string;
  failed_at?: string;
  blocked_at?: string;
}

export interface PlansIndex {
  plans: PlanEntry[];
}
```

### 2. `tools/harness/src/state/io.ts` 생성

다음 함수를 export한다:

```ts
import { PhaseIndex, PlansIndex, StepEntry, StepStatus } from './schema.js';

export function readJson<T>(path: string): T;
export function writeJson(path: string, data: unknown): void;

export function readPhaseIndex(path: string): PhaseIndex;
export function writePhaseIndex(path: string, idx: PhaseIndex): void;

export function readPlansIndex(path: string): PlansIndex;
export function writePlansIndex(path: string, idx: PlansIndex): void;

// 특정 step을 patch. 타임스탬프/필드 누락 허용. status 전이 시 호출자에게 이상 데이터 검증을 요구하지 않는다.
export function updateStep(
  phaseIndexPath: string,
  stepNum: number,
  patch: Partial<StepEntry>,
): PhaseIndex;

// plans-index.json에서 해당 dir 항목을 patch. 없으면 추가.
export function upsertPlanStatus(
  plansIndexPath: string,
  dir: string,
  status: StepStatus,
  timestamp?: string,
): PlansIndex;
```

구현 규칙:
- `writeJson`은 `JSON.stringify(data, null, 2)` + 끝에 개행 1개.
- `readJson`은 파일이 없으면 예외를 던진다(묵살하지 않는다).
- `updateStep`은 step 번호가 없으면 예외.
- 라이브러리(zod 등) 도입 금지. 타입 가드는 불필요한 경우 생략.

### 3. `tools/harness/tests/state/schema.test.ts` 와 `tools/harness/tests/state/io.test.ts` 생성

각각 최소 다음 케이스:

schema.test.ts:
- 타입이 올바르게 import 된다 (컴파일만 확인하는 스모크 테스트 1개).

io.test.ts (`tmpdir` 사용, fs 실물 I/O):
- `writeJson` → `readJson` 왕복 시 원본 객체와 동치.
- `updateStep`이 존재하는 step의 status/summary를 바꾸고 다른 필드는 보존한다.
- `updateStep`이 존재하지 않는 step에 대해 예외를 던진다.
- `upsertPlanStatus`가 기존 항목의 status를 바꾼다.
- `upsertPlanStatus`가 없는 dir에 새 항목을 추가한다.
- `upsertPlanStatus`에 timestamp를 주면 `completed_at`/`failed_at`/`blocked_at` 중 status에 대응하는 키에 기록된다.

### 4. `tools/harness/vitest.config.ts` 생성

- `environment: 'node'`
- `include: ['tests/**/*.test.ts']`
- `globals: true`
- jsdom/브라우저 플러그인 추가 금지.

## Acceptance Criteria

```bash
npm run build -w @limjaejoon/harness
npm run test -w @limjaejoon/harness
npm run lint -w @limjaejoon/harness
```

## 검증 절차

1. AC 실행.
2. `tools/harness/src/state/` 아래에 `schema.ts`, `io.ts`만 존재.
3. `tools/harness/tests/state/` 아래 두 테스트 파일이 있고 전부 통과.
4. `phases/index.json` step 1 업데이트. summary에 생성된 파일과 export된 타입/함수 목록을 한 줄로 기록.

## 금지사항

- **zod/io-ts/valibot 같은 런타임 검증 라이브러리 도입 금지**. 이유: YAGNI, 의존성 증가. 타입은 컴파일 타임 보장으로 충분.
- **fs 모킹 금지**. 이유: fs는 기반 API이며 `node:os`의 `tmpdir`로 실물 테스트가 빠르고 정확하다.
- **`git/`, `claude/`, `verify/`, `orchestrator/` 디렉터리 건드리지 마라**. 이 step은 state/에만 국한된다.
- **기존 테스트를 깨뜨리지 마라**.
