# Step 9: smoke-test

## 읽어야 할 파일

- `/docs/plan_harness/PRD.md` (전체 흐름)
- `/docs/plan_harness/ARCHITECTURE.md` ("데이터 흐름" 실행 단계)
- `/tools/harness/src/execute.ts`
- `/.claude/commands/harness.md`
- `/docs/plans-index.json`

일회용 throwaway plan을 하나 만들고 하네스를 실제로 돌려서 전체 파이프라인이 작동하는지 검증한다. 이 step의 목적은 **end-to-end 확신**이다.

## 작업

### 1. throwaway 플랜 생성: `docs/plan_harness_smoke/`

파일 구조:

```
docs/plan_harness_smoke/
  PRD.md                       # 한 줄: "하네스 엔드투엔드 검증용 throwaway 플랜"
  ADR.md                       # 한 줄: "결정: 없음. 이 플랜은 파이프라인 검증용"
  phases/
    index.json                 # step 0, 1 총 2개
    step0.md                   # trivial: 파일 하나 생성
    step1.md                   # trivial: AC로 위 파일 내용을 grep
```

phases/index.json:

```json
{
  "project": "limjaejoon.com",
  "phase": "plan_harness_smoke",
  "steps": [
    { "step": 0, "name": "create-marker", "status": "pending" },
    { "step": 1, "name": "verify-marker", "status": "pending" }
  ]
}
```

**step0.md** 핵심:
- 작업: `docs/plan_harness_smoke/.marker` 파일을 생성하고 내용을 `"harness smoke ok"` 한 줄로 쓴다.
- AC: `test -f docs/plan_harness_smoke/.marker && grep -q "harness smoke ok" docs/plan_harness_smoke/.marker`
- 금지: 이 경로 밖의 파일은 건드리지 마라(훅이 막을 것이지만 명시적으로).

**step1.md** 핵심:
- 작업: `docs/plan_harness_smoke/.marker`를 읽고 내용이 기대와 맞으면 summary에 "verified"를 기록한다.
- AC: 동일한 `grep`.
- 금지: 파일 수정/삭제 금지. 읽기만.

### 2. `docs/plans-index.json` 에 smoke 항목 추가

```json
{
  "plans": [
    { "dir": "plan_tdd", "status": "completed" },
    { "dir": "plan_harness", "status": "pending" },
    { "dir": "plan_harness_smoke", "status": "pending" }
  ]
}
```

### 3. 실제 하네스 실행

```bash
npm run harness plan_harness_smoke
```

관찰 기대치 (모든 항목 참이어야 함):

- `feat-plan_harness_smoke` 브랜치가 생성되거나 체크아웃됨.
- step 0 세션이 실제 `claude -p`를 호출하고, `.marker` 파일이 생성됨.
- step 0 종료 후 하네스가 AC(`test -f ... && grep -q ...`)를 **재실행**하고 통과 확인.
- 2단계 커밋이 기록됨(`feat(plan_harness_smoke): step 0 — create-marker` + `chore(...)`).
- step 1 세션이 이어서 실행되고 AC 통과.
- 최종 커밋 `chore(plan_harness_smoke): mark phase completed`.
- `docs/plans-index.json`의 `plan_harness_smoke` 항목 status가 `completed`로, completed_at이 기록됨.
- `docs/plan_harness_smoke/phases/index.json`의 모든 step 상태 completed + summary 채워짐.
- `docs/plan_harness_smoke/phases/step{0,1}-output.json` 파일 각각 존재.

### 4. 실패 경로 수동 검증 (선택)

가능하면 다음도 확인한다. 다만 여기서 강제하지는 않는다(시간 제약):

- `.marker`를 일부러 지우고 step 1만 pending으로 돌려놓은 뒤 `npm run harness plan_harness_smoke` 재실행 → AC 실패 → 3회 재시도 → error 상태로 종료되는지.

### 5. 정리

smoke 검증이 끝나면:

- `docs/plan_harness_smoke/` 디렉터리와 그 안의 브랜치는 **삭제하지 않는다**. 이력으로 남겨 이후 회귀 비교에 사용.
- main으로 돌아가는 작업은 **하지 않는다**. 하네스가 만든 브랜치가 그대로 남아야 이후 리뷰 가능.

## Acceptance Criteria

```bash
# 기본 파일 존재
test -f docs/plan_harness_smoke/phases/index.json
test -f docs/plan_harness_smoke/phases/step0.md
test -f docs/plan_harness_smoke/phases/step1.md
# 하네스 실행 결과물
test -f docs/plan_harness_smoke/.marker
grep -q "harness smoke ok" docs/plan_harness_smoke/.marker
test -f docs/plan_harness_smoke/phases/step0-output.json
test -f docs/plan_harness_smoke/phases/step1-output.json
# 상태 검증
node -e '
  const fs = require("node:fs");
  const idx = JSON.parse(fs.readFileSync("docs/plan_harness_smoke/phases/index.json", "utf8"));
  if (idx.steps.some(s => s.status !== "completed")) process.exit(1);
  if (!idx.completed_at) process.exit(1);
'
node -e '
  const fs = require("node:fs");
  const p = JSON.parse(fs.readFileSync("docs/plans-index.json", "utf8")).plans;
  const smoke = p.find(x => x.dir === "plan_harness_smoke");
  if (!smoke || smoke.status !== "completed") process.exit(1);
'
# 브랜치 흔적
git rev-parse --verify feat-plan_harness_smoke
# 커밋 로그 확인 (최소 4커밋)
git log feat-plan_harness_smoke --oneline -n 20 | grep -q "step 0 — create-marker"
git log feat-plan_harness_smoke --oneline -n 20 | grep -q "step 1 — verify-marker"
git log feat-plan_harness_smoke --oneline -n 20 | grep -q "mark phase completed"
```

## 검증 절차

1. AC 실행.
2. 브랜치 생성과 2단계 커밋 로그를 `git log`로 육안 확인.
3. `phases/index.json` step 9 업데이트.
4. **이 step은 최종 step**이므로 전체 `plan_harness`의 완료 처리는 하네스가 자동으로 한다(수동으로 `completed_at`을 쓰지 마라).

## 금지사항

- **smoke 플랜 안에서 실제 코드(`frontend/`, `backend/`)를 건드리지 마라**. 이유: smoke 목적은 파이프라인 검증만.
- **`--push` 플래그로 원격 push 하지 마라**. 이유: throwaway 흔적을 원격에 남기지 않는다.
- **하네스 소스(`tools/harness/**`)를 이 step에서 수정하지 마라**. 이 step은 실행/검증 전용. 버그가 나오면 error 처리 → 해당 모듈을 담당하는 이전 step의 pending 복귀로 복구(하네스 원칙).
- **plan_harness_smoke/ 디렉터리를 이 step 종료 시 삭제하지 마라**.
- **기존 테스트를 깨뜨리지 마라**.
