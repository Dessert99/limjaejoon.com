# Step 5: ac-verifier

## 읽어야 할 파일

- `/docs/plan_harness/ARCHITECTURE.md` ("verify/ac.ts" 섹션, "3중 게이팅" 레이어 3)
- `/docs/plan_harness/ADR.md` (ADR-005 Trust but Verify)
- `/docs/plan_harness/phases/step0.md` ~ `step4.md` 중 아무거나 하나 (AC 섹션 포맷 확인)

stepN.md의 `## Acceptance Criteria` 섹션에 명시된 bash 커맨드를 파싱하고 직접 재실행한다. 이게 Trust but Verify 레이어의 핵심.

## 작업

### 1. `tools/harness/src/verify/ac.ts` 생성

```ts
export interface ACVerifyResult {
  ok: boolean;
  executed: string[];            // 실행에 들어간 모든 커맨드
  failedCommand?: string;
  failedExitCode?: number;
  failedStdout?: string;
  failedStderr?: string;
}

// stepN.md에서 ## Acceptance Criteria 섹션을 찾아 그 바로 아래 ```bash 펜스 안의 줄을 커맨드로 추출.
// 주석(# ...)과 빈 줄은 무시. `&&`/`||`로 연결된 한 줄은 그대로 한 단위로 취급(셸 경유).
export function parseACFromStep(stepMarkdownPath: string): string[];

export function runACCommands(cmds: string[], cwd: string): ACVerifyResult;
```

구현 규칙:
- 파싱은 정규식 + 상태 머신 정도로 충분. md 파서 의존성 금지.
- "## Acceptance Criteria" 섹션이 없으면 빈 배열 반환(호출자가 에러로 판단).
- `runACCommands`는 각 커맨드를 `child_process.spawnSync('bash', ['-lc', cmd], { cwd, encoding: 'utf8', maxBuffer: 10_000_000 })`로 실행.
  - `bash -lc`를 쓰는 이유: `&&`, 파이프, 셸 변수 등을 허용. `claude -p`가 실행하는 것과 동일한 동적성 제공.
- 하나라도 exit≠0이면 즉시 중단하고 `failedCommand` 채워 반환.

### 2. `tools/harness/tests/verify/ac.test.ts` 생성

커버 케이스 (실제 tmpdir에 step 마크다운을 쓰고 파싱):

**parseACFromStep**
- 정상 파싱: `## Acceptance Criteria`\n\n` ```bash `\n`echo a`\n`echo b`\n` ``` ` → ['echo a', 'echo b']
- 여러 펜스가 있어도 "## Acceptance Criteria" 바로 아래 첫 bash 펜스만 취함.
- 주석 라인(`# foo`)과 빈 줄 무시.
- 섹션 없으면 빈 배열.

**runACCommands** (tmpdir을 cwd로)
- 단일 성공 커맨드: `['true']` → ok=true, executed=['true'].
- 실패 커맨드 포함: `['true', 'false']` → ok=false, failedCommand='false', failedExitCode=1.
- 실패 이후 커맨드는 실행 안 됨: `['true', 'false', 'true']`에서 executed.length===2.
- 파이프 커맨드: `['echo hello | cat']` → ok=true (셸 경유 확인).
- 실패 시 stderr 수집 확인.

## Acceptance Criteria

```bash
npm run build -w @limjaejoon/harness
npm run test -w @limjaejoon/harness
npm run lint -w @limjaejoon/harness
```

## 검증 절차

1. AC 실행.
2. 실제 step0.md(이 repo의)를 인자로 `parseACFromStep`를 돌려 `['npm install', 'npm run build -w @limjaejoon/harness', ...]` 4개 커맨드가 추출되는지 통합 테스트로 확인(optional).
3. `phases/index.json` step 5 업데이트.

## 금지사항

- **md 파서 라이브러리(`remark`, `marked` 등) 도입 금지**. 이유: 우리가 추출할 건 특정 섹션 아래 특정 펜스뿐이며 정규식으로 충분. 의존성·코드 표면 증가.
- **AC 커맨드의 결과를 해석하려 들지 마라**(예: "이 출력이면 통과"). exit code만 본다. 이유: AC 명세가 본질이지, 출력 파싱까지 가면 hard-coded assumption이 늘어남.
- **`shell: true`로 호출하지 마라**. 이유: 명시적으로 `bash -lc`로 실행해서 환경을 통제한다.
- **타임아웃 무제한 허용 금지**. 기본 타임아웃을 300_000ms(5분) 정도로 잡되, 옵션 없이 상수로 둬라(YAGNI). 5분이면 대부분의 AC 커맨드가 충분히 끝남.
- **orchestrator 흐름을 여기서 호출하지 마라**. verify는 independent 모듈.
- **기존 테스트를 깨뜨리지 마라**.
