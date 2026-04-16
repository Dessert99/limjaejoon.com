# ADR: plan_tdd

## ADR-001: 프론트엔드 유닛 러너로 Vitest 선택
결정: Jest 대신 Vitest 사용
이유: Next.js 16 + React 19 + Vanilla Extract 조합에서 Vitest 설정이 훨씬 단순. Vite 생태계와 궁합이 좋고 속도도 빠름. Jest로 가면 `next/jest`, `babel-jest`, 모듈 매핑 등 부가 설정이 많음.
트레이드오프: 백엔드(NestJS)는 Jest이므로 러너가 이원화됨. 하지만 각 워크스페이스에 적합한 도구를 쓰는 게 설정 복잡도보다 중요.

## ADR-002: 테스트 파일 위치 규약
결정:
- 프론트 유닛: `frontend/tests/` 미러 구조 (`features/blog/lib/posts.ts` → `tests/features/blog/lib/posts.test.ts`)
- 프론트 E2E: `frontend/e2e/` 전용 폴더
- 백엔드: co-located `.spec.ts` (NestJS 관례)

이유: 사용자 지정. 프론트는 유닛과 E2E를 물리적으로 분리해 Vitest/Playwright가 서로의 파일을 잡지 않게 함. 백엔드는 NestJS 컨벤션을 존중(`service.ts` 옆에 `service.spec.ts`)해서 팀 관행 유지.
트레이드오프: 프론트 테스트 작성 시 소스와 테스트 경로를 다르게 관리해야 함 → 훅 로직이 미러 경로 변환을 수행해 커버.

## ADR-003: TDD 훅은 파일 존재만 체크
결정: `enforce-tdd.sh`는 대응 테스트 파일의 존재 여부만 확인. 실행 이력/테스트 결과는 검사 안 함.
이유: 러너 설치/설정과 훅을 결합하면 하나가 망가질 때 다른 하나도 동작 불능. 훅은 러너 독립적으로 작동해야 함. "테스트 먼저 쓰기"라는 행동 강제가 핵심이지 "테스트가 실제로 실행 중"까진 이 단계 목표 아님.
트레이드오프: 빈 `describe()` 파일로 우회 가능. 다만 Red→Green 사이클은 개발자 책임(컨벤션). 추후 PostToolUse에서 러너 이력 체크 훅 추가 여지.

## ADR-004: YAGNI 원칙으로 주변 패키지 보류
결정: `@vanilla-extract/vite-plugin`, `vite-tsconfig-paths`, `@testing-library/user-event` 는 이번 라운드에 설치 안 함. `.claude/rules/tdd.md` 별도 파일 생성 안 함.
이유: 각각의 트리거 조건(VE 스타일 import한 컴포넌트 / `@/` alias 사용 / 사용자 인터랙션 테스트)이 아직 발생 안 함. 미리 설치해두면 peer dep 충돌 가능성·유지 비용만 늘어남. 문서도 CLAUDE.md 한 줄이 훅 강제와 중복되지 않고 충분.
트레이드오프: 첫 컴포넌트 테스트 작성 시 설치 단계가 한 번 더 필요. 대신 실제 필요 시점이라 불필요 설치 회피.

## ADR-005: 백엔드 `--passWithNoTests` 플래그
결정: `backend/package.json`의 `test` 스크립트에 `--passWithNoTests` 추가.
이유: 현재 백엔드 spec 0개. 플래그 없으면 Jest가 exit 1로 실패. CI/루트 `npm run test --workspaces` 에서 오동작 방지.
트레이드오프: 실수로 테스트 파일 삭제해도 exit 0. TDD 훅이 spec 강제하므로 실질 영향 낮음. 테스트 커버리지 게이트 도입 시엔 이 플래그 제거 검토.
