# 하네스 엔지니어링

## 왜 하네스를 만들었나

1. 기능 하나를 만들 때 보통 "탐색 → 테스트 작성 → 구현 → 검증 → 커밋" 같은 여러 step이 반복된다.
2. Claude와 대화식 세션에서 step마다 지시·피드백을 주고받으면 사람이 동일한 흐름을 매번 유도해야 한다.
3. 더 큰 문제는 설계(어떻게 쪼갤지)와 실행(쪼갠 걸 수행)을 한 세션에 섞을 때 나타난다.
4. Claude가 설계 판단까지 자율적으로 해버려 사용자 의도를 벗어나기 쉽고, 실패를 감지하기 어렵다.
5. 그래서 설계는 사람과 대화로 확정하고, 실행은 헤드리스로 자율 반복시키는 오케스트레이터가 필요했다.
6. 이 역할을 담당하는 것이 `tools/harness/` 워크스페이스의 하네스다.

→ 사람이 반복적으로 밀어줘야 하는 Claude 실행을 자동화하기 위해, 설계와 실행을 분리한 오케스트레이터가 필요했다.


## 설계와 실행의 분리

1. 하네스의 가장 상위 원칙은 ADR-004에 박혀 있다.
2. 기능 설계는 본질적으로 트레이드오프 논의라 양방향 대화가 필요하고, 실행은 지시서를 따르는 기계적 작업이다.
3. 그래서 설계는 Claude Code plan mode와 `/harness` 슬래시 커맨드에서 사람과 함께 진행한다.
4. 실행은 `tools/harness/src/execute.ts`가 `claude -p --dangerously-skip-permissions`를 자식 프로세스로 띄워 자율 수행한다.
5. 이 분리를 지키지 않으면 자동화가 "설계까지 알아서 해버리는" 방향으로 흘러가 사용자가 통제를 잃는다.
6. 반대로 설계 단계에서는 자동화를 걸지 않고 온전히 대화로 결정한다.

→ 설계는 양방향 대화, 실행은 헤드리스 자율이라는 분리가 하네스의 근간이다.


## 3단 워크플로우

1. 첫 번째 단계는 Claude Code의 plan mode에서 기획 논의를 한다.
2. 사용자가 Claude와 대화하며 PRD·ADR·ARCHITECTURE 초안을 합의하고 `docs/plan_<name>/`에 저장하는 것이 이 단계의 산출물이다.
3. 두 번째 단계는 `/harness` 슬래시 커맨드다.
4. 이 커맨드는 이미 저장된 PRD/ADR을 전제로, 관련 코드를 탐색한 뒤 step을 분해해 `phases/index.json`과 `stepN.md`를 생성한다.
5. 세 번째 단계는 `npm run harness <plan>` 실행이다.
6. 이 시점부터는 사람이 개입하지 않고 하네스가 step을 순차 실행, 검증, 커밋까지 자동 처리한다.

```
plan mode          /harness              npm run harness
[대화] 왜·뭐   →   [대화] 어떻게 쪼개  →  [자율] 실제 구현
  ↓                  ↓                     ↓
PRD/ADR/ARCH       phases/index.json     feat-<plan> 브랜치
                   stepN.md              + 커밋들
```

→ 기획은 plan mode, 분해는 /harness, 구현은 npm run harness로 3단계를 분리했다.


## 예시 흐름: 로그인 기능 구현

1. plan mode에 진입해 "로그인 기능 만들자"로 대화를 시작한다.
2. Claude가 "JWT인지 세션인지, DB는 뭔지, 소셜 로그인 포함 여부"를 묻고 사용자 답변을 받는다.
3. JWT + 쿠키, Prisma + Postgres, bcrypt, 이메일/비번만 같은 결정이 나오면 ExitPlanMode 시점에 `docs/plan_auth/PRD.md`, `ADR.md`, `ARCHITECTURE.md`가 저장된다.
4. `docs/plans-index.json`에 `{ dir: "plan_auth", status: "pending" }`이 추가된다.
5. 이제 사용자가 `/harness`를 호출하면 Claude가 방금 만든 문서를 읽고 관련 코드 영역(`frontend/`, `backend/`)을 훑는다.
6. step 분해에 필요한 세부 논의(예: "Prisma 마이그레이션을 독립 step으로?")를 사용자와 주고받는다.
7. 합의 후 step을 다음과 같이 나눈 초안을 제시한다.

```
step 0: prisma-user-schema       step 5: backend-me-endpoint
step 1: backend-auth-service     step 6: frontend-auth-api
step 2: backend-signup           step 7: frontend-login-form
step 3: backend-login            step 8: frontend-auth-context
step 4: backend-auth-guard
```

