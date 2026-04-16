# Step 4: claude-invoker

## 읽어야 할 파일

- `/docs/plan_harness/ARCHITECTURE.md` ("claude/invoker.ts", "런타임 레이어" 섹션)
- `/docs/plan_harness/PRD.md` (핵심 기능 #6)
- `/tools/harness/src/claude/preamble.ts`
- `/tools/harness/src/state/io.ts`

Claude CLI를 헤드리스로 호출하고 결과를 저장한다. `.claude/hooks/`는 이 호출 경로에서 자동 작동하므로 하네스는 훅을 모른 채로 결과만 관찰한다.

## 작업

### 1. `tools/harness/src/claude/invoker.ts` 생성

```ts
export interface ClaudeResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export interface InvokeOptions {
  prompt: string;
  cwd: string;
  timeoutMs: number; // 기본 30분(1_800_000) — 호출자에게 노출.
  outputPath: string; // step{N}-output.json 저장 경로.
  // 외부에서 주입 가능한 커맨드/args (테스트에서 mock binary로 교체).
  claudeBin?: string; // 기본 "claude"
  claudeArgs?: string[]; // 기본 ["-p", "--dangerously-skip-permissions", "--output-format", "json"]
}

export function invokeClaude(opts: InvokeOptions): ClaudeResult;
```

구현 규칙:
- `child_process.spawnSync(claudeBin, [...claudeArgs, prompt], { cwd, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 10_000_000 })` 사용.
- 결과를 `{ step, name?, exitCode, stdout, stderr, durationMs }` JSON 구조로 `outputPath`에 기록.
  - `step`, `name`은 호출자가 결정하므로 `invokeClaude`는 **받은 그대로** 기록하되, 이 step에서는 **메타 필드를 받지 않고** 최소 필드(`exitCode/stdout/stderr/durationMs`)만 저장한다. 호출자가 나중에 덮어쓰거나 `orchestrator`가 확장해 기록한다.
  - 즉 이 함수의 출력 파일 스키마는 `{ exitCode, stdout, stderr, durationMs }`로 한정.
- exit code가 non-zero여도 예외를 던지지 않는다. 반환값으로만 보고.
- stdout/stderr는 10MB 초과 시 truncate되므로 maxBuffer 설정 필수.

### 2. `tools/harness/tests/claude/invoker.test.ts` 생성

**실제 `claude` 바이너리를 호출하지 않는다.** 대신 테스트용 mock 실행 파일을 만들어 `claudeBin`으로 주입.

접근 방식 추천: `tmpdir`에 bash 스크립트 `mock-claude.sh`를 만들고 `claudeBin: <path>`로 경로 지정. 스크립트는 환경변수 `MOCK_EXIT_CODE`, `MOCK_STDOUT` 등을 읽어 동작을 바꾼다.

```bash
#!/bin/bash
echo "${MOCK_STDOUT:-mock ok}"
echo "stderr content" >&2
exit "${MOCK_EXIT_CODE:-0}"
```

커버 케이스:
- 성공 경로: MOCK_EXIT_CODE=0 → result.exitCode=0, stdout에 MOCK_STDOUT 포함.
- 실패 경로: MOCK_EXIT_CODE=1 → result.exitCode=1, 예외 없음.
- stdout/stderr가 outputPath JSON 파일에 정확히 기록된다.
- durationMs가 0보다 크다(최소값 확인).
- timeout 경계: 매우 짧은 timeoutMs + sleep하는 mock → exitCode null 또는 signal로 종료.

### 3. 경로 처리

- `outputPath`의 부모 디렉터리가 없으면 생성(`fs.mkdirSync(dir, { recursive: true })`).
- `outputPath`가 기존 파일이면 덮어쓴다.

## Acceptance Criteria

```bash
npm run build -w @limjaejoon/harness
npm run test -w @limjaejoon/harness
npm run lint -w @limjaejoon/harness
```

## 검증 절차

1. AC 실행.
2. 테스트 로그에 mock binary 경로가 등장하고, 실제 `claude` 바이너리가 호출되지 않음을 확인.
3. `step{N}-output.json` 샘플 포맷이 ARCHITECTURE.md와 일치.
4. `phases/index.json` step 4 업데이트.

## 금지사항

- **테스트에서 실제 `claude` CLI를 호출하지 마라**. 이유: CI 환경/유저 인증/토큰 소비 문제. 반드시 mock.
- **stdout/stderr를 파이프 없이 콘솔로 흘려보내지 마라**. 이유: 하네스가 출력을 파일에 보관해 디버깅/재현 가능하게 해야 한다.
- **`child_process.exec` 사용 금지**. 이유: 셸 경유(argv 이스케이프 위험). `spawnSync` 유지.
- **retry 로직을 여기서 구현하지 마라**. 이유: retry는 orchestrator의 책임(step 6).
- **state/io 헬퍼를 재구현하지 마라**. JSON 직렬화는 `writeJson` 재사용.
- **기존 테스트를 깨뜨리지 마라**.
