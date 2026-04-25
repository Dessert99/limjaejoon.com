---
name: execute
description: /plan으로 만든 state.md를 읽고 구현을 이어간다. 진입 시 git으로 state.md 정합성 검증 → 도메인 전문가로 코드 작성 → code-reviewer/security-auditor/accessibility-tester로 검토 → state.md 갱신 → 완료 시 study-note. 새 세션에서도 즉시 작업 재개 가능.
---

# /execute — 기능 단위 구현 사이클

이 스킬은 **구현 + 검토 + 회고** 단계를 담당한다.
설계는 `/plan`이 끝낸 상태여야 하며, state.md가 진입점이다.

## 입력
- `/execute <plan-id>` — 명시된 plan으로 작업 (예: `/execute 0001-login-auth-session`)
- `/execute` (인자 없음) → `docs/plans/` 폴더를 `ls`로 스캔(`_` 시작 폴더 제외) → 번호 매겨 목록 출력 → 사용자가 번호로 선택. 잘못된 입력은 다시 묻기.

## 진입 시 필수 로드

순서대로 읽는다:
1. `docs/plans/<plan>/state.md` — **가장 먼저, 가장 자세히**. 다음 액션이 여기 있음.
2. `docs/plans/<plan>/PRD.md` — 범위/완료 기준 확인.
3. `docs/plans/<plan>/adr/*.md` — 의사결정. 구현은 ADR을 따라야 함.

state.md의 "자동 라우팅 결과" 섹션에 어떤 에이전트를 호출할지 이미 적혀 있다 — 이걸 그대로 따른다.

## 정합성 검증 (필수, 건너뛰지 않음)

진입 직후, state.md 갱신 누락이 있는지 git으로 검증한다.

1. state.md 마지막 커밋 시각 확인:
   `git log -1 --format=%cI -- docs/plans/<plan>/state.md`
2. 그 이후 변경된 관련 파일 확인:
   - 커밋된 변경: `git log --since=<state-mtime> --name-only --pretty=format: -- frontend backend infra docs/plans/<plan>` (중복 제거)
   - 미커밋 변경: `git status --short` (frontend/backend/infra/docs/plans/<plan>/* 만)
3. state.md "건드린 파일" / "마지막 작업 요약" 섹션과 비교.
4. **불일치 시 사용자에게 정리해서 보여주고 보강 요청**:
   - "보강" → 어떤 작업이었는지 묻고 state.md "마지막 작업 요약" + "건드린 파일" + "현재 단계" 갱신 후 다음 단계
   - "무시" → 그대로 진행 (사용자 책임)

검증을 건너뛰면 다음 세션이 깨질 수 있으므로 필수.

## 실행 흐름

### 1. 컨텍스트 확인

선택된 plan + state.md "다음 액션"을 사용자에게 보여주고 진행 동의 확인.
- 이어서 진행 → 다음 단계
- 액션 수정/추가 → 사용자와 합의 후 state.md 먼저 갱신

### 2. 구현 라운드

state.md "다음 액션"의 첫 항목을 처리. 도메인 에이전트로 코드 작성:

**도메인별 호출** (state.md "자동 라우팅 결과" 따름):
- frontend → `nextjs-developer`
- backend → `node-specialist`
- infra → `devops-engineer`

여러 도메인이면 **순차 호출**(상호 의존 가능). 각 호출에 전달:
- 관련 ADR 본문
- 해당 도메인이 작성/수정할 파일 경로
- CLAUDE.md 컨벤션 환기 (Vanilla Extract `vars.*` 토큰, 한 줄 주석, mobile-first, frontend/features/ 구조)

### 3. 검토 라운드 (1회)

코드 작성이 끝나면 검토자 병렬 호출.

**항상**: `code-reviewer`

**조건부** (state.md "자동 라우팅 결과" 따름):
- 보안 검토 필요 → `security-auditor` (코드 관점: 인젝션, 시크릿 누수, 취약 라이브러리, hardcoded credential)
- frontend 도메인 포함 → `accessibility-tester`

각 검토자에 전달:
- 변경된 파일 목록 + diff (또는 파일 경로)
- 관련 ADR (의도 파악용)

검토 결과를 사용자에게 보여주고:
- 반영할 피드백 → 다시 도메인 에이전트로 수정
- 무시할 피드백 → 사유 한 줄 메모

**재검토 라운드 상한: 1회.** 추가 라운드는 사용자 명시적 요청 시만 (핑퐁 방지).

### 4. state.md 갱신 (self-check 강제)

매 라운드 끝에 다음 체크리스트를 **명시적으로 출력**하고 모두 처리한 뒤 다음 단계로 간다:

- [ ] 현재 단계 체크박스 갱신
- [ ] 마지막 작업 요약: 이번 라운드에서 끝낸 것 (한 줄)
- [ ] 다음 액션: 처리한 항목 제거 + 새로 발견한 항목 추가
- [ ] 건드린 파일: 추가 (전체 경로 + 의도 한 줄)
- [ ] 미해결 결정/질문: 갱신

체크리스트 출력 → state.md 수정 → 사용자에게 갱신 요약 보고. **갱신 누락 시 다음 세션이 깨진다**.

### 5. 라운드 반복 또는 완료

- "다음 액션"에 항목 남음 → 2단계로 돌아감
- 모든 항목 완료 + PRD "완료 기준" 충족 → 6단계로

### 6. ADR Learnings 채우기

각 ADR의 비어있던 `Learnings` 섹션을 채운다:
- 실제 적용 결과 (예상대로였나)
- 예상과 다른 점
- 다음에 다르게 할 것

### 7. 회고: study-note

`/study-note <기능명>` 호출. 이 사이클에서 한 작업과 학습 내용을 정리.
출력: `reports/YYYY-MM-DD-<기능명>.md` (study-note 스킬 규약).

### 8. plan 종료

- state.md "현재 단계"의 모든 체크박스 ✅ 확인
- 사용자에게 plan 종료 보고:
  - 완성된 기능 요약
  - 변경된 파일 목록
  - ADR 목록 + Learnings 핵심
  - study-note 경로

## 주의사항

- **state.md를 항상 최신 상태로**. 갱신을 건너뛰면 다음 세션이 깨진다.
- **진입 시 정합성 검증을 건너뛰지 않는다**.
- **ADR을 따라라**. 구현 중 ADR과 다른 결정이 필요하면 → 사용자 확인 후 ADR 업데이트, 그 다음 코드.
- **컨벤션 우회 금지**. 도메인 에이전트가 컨벤션을 어기면 거부하고 재호출.
- 검토자 결과가 충돌하면 사용자가 조정. 자동 판단하지 않는다.
