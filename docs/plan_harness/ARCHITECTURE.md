# 아키텍처: plan_harness

## 디렉터리 구조

변경 후 주요 트리:

```
tools/
  harness/                              # 신규 npm workspace
    package.json                        # name: @limjaejoon/harness
    tsconfig.json
    src/
      execute.ts                        # 진입점 (CLI)
      state/
        schema.ts                       # phases/index.json, plans-index.json 타입
        io.ts                           # readJson/writeJson/validate
      git/
        commands.ts                     # runGit, checkoutBranch, commit 2단계
      claude/
        preamble.ts                     # loadGuardrails, buildStepContext, buildPreamble
        invoker.ts                      # invokeClaude (claude -p spawn)
      verify/
        ac.ts                           # parseACFromStep, runACCommands
      orchestrator/
        loop.ts                         # executeAllSteps, executeSingleStep (재시도)
        blocker.ts                      # checkBlockers (error/blocked 선감지)
    tests/                              # Vitest 유닛 (미러 구조)
      state/schema.test.ts
      state/io.test.ts
      git/commands.test.ts
      claude/preamble.test.ts
      claude/invoker.test.ts
      verify/ac.test.ts
      orchestrator/loop.test.ts
docs/
  _template/
    PRD.md                              # 기존
    ADR.md                              # 기존
    (progress.txt, feature_list.json 삭제)
  plan_<name>/                          # 신규 플랜마다 디렉터리 1개
    PRD.md
    ARCHITECTURE.md                     # 선택 (런타임 복잡 시)
    ADR.md
    phases/
      index.json                        # step 리스트 + 상태
      step0.md
      step1.md
      ...
      step{N}-output.json               # execute.ts가 실행 후 생성
  plans-index.json                      # 전역 플랜 현황
.claude/
  commands/
    harness.md                          # 신규 — /harness 슬래시 커맨드
  hooks/                                # 기존 3종 그대로 유지
  settings.json                         # 변경 없음
CLAUDE.md                               # 1줄 안내 추가
package.json                            # "harness" 스크립트 + workspaces에 tools/harness 등록
```

## 런타임 레이어 — 3중 게이팅

실행 중 작업 품질을 지키는 방어선이 **3개 층**으로 나뉜다. 각 층은 독립적으로 작동하고, 상위 층이 아래 층을 알 필요 없음.

```
┌─────────────────────────────────────────────────────┐
│  레이어 3: 하네스 AC 재실행 (Trust but Verify)      │  ← 신규
│  - step 종료 후 execute.ts가 AC 커맨드 직접 실행    │
│  - Claude 자기 보고(status=completed)를 검증        │
│  - 불일치 시 error 처리 → 재시도                    │
└─────────────────────────────────────────────────────┘
         ↑
┌─────────────────────────────────────────────────────┐
│  레이어 2: Claude 세션 자기 보고                    │
│  - stepN.md 지시에 따라 Claude가 AC 실행            │
│  - phases/index.json의 status 필드 갱신             │
│  - summary 필드에 산출물 한 줄 요약 기록            │
└─────────────────────────────────────────────────────┘
         ↑
┌─────────────────────────────────────────────────────┐
│  레이어 1: .claude/hooks/ (기존)                    │
│  - Edit/Write 호출 직전 기계적 게이팅               │
│  - enforce-tdd.sh, block-protected-files.sh 등      │
│  - `claude -p` 헤드리스 호출에서도 그대로 작동      │
└─────────────────────────────────────────────────────┘
```

## 모듈 구조

### state/
- **schema.ts**: `PhaseIndex`, `StepEntry`, `PlansIndex`, `PlanEntry` 타입. status: `'pending' | 'completed' | 'error' | 'blocked'`. 타임스탬프는 전부 선택 필드.
- **io.ts**: `readJson<T>(path): T`, `writeJson(path, data)`, `updateStep(phaseIndexPath, stepNum, patch)`. 쓰기는 JSON.stringify 2-space indent.

### git/
- **commands.ts**: `runGit(args): {code,stdout,stderr}`, `checkoutBranch(name)`, `commitStaged(msg, excludePaths?)`. 커밋은 2단계 — 먼저 코드 파일 커밋(메타 제외), 다음 메타 커밋.

### claude/
- **preamble.ts**:
  - `loadGuardrails(planDir)`: CLAUDE.md + `docs/plan_<name>/*.md` 읽어 합성. `phases/` 하위는 제외.
  - `buildStepContext(phaseIndex)`: completed step의 summary 목록 생성.
  - `buildPreamble({project, phaseName, guardrails, stepContext, prevError?, commitTemplate})`: 최종 프롬프트 헤더.
- **invoker.ts**: `invokeClaude({cwd, prompt, timeoutMs}): ClaudeResult`. `claude -p --dangerously-skip-permissions --output-format json`로 spawn. 결과를 `step{N}-output.json`에 저장.

