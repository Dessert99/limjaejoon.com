# Step 8: slash-command-and-docs

## 읽어야 할 파일

- `/docs/plan_harness/PRD.md` (핵심 기능 #2, #7, #10)
- `/docs/plan_harness/ADR.md` (ADR-003, ADR-006)
- `/CLAUDE.md`
- `/docs/_template/` 하위 전체
- `/.claude/commands/` 하위 기존 커맨드 파일들 (포맷 참고용)

설계 단계에서 Claude와 대화로 플랜을 만들 때 따라야 할 워크플로우를 슬래시 커맨드로 박는다. 템플릿을 ADR-003 방향(progress.txt/feature_list.json 폐기)에 맞게 정리한다.

## 작업

### 1. `.claude/commands/harness.md` 생성

이 파일의 내용은 **사용자의 예시 슬래시 커맨드를 이 프로젝트 맥락에 맞게 번역**한 것이어야 한다. 핵심 섹션 구조:

```markdown
# Harness

이 프로젝트는 Harness 프레임워크로 기능 단위 작업을 수행한다. 아래 워크플로우에 따라 진행하라.

## 워크플로우

### A. 탐색
docs/ 하위 문서(기존 plan_*/ PRD/ARCHITECTURE/ADR)를 읽어 이 repo의 기획·아키텍처·코드 컨벤션을 파악한다. 필요하면 Explore 에이전트를 병렬로 사용한다.

### B. 논의
구현을 위해 구체화하거나 결정해야 할 기술/범위 사항을 사용자에게 제시하고 논의한다.

### C. Step 설계
사용자가 승인하면 step으로 나눈 초안을 작성해 피드백을 요청한다. 설계 원칙:

1. Scope 최소화 — 하나의 step은 하나의 모듈/레이어.
2. 자기완결성 — 각 stepN.md 는 독립된 Claude 세션에서 실행됨. 외부 대화 참조 금지.
3. 사전 준비 강제 — "읽어야 할 파일" 섹션에 관련 문서/이전 산출물 경로 명시.
4. 시그니처 수준 지시 — 함수 인터페이스만 제시, 내부 구현은 실행 세션 재량. 단 설계 의도를 깨면 안 되는 불변식은 명시.
5. AC 는 실행 가능한 커맨드 — `npm run test -w <ws>`, `npm run build` 등 구체적.
6. 금지사항은 구체적으로 — "X하지 마라. 이유: Y" 형식.
7. 네이밍 — step name 은 kebab-case.

### D. 파일 생성
사용자 승인 후 아래 경로에 파일을 만든다.

- `docs/plan_<name>/PRD.md`
- `docs/plan_<name>/ADR.md`
- `docs/plan_<name>/ARCHITECTURE.md` (런타임 구조가 있을 때만, 선택)
- `docs/plan_<name>/phases/index.json`
- `docs/plan_<name>/phases/stepN.md` (각 step마다)
- `docs/plans-index.json` 의 `plans` 배열에 `{ dir: "plan_<name>", status: "pending" }` 추가

progress.txt 와 feature_list.json 은 **생성하지 않는다** (ADR-003).

### E. 실행
설계가 끝난 뒤 사용자가 수동으로 실행한다.

\`\`\`bash
npm run harness plan_<name>
npm run harness plan_<name> -- --push   # 완료 후 원격 push
\`\`\`

execute.ts 가 자동으로 처리하는 것: 브랜치 관리, 가드레일 주입, step 순차 실행, 자가 교정(3회 재시도), AC 재실행 검증(Trust but Verify), 2단계 커밋.
```

추가로 "## 주의사항"에 **훅과의 관계**를 한두 줄로 설명:

> 이 repo의 `.claude/hooks/`는 설계 대화와 하네스 실행 양쪽에서 자동 작동한다. enforce-tdd.sh가 `frontend/features/**`와 `backend/src/**`에서 테스트 없이 구현하려는 시도를 차단한다.

### 2. `docs/_template/` 정리 (ADR-003 반영)

- **삭제**: `docs/_template/progress.txt`, `docs/_template/feature_list.json`
- **유지**: `docs/_template/PRD.md`, `docs/_template/ADR.md`
- **신규**: `docs/_template/ARCHITECTURE.md` 스켈레톤 (짧게)
  ```markdown
  # 아키텍처: { 플랜명 }

  ## 디렉터리 구조
  ## 패턴
  ## 데이터 흐름
  ```
- **신규**: `docs/_template/phases/index.json` 스켈레톤
  ```json
  {
    "project": "{프로젝트}",
    "phase": "{플랜명}",
    "steps": []
  }
  ```
- **신규**: `docs/_template/phases/step.md` (stepN.md 템플릿)
  - `/harness` 슬래시 커맨드가 반영할 구조(읽어야 할 파일 / 작업 / AC / 검증 절차 / 금지사항).

### 3. `CLAUDE.md` 1줄 안내 추가

"개발 프로세스" 섹션 마지막에 한 줄:

```markdown
- 기능 단위 작업은 `/harness` 로 설계하고 `npm run harness <plan-dir>` 로 실행한다.
```

### 4. 기존 plan_tdd 는 건드리지 않는다

`docs/plan_tdd/progress.txt`, `docs/plan_tdd/feature_list.json`은 **삭제 금지**. 이유: 완료된 플랜의 이력이며 소급 수정은 범위 외(ADR-004에 간접 언급된 아카이브 원칙).

### 5. 루트 `docs/plans-index.json` 생성

현재 완료된 플랜과 현재 진행 중인 플랜을 반영:

```json
{
  "plans": [
    { "dir": "plan_tdd", "status": "completed" },
    { "dir": "plan_harness", "status": "pending" }
  ]
}
```

(`completed_at` 타임스탬프는 소급 추정이 부정확하므로 생략한다. 신규 플랜부터 정확히 기록된다.)

## Acceptance Criteria

```bash
# 파일 존재 확인
test -f .claude/commands/harness.md
test -f docs/_template/PRD.md
test -f docs/_template/ADR.md
test -f docs/_template/ARCHITECTURE.md
test -f docs/_template/phases/index.json
test -f docs/_template/phases/step.md
test -f docs/plans-index.json
# 레거시 템플릿 파일이 사라졌는지
test ! -f docs/_template/progress.txt
test ! -f docs/_template/feature_list.json
# plan_tdd 이력 파일은 보존되었는지
test -f docs/plan_tdd/progress.txt
test -f docs/plan_tdd/feature_list.json
# CLAUDE.md 한 줄 안내
grep -q "npm run harness" CLAUDE.md
# JSON 유효성
node -e 'JSON.parse(require("node:fs").readFileSync("docs/plans-index.json","utf8"))'
# 포맷
npm run format:check
```

## 검증 절차

1. AC 실행.
2. `.claude/commands/harness.md`의 A~E 섹션과 금지 규칙이 사용자의 예시 슬래시 커맨드와 의미상 정렬되는지 육안 확인.
3. `docs/_template/phases/step.md` 템플릿을 새 플랜에서 copy 해서 그대로 쓸 수 있는 형태인지 확인.
4. `phases/index.json` step 8 업데이트.

## 금지사항

- **plan_tdd 의 progress.txt/feature_list.json 을 삭제하지 마라**. 이유: 완료된 이력의 보존.
- **`docs/_template/PRD.md`의 "## 범위 외 (Out of Scope)" 섹션을 없애지 마라**. 직전 대화에서 확정된 포맷.
- **`.claude/hooks/` 건드리지 마라**. 훅 수정은 이 플랜 범위 외.
- **`.claude/commands/` 안의 기존 커맨드 파일을 수정하지 마라**. 새 파일만 추가.
- **plans-index.json 에 실제 타임스탬프를 임의로 찍지 마라**. 이유: 데이터 위조. pending/completed만 표기하고 timestamp는 execute.ts가 기록하도록 비워 둔다(이미 completed인 plan_tdd는 예외적으로 timestamp 생략).
- **기존 테스트를 깨뜨리지 마라**.