8. 사용자 승인 후 Claude는 `docs/plan_auth/phases/index.json`과 `step0.md ~ step8.md`를 생성한다.
9. 마지막으로 사용자가 `npm run harness plan_auth`를 실행하면 하네스가 `feat-plan_auth` 브랜치를 만들고 step 0부터 자율 실행한다.
10. 각 step이 끝날 때마다 Acceptance Criteria를 재실행해 검증하고, 통과 시 2단계 커밋을 남기며 다음 step으로 진행한다.
11. 도중 step 5가 3회 모두 실패하면 `error` 상태로 멈추므로, 사용자가 원인(예: cookie-parser 누락)을 고치고 해당 step을 `pending`으로 되돌린 뒤 재실행하면 step 5부터 다시 이어진다.

→ 로그인처럼 여러 레이어에 걸친 기능도 plan mode → /harness → npm run harness로 일관된 흐름을 타고 완성된다.


## 상태 파일 구조

1. 하네스는 모든 상태를 JSON 두 종류에 기록한다.
2. 하나는 플랜 내부 상태인 `docs/plan_<name>/phases/index.json`이다.
3. 이 파일에는 step 배열이 있고 각 step이 `pending`, `completed`, `error`, `blocked` 중 하나의 상태를 가진다.
4. 각 step은 `summary`, `started_at`, `completed_at`, `error_message` 같은 필드로 이력을 남긴다.
5. 다른 하나는 레포 전체 현황인 `docs/plans-index.json`이다.
6. 이 파일은 레포에 존재하는 모든 플랜의 최종 상태를 한 번에 보여주는 단일 인덱스다.
7. ADR-003에 따라 기존 `progress.txt`와 `feature_list.json`은 쓰지 않는다.
8. 같은 정보를 여러 파일에 두면 동기화 누락이 발생하므로 JSON 하나로 단일 소스 원칙을 지킨다.

```json
{
  "steps": [
    { "step": 0, "name": "a", "status": "completed", "summary": "..." },
    { "step": 1, "name": "b", "status": "pending" }
  ]
}
```

→ 플랜 내부는 phases/index.json, 레포 전체는 plans-index.json이 단일 소스로 관리한다.


## 실행 파이프라인 내부 흐름

1. `npm run harness <plan>`은 `tsx tools/harness/src/execute.ts`를 실행한다.
2. 진입점에서 OrchestratorContext를 조립해 `executeAllSteps`를 호출한다.
3. 이 함수는 먼저 `feat-<plan>` 브랜치로 checkout하고, `checkBlockers`로 앞선 step에 error나 blocked가 있는지 확인한다.
4. 이상이 없으면 pending step을 하나씩 꺼내 `executeSingleStep`을 돌린다.
5. 각 step에서는 preamble(가드레일 + 이전 step 요약 + 작업 규칙)을 조립해 `stepN.md` 내용과 합친 프롬프트를 만든다.
6. `invokeClaude`가 이 프롬프트를 `claude -p` 자식 프로세스에 넘기고, 결과를 `step{N}-output.json`에 저장한다.
7. 세션이 끝나면 `phases/index.json`을 다시 읽어 해당 step의 status를 확인한다.
8. `completed`면 AC 커맨드를 재실행하고, 통과 시 2단계 커밋 후 다음 step으로 넘어간다.
9. 모든 step이 completed면 phase 전체에 `completed_at`을 기록하고 `plans-index.json`을 갱신한 뒤 종료한다.

→ 하네스는 OrchestratorContext를 조립해 "체크아웃 → 차단 확인 → pending 실행 → AC 재검증 → 커밋"을 반복한다.


## 3중 방어선

1. 하네스 실행 중 품질을 지키는 방어선은 세 층으로 쌓여 있다.
2. L1은 기존 `.claude/hooks/`로, Edit/Write 호출 시점에 기계적으로 개입한다.
3. 예를 들어 `enforce-tdd.sh`는 `frontend/features/**`나 `backend/src/**`에서 테스트 없이 구현 파일을 쓰려는 시도를 차단한다.
4. L2는 Claude 세션 자체의 자기 보고다.
5. Claude는 stepN.md 지시에 따라 AC를 스스로 실행하고 `phases/index.json`의 status와 summary를 갱신한다.
6. L3는 하네스가 직접 돌리는 AC 재실행이다.
7. Claude가 `completed`로 보고해도 하네스는 그 말을 100% 믿지 않고 같은 AC 커맨드를 한 번 더 돌려 독립적으로 확인한다.
8. 세 층은 서로 독립적이라 한 층을 수정해도 다른 층에 영향을 주지 않는다.

→ 훅(파일 시점) + Claude 자기보고(세션 내) + 하네스 AC 재실행(세션 후)의 3층 방어로 품질을 보장한다.


## Trust but Verify와 자가 교정 루프