### verify/
- **ac.ts**:
  - `parseACFromStep(stepMarkdownPath): string[]`: `## Acceptance Criteria` 섹션의 ` ```bash ` 블록에서 커맨드 추출.
  - `runACCommands(cmds, cwd): {ok, failed?}`: 순차 실행. 하나라도 실패면 ok=false.

### orchestrator/
- **blocker.ts**: `checkBlockers(phaseIndex)`: steps를 뒤에서 훑어 가장 최근 비-pending를 찾아 error/blocked면 즉시 중단.
- **loop.ts**:
  - `executeAllSteps(ctx)`: pending 있을 때까지 루프. started_at 기록 → executeSingleStep.
  - `executeSingleStep(ctx, step)`: 최대 `MAX_RETRIES=3`회 재시도. 각 시도마다 preamble 재조립(이전 에러 주입) → invokeClaude → 세션 후 status 확인 → (completed면) AC 재실행 verify → 2단계 커밋.

### execute.ts
CLI 진입점. 인자 `<plan-dir-name>`, 옵션 `--push`. 위 모듈을 조립해서 `new Orchestrator(planDirName, {push}).run()` 형태로 실행.

## 데이터 흐름

### 설계 단계 (대화식, 수동)
```
사용자가 /harness 슬래시 커맨드 호출
  → 탐색: Explore 에이전트로 기존 코드/문서 파악
  → 논의: PRD 초안 + 기술 결정 사항 합의
  → step 설계: 초안 작성 후 사용자 피드백 반복
  → 승인 후 파일 생성:
    docs/plan_<name>/PRD.md, ADR.md, (ARCHITECTURE.md)
    docs/plan_<name>/phases/index.json
    docs/plan_<name>/phases/step0.md ~ stepN.md
    docs/plans-index.json 갱신 (신규 plan 항목 추가)
```

### 실행 단계 (헤드리스, 자율)
```
npm run harness <plan-name>
  → execute.ts 시작
  → checkBlockers: 가장 최근 비-pending step이 error/blocked면 중단
  → checkoutBranch("feat-<plan-name>") (없으면 생성)
  → loadGuardrails(planDir)  [CLAUDE.md + docs/plan_<name>/*.md]
  → executeAllSteps:
      loop:
        pending step S 찾기
        started_at = now
        executeSingleStep(S):
          for attempt in 1..3:
            prompt = preamble + stepN.md (retry면 prevError 포함)
            invokeClaude(prompt)  ←←← 이 안에서 훅이 자동 작동
              .claude/hooks/enforce-tdd.sh 등이 Edit/Write 단계에서 게이팅
              Claude가 테스트 먼저 쓰고 구현 진행
              Claude가 AC 직접 실행 후 phases/index.json 갱신
            세션 후 status 확인
            if completed:
              AC 커맨드 재실행 (Trust but Verify)
              if verify ok: 2단계 커밋 → break
              else: status=error로 강등 → 재시도 분기로 떨어짐
            if blocked: top-index 갱신, exit(2)
            if error:
              attempt < 3 → status=pending 복구, prevError 캐시, 재시도
              attempt == 3 → error 확정, failed_at 기록, exit(1)
      phases/index.json에 plan 레벨 completed_at 기록
      plans-index.json의 이 plan 항목 status=completed
      --push면 git push -u origin feat-<plan-name>
```

### 상태 전이

```
pending ──Claude 세션──┬─→ completed ──verify OK──→ (commit + 다음 step)
                      │                                    ↑
                      │                  verify FAIL       │
                      ├─→ error  ─────attempt<3───→ pending (루프)
                      │                                    ↓
                      │                  attempt==3  → exit(1)
                      └─→ blocked ─────────────────→ exit(2) [사용자 개입]
```

사용자 복구:
- error: 원인 수정 → `phases/index.json`의 해당 step `status=pending`, `error_message` 삭제 → 재실행
- blocked: `blocked_reason` 해결 → 동일 절차

## 2단계 커밋 전략

각 step 종료 시 2개 커밋:

```
feat(<plan-name>): step N — <step-name>
  <코드/설정 파일 변경분만>
  (phases/index.json, step{N}-output.json 제외)

chore(<plan-name>): step N output
  phases/index.json
  phases/step{N}-output.json
```

이유: 코드 히스토리에서 메타데이터 노이즈 분리. 리뷰/리버트 시 step 단위 원자성 유지.

## 훅과의 상호작용 경계

- 하네스는 `.claude/hooks/`의 존재를 **알지 못함**. 하네스 코드 어디에도 훅 경로 참조 없음.
- Claude Code가 `claude -p` 호출 시 `.claude/settings.json`을 로드하므로 훅은 자동으로 적용됨.
- 훅 exit 2 발생 시 stderr 메시지가 Claude 세션의 도구 결과로 돌아감 → Claude가 그 메시지를 보고 적응(테스트 먼저 작성 등).
- 하네스는 Claude 세션의 최종 stdout/stderr/exitCode만 관찰.

이 분리로 훅 추가/수정이 하네스 코드에 영향을 주지 않음. 반대로 하네스가 죽어도 대화식 세션의 훅은 계속 작동.

## 상태 파일 스키마

### `docs/plan_<name>/phases/index.json`
```json
{
  "project": "limjaejoon.com",
  "phase": "plan_harness",
  "created_at": "2026-04-16T22:00:00+0900",
  "completed_at": "2026-04-17T01:30:00+0900",
  "steps": [
    {
      "step": 0,
      "name": "workspace-setup",
      "status": "completed",
      "summary": "tools/harness 워크스페이스 초기화, tsx/vitest 설치",
      "started_at": "2026-04-16T22:00:00+0900",
      "completed_at": "2026-04-16T22:15:00+0900"
    },
    {
      "step": 1,
      "name": "state-schema",
      "status": "pending"
    }
  ]
}
```

### `docs/plans-index.json`
```json
{
  "plans": [
    {
      "dir": "plan_tdd",
      "status": "completed",
      "completed_at": "2026-04-16T22:30:00+0900"
    },
    {
      "dir": "plan_harness",
      "status": "pending"
    }
  ]
}
```

필드 규칙:
- `status`: `pending | completed | error | blocked`
- 타임스탬프는 상태 전이 시점에만 추가 (생성 시 넣지 않음)
- `summary`: Claude 세션이 채움. 다음 step preamble에 컨텍스트로 누적
- `error_message` / `blocked_reason`: 해당 상태 진입 시에만 존재
