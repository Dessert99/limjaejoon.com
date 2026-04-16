# 아키텍처: plan_tdd

## 디렉터리 구조

변경 후 주요 트리:
```
frontend/
  vitest.config.ts          # 신규
  vitest.setup.ts           # 신규
  playwright.config.ts      # testDir: './e2e'로 수정
  package.json              # test→vitest, test:e2e→playwright
  features/                 # 소스 (TDD 대상)
    blog/lib/posts.ts
    ...
  tests/                    # 유닛 테스트 (미러 구조)
    features/blog/lib/posts.test.ts   # 샘플
  e2e/                      # Playwright (이관)
    home.spec.ts
    blog.spec.ts
    post.spec.ts
    search.spec.ts
    navigation.spec.ts
backend/
  jest.config.js            # 신규
  package.json              # test: jest --passWithNoTests
  src/
    app.service.ts          # TDD 대상, co-located .spec.ts
    app.controller.ts
    ...
.claude/
  hooks/
    enforce-tdd.sh          # 신규 (+x)
    block-protected-files.sh    # 기존
    block-dangerous-commands.sh # 기존
  settings.json             # PreToolUse에 enforce-tdd 배선 추가
.github/workflows/
  playwright.yml            # test:fe → test:e2e
CLAUDE.md                   # TDD 훅 한 줄 추가
docs/
  _template/                # 하네스 템플릿 (기존)
  plan_tdd/                 # 이 플랜 (이 문서 포함)
```

## 패턴

### TDD 훅 파이프라인
```
Claude의 Edit/Write/MultiEdit 시도
  → PreToolUse 훅 체인
    → block-protected-files.sh (.env, .git 등 보호)
    → block-dangerous-commands.sh (Bash만 해당)
    → enforce-tdd.sh    ← NEW
      → 대상 경로 판별 (frontend/features/** or backend/src/**)
      → 제외 규칙 적용 (*.test, *.spec, *.d.ts, *.css.ts, docs/, tests/, e2e/)
      → 대응 테스트 파일 존재 확인
      → 없으면 exit 2 + BLOCKED 메시지
  → 통과 시 실제 파일 수정
  → PostToolUse (기존 prettier) 실행
```

### 테스트 위치 규약
- **프론트 유닛**: 소스 구조 미러링
  - `frontend/features/blog/lib/posts.ts`
  - → `frontend/tests/features/blog/lib/posts.test.ts`
- **프론트 E2E**: 평면 구조 (Playwright 특성)
  - `frontend/e2e/*.spec.ts`
- **백엔드**: co-located (NestJS 관례)
  - `backend/src/app.service.ts`
  - → `backend/src/app.service.spec.ts`

## 데이터 흐름

### 테스트 실행
```
npm run test -w frontend
  → vitest run
  → include: tests/**/*.test.{ts,tsx} 스캔
  → jsdom 환경에서 실행
  → @testing-library/jest-dom 매처 로드

npm run test -w backend
  → jest --passWithNoTests
  → testRegex: .*\.spec\.ts$ 스캔 (src/ 루트)
  → ts-jest preset으로 TS 변환
  → spec 없어도 exit 0

npm run test:e2e -w frontend
  → playwright test
  → testDir: './e2e' 스캔
  → 브라우저 띄워 실제 렌더링 검증
```

### TDD 훅 차단 플로우
```
사용자: "blog 검색 기능 추가해"
  → Claude가 frontend/features/search/index.ts Write 시도
  → enforce-tdd.sh 발동
  → frontend/tests/features/search/index.test.ts 확인
  → 없음 → exit 2 + BLOCKED 메시지
  → Claude가 먼저 index.test.ts 작성 (실패하는 테스트)
  → 재시도: Write에 enforce-tdd.sh 발동 → 통과
  → 구현 진행
  → npm run test -w frontend 으로 Red → Green 확인
```