1. L3에 해당하는 "하네스의 AC 재실행"이 Trust but Verify라는 ADR-005의 핵심이다.
2. 자율 실행은 사용자가 중간에 확인해주지 않으므로, Claude의 자기 보고만 믿으면 환각이나 게으름을 감지하지 못한다.
3. 그래서 Claude가 `completed`로 표시해도 하네스가 AC를 재실행해 실제 exit code를 확인한다.
4. 재실행이 실패하면 해당 step을 `error`로 강등하고 error_message에 실패한 커맨드를 기록한다.
5. 이후 자가 교정 루프가 작동해 같은 step을 최대 3회 재시도한다.
6. 각 재시도 때는 이전 에러 메시지를 preamble의 "이전 시도 실패" 섹션에 주입해 Claude가 문제를 인지하도록 한다.
7. 3회 모두 실패하면 최종 error로 확정하고 프로세스는 exit 1로 종료해 사용자 개입을 강제한다.
8. `blocked`는 Claude가 사람 판단이 필요하다고 스스로 보고한 경우로, 재시도 없이 즉시 exit 2로 빠져나온다.

```
pending ─┬─→ completed ──AC verify OK──→ 커밋
         ├─→ error ──attempt<3──→ pending (prevError 주입)
         │         attempt==3──→ exit 1
         └─→ blocked ──────────→ exit 2
```

→ Claude의 자기 보고는 신뢰하되 AC 재실행으로 검증하고, 실패 시 3회까지 자가 교정 후 사용자에게 넘긴다.


## 2단계 커밋 전략

1. 각 step이 끝나면 하네스는 변경분을 두 개의 커밋으로 나눠 기록한다.
2. 첫 커밋은 `feat(<plan>): step N — <name>` 메시지로 코드와 설정 파일만 담는다.
3. 두 번째 커밋은 `chore(<plan>): step N output` 메시지로 `phases/index.json`과 `step{N}-output.json` 같은 메타데이터를 담는다.
4. 이렇게 나누는 이유는 코드 히스토리에서 메타 갱신 노이즈를 분리하기 위해서다.
5. 리뷰나 revert 시 feat 커밋만 보면 실제 제품 변경만 확인할 수 있다.
6. 만약 step에서 코드 변경이 없으면(예: 검증만 하는 step) feat 커밋은 생략되고 chore 커밋만 남는다.
7. 이 동작은 `twoStageCommit` 구현에서 `excludeFromFeat` 경로를 언스테이지한 뒤 staged 변경이 있는 경우에만 커밋하는 방식으로 실현된다.

→ feat 커밋은 제품 변경, chore 커밋은 메타 변경으로 분리해 이력의 원자성과 가독성을 지킨다.


## frontend 테스트와 하네스 테스트의 차이

1. 두 테스트 모두 vitest로 작성된 유닛 테스트로 러너와 문법이 같다.
2. 차이는 검증 대상에 있다.
3. `frontend/tests/`는 제품 코드, 즉 사용자가 웹에서 보는 기능(블로그 리스트 필터링, MDX 렌더링 등)을 검증한다.
4. `tools/harness/tests/`는 제품이 아닌 하네스 자체의 내부 로직(AC 파서, 2단계 커밋, 재시도 루프, 상태 I/O 등)을 검증한다.
5. 예를 들어 `parseACFromStep`이 `## Acceptance Criteria` 아래 bash 펜스에서 커맨드를 정확히 뽑는지 확인하는 테스트가 하네스 쪽에 있다.
6. 각 워크스페이스는 독립 npm 패키지이므로 `npm run test -w frontend`와 `npm run test -w @limjaejoon/harness`는 따로 돌고 의존성도 공유하지 않는다.
7. 사용자 입장에서는 평소 하네스 테스트를 의식할 일이 없다.
8. 하네스 자체를 수정할 때만 관련 테스트가 함께 고쳐지고, 그 외에는 리팩터링 회귀를 잡기 위한 안전망으로 배경에 존재한다.

→ frontend 테스트는 제품 회귀 방지, 하네스 테스트는 도구(하네스) 회귀 방지로 대상이 다를 뿐 성격은 같다.


## 설계 선택의 trade-off

1. ADR-001에 따라 하네스는 Python이 아닌 TypeScript로 작성해 모노레포 기술 스택 일관성을 지켰다.
2. ADR-005의 Trust but Verify를 지키기 위해 AC 재실행 비용(step당 실행 시간 증가)을 감수했다.
3. ADR-007에서는 resume/watch, 병렬 step 실행, 자동 롤백 같은 기능을 MVP에서 의도적으로 제외했다.
4. 이 제외는 YAGNI 원칙을 따라 실제 사용 패턴이 확인되기 전에 설계를 굳히지 않기 위함이었다.
5. 다만 파일 수 측면에서는 선택적으로 더 나눈 면이 있다.
6. 구현을 `state/git/claude/verify/orchestrator`로 쪼개고 유닛 테스트 8파일을 따로 둬서 총 20개 가까운 파일이 생겼다.
7. Python 예시처럼 한 파일로 몰아 2파일(`execute.ts` + `test.ts`)로 끝낼 수도 있었지만, 테스트의 의존성 주입 용이성과 모듈 경계 명확성을 위해 분리를 유지했다.
8. 대신 하네스 수정 빈도가 낮을 것이므로 일상적인 유지 비용은 크지 않다고 판단했다.

→ TS 모노레포 일관성, Trust but Verify, YAGNI라는 세 축을 중심으로 트레이드오프를 의식적으로 선택했다.
