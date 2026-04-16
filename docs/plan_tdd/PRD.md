# PRD: plan_tdd

## 목표
테스트 없으면 구현 못 하는 개발 환경 구축 (Vitest 유닛 테스트 러너 + PreToolUse 훅으로 "테스트 먼저" 강제)

## 핵심 기능
1. 프론트엔드 Vitest 설치 (jsdom + React 컴포넌트 테스트 준비)
2. 백엔드 Jest 최소 config (NestJS 관례, `--passWithNoTests`)
3. TDD 강제 훅 `.claude/hooks/enforce-tdd.sh` — 대응 테스트 파일 없으면 Write/Edit 차단
4. 샘플 테스트 1개로 Vitest 동작 검증
5. 기존 Playwright 파일을 `frontend/e2e/`로 이관, 유닛은 `frontend/tests/` 미러 구조
6. CLAUDE.md에 훅 한 줄 안내

## MVP 제외 사항
- `@vanilla-extract/vite-plugin` (VE 스타일 import하는 컴포넌트 테스트 할 때 추가)
- `vite-tsconfig-paths` (`@/` alias 필요해질 때 추가)
- `@testing-library/user-event` (인터랙션 테스트 생길 때)
- `.claude/rules/tdd.md` 별도 룰 파일 (CLAUDE.md 한 줄로 충분)
- 루트 집합 스크립트 `test`, `type-check` (`-w` 붙이면 됨)
- Circuit Breaker 훅
- Stop/SessionStart/UserPromptSubmit 훅
- 세션 상태 파일 (`active_plan.txt`, `progress.txt` 자동 갱신 시스템)
- git husky/pre-commit
- 헤드리스 `claude -p` 파이프라인
- 테스트 커버리지 게이트
