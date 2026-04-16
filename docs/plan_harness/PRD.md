# PRD: plan_harness

## 목표
기능 단위 작업을 "설계=대화식 / 실행=헤드리스 자율"로 분리하고, TypeScript 오케스트레이터(`tools/harness/`)가 plan 단위 step을 순차 자동 실행·자가 교정·자동 커밋하도록 구축한다. 기존 `.claude/hooks/` 3종과 공존하는 **하이브리드 검증 구조**로 간다.

## 핵심 기능
1. **`tools/harness/` TS 워크스페이스** — npm workspaces에 추가. `execute.ts` 오케스트레이터 + 공용 유틸 + 단위 테스트. 진입점은 루트 `package.json`의 `"harness": "tsx tools/harness/src/execute.ts"` 스크립트.
2. **설계 단계 슬래시 커맨드 `.claude/commands/harness.md`** — 사용자가 플랜을 논의·설계하는 대화식 워크플로우 정의. 탐색 → 논의 → step 설계 → 파일 생성 순서를 강제. 산출물: `docs/plan_<name>/PRD.md/ARCHITECTURE.md/ADR.md` + `docs/plan_<name>/phases/index.json` + `docs/plan_<name>/phases/stepN.md`.
3. **phases/index.json 스키마** — plan 내부 step 리스트와 상태를 단일 소스로 관리. 필드: `project`, `phase`, `steps[]{step,name,status,summary?,started_at?,completed_at?,error_message?,failed_at?,blocked_reason?,blocked_at?}`. 상태 전이: `pending → completed | error | blocked`.
4. **전역 인덱스 `docs/plans-index.json`** — 모든 plan의 현황을 한 번에 본다. 필드: `plans[]{dir, status, completed_at?, failed_at?, blocked_at?}`. execute.ts가 상태 변경 시 자동 갱신.
5. **execute.ts 오케스트레이터 (핵심 6개 기능)**
   - 브랜치 관리: `feat-<plan-name>` 자동 checkout/생성
   - 가드레일 주입: `CLAUDE.md` + `docs/plan_<name>/*.md`를 preamble로 Claude 프롬프트에 삽입
   - 컨텍스트 누적: 완료된 step의 `summary` 필드를 다음 step preamble에 전달
   - 자가 교정 루프: `status!=completed`면 이전 에러를 프롬프트에 피드백해 최대 3회 재시도
   - **Trust but Verify**: Claude가 `completed`로 보고해도 하네스가 step의 AC 커맨드를 **재실행**해서 실제 통과 여부 확인. 불일치면 error 처리
   - 2단계 자동 커밋: 코드 변경은 `feat(<plan>): step N — <name>`, 메타데이터는 `chore(<plan>): step N output`
6. **Claude 호출 파이프라인** — `claude -p --dangerously-skip-permissions --output-format json`로 헤드리스 실행. `stdout/stderr/exitCode`를 `phases/step{N}-output.json`에 저장. 기존 `.claude/hooks/` 3종(enforce-tdd, block-protected-files, block-dangerous-commands)은 헤드리스 호출 중에도 그대로 작동하므로 하네스가 별도 처리하지 않음.
7. **상태 파일 단일화** — 신규 플랜부터 `progress.txt` / `feature_list.json`을 더 이상 만들지 않는다. `phases/index.json`이 모든 step 상태의 단일 소스. `docs/_template/`도 이에 맞게 갱신.
8. **step 템플릿** — `docs/plan_harness/phases/stepN.md` 생성 규약: "읽어야 할 파일", "작업(시그니처 수준)", "Acceptance Criteria(실행 가능한 커맨드)", "검증 절차", "금지사항" 5 섹션. 각 step은 독립된 Claude 세션에서 실행되므로 **자기완결적**이어야 함(이전 대화 참조 금지).
9. **에러 복구 가이드** — `error` → 원인 수정 후 해당 step을 `pending`으로 되돌리고 `npm run harness <plan>` 재실행. `blocked` → `blocked_reason` 해결 후 동일 절차. `execute.ts`는 **가장 앞의 error/blocked step을 감지하면 즉시 중단**해서 사용자 개입을 강제.
10. **사용자 문서 1줄 안내** — CLAUDE.md에 "기능 단위 작업은 `/harness`로 설계하고 `npm run harness <plan>`으로 실행" 한 줄 추가.

## 범위 외 (Out of Scope)
- **plan_tdd 레거시 자동 마이그레이션** — 기존 `docs/plan_tdd/progress.txt` / `feature_list.json`을 phases/index.json으로 변환하는 스크립트. 수동 처리(플랜 이미 완료됨).
- **병렬 step 실행** — 순차 실행만. 의존 관계 해석/분기 없음.
- **resume/watch 모드** — 중단된 지점에서 자동 재개, 파일 변경 감시 재실행. pending 단계에서 그냥 재실행하면 되므로 불필요.
- **step 롤백** — 실패 시 자동 revert. 사용자가 git으로 수동 복구.
- **전역 인덱스 UI/대시보드** — `plans-index.json` JSON 파일만 유지. 시각화 불필요.
- **하네스 실행 로그 영구 보관** — 각 step의 `step{N}-output.json`은 커밋되지만 장기 감사/분석용 아카이브는 만들지 않음.
- **다중 프로젝트 지원** — 이 리포지토리 전용. generic CLI 패키징 안 함.
- **CI에 하네스 실행 자동 트리거** — 하네스는 로컬 개발자 도구. GitHub Actions에서 `claude -p`를 돌리지 않음.
- **훅 설정 제어 플래그** — execute.ts에서 훅을 끄는 옵션 제공 안 함. 훅은 항상 켜짐.
- **타임아웃/리소스 제한 커스터마이즈** — 현재 예시의 1800s 하드코딩을 유지. 플래그화 안 함.
