# TDD 규칙

테스트를 먼저 작성해 동작 정의와 회귀 안전망을 동시에 만든다.

### 1. 적용 범위

- 대상: 커스텀 훅, 유틸/검증 함수, API 클라이언트 분기, 폼 동작, 사용자 인터랙션 컴포넌트
- 비대상: 순수 시각 컴포넌트(스타일·레이아웃), 단순 props 패스스루, MDX/페이지 라우트
- E2E(Playwright)는 TDD 사이클 밖 — 골든 패스 회귀 검증용
- `frontend/features/` 외(예: `frontend/app/`, `frontend/styles/`)는 TDD 강제 대상 아님

### 2. 사이클 — Red → Green → Refactor

- **Red**: 실패하는 테스트 먼저 작성. 동작과 완료 기준을 검증 가능한 형태로 표현
- **Green**: 테스트를 통과시키는 최소 코드만. 우아함보다 통과 우선
- **Refactor**: 초록 유지하며 중복 제거·네이밍·구조 개선

### 3. 테스트 위치

- 프론트 유닛(Vitest): `frontend/tests/`에 소스 구조 미러
- 백엔드(Jest/NestJS): 소스 옆 co-located `.spec.ts`
- 단위/통합 폴더 분리 없음 — 미러 구조만 유지하고 구분이 필요하면 `describe` 이름으로 표현

### 4. 명명

- `describe('<주체>', ...)` / `it('<상태에서 무엇이 일어난다>', ...)` — 한국어 OK
- 파일명: 프론트 `*.test.ts(x)`, 백엔드 `*.spec.ts`

### 5. 무엇을 검증하는가

- 사용자/호출자 관점의 동작과 결과만, 내부 구현 디테일 금지
- DOM 쿼리는 `getByRole`/`getByLabelText`/`getByText` 우선, `getByTestId`는 최후 수단
- 버그 픽스도 재현 테스트(Red)부터 — 회귀 방지 차원에서 사이클 동일

### 6. Mock 정책

- HTTP는 MSW로 모의(`frontend`에 이미 설치), `axios.mock` 직접 사용 지양
- 시간·난수 등 비결정성은 vitest fake timers·시드로 대체
- 모킹은 외부 경계에서만, 내부 모듈끼리는 실제 결합 유지
- 각 `it`은 독립적 — `beforeEach`/`afterEach`에서 모킹 상태 리셋, 순서 의존 금지

### 7. 워크플로우

- 사용자: 별도 터미널에 `npm run test:watch -w frontend`(또는 `cd frontend && npm run test:watch`) 켜둠
- 에이전트: 매 라운드에서 `npm run test:fe`(단일 실행)으로 결과 확인
- watch는 사용자 화면 신호 역할 — 에이전트는 watch를 띄우지 않음
