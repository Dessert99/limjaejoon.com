# Step 0: workspace-setup

## 읽어야 할 파일

- `/CLAUDE.md`
- `/docs/plan_harness/PRD.md`
- `/docs/plan_harness/ARCHITECTURE.md`
- `/docs/plan_harness/ADR.md` (특히 ADR-001)
- `/package.json` (루트 workspaces 구조)
- `/tsconfig.base.json`
- `/frontend/tsconfig.json` (extends 패턴 참고)

기존 프론트/백엔드 workspace와 일관된 방식으로 `tools/harness/`를 추가한다.

## 작업

### 1. 루트 `package.json`의 `workspaces`에 `tools/harness` 추가

```json
{
  "workspaces": ["frontend", "backend", "tools/harness"]
}
```

루트에 하네스 실행 스크립트는 **이 step에서 추가하지 않는다**. step 7에서 다룬다.

### 2. `tools/harness/package.json` 생성

```json
{
  "name": "@limjaejoon/harness",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint"
  }
}
```

devDependencies로 설치할 것: `tsx`, `typescript`, `vitest`, `@types/node`, `eslint`.
`--passWithNoTests`는 **추가하지 않는다**. Vitest 기본 동작으로 둔다 (0 test면 비정상 종료 — step 1부터 실제 테스트로 채워짐).

### 3. `tools/harness/tsconfig.json` 생성

`../../tsconfig.base.json`을 extends 한다. `compilerOptions`:

- `module: "esnext"`, `moduleResolution: "bundler"`, `target: "es2022"`
- `outDir`, `rootDir`는 지정하지 않는다(컴파일은 tsx가 담당).
- `strict: true` (base에 이미 있으면 생략 가능)
- `types: ["node", "vitest/globals"]`
- `include: ["src/**/*.ts", "tests/**/*.ts"]`

### 4. 디렉터리 스캐폴드 (빈 파일 금지)

ARCHITECTURE.md의 "모듈 구조"를 그대로 반영하되, 이 step에서는 **컴파일 가능한 stub만** 생성한다.

- `src/execute.ts` — 파일 내용은 `export {};` 한 줄
- 하위 모듈 디렉터리(`state/`, `git/`, `claude/`, `verify/`, `orchestrator/`)는 **이 step에서 만들지 않는다**. 각 step에서 필요한 파일만 추가한다.

### 5. ESLint 설정

프론트와 같은 flat config 스타일로 최소 설정. `tsx`/`TS` 규칙만. 커스텀 룰 추가 금지.

## Acceptance Criteria

```bash
npm install
npm run build -w @limjaejoon/harness
npx tsx tools/harness/src/execute.ts
npm run lint -w @limjaejoon/harness
```

4번째 커맨드는 빈 진입점이라도 에러 없이 종료되어야 한다.

## 검증 절차

1. 위 AC 커맨드를 순서대로 실행한다.
2. 구조 점검:
   - `tools/harness/package.json`에 `@limjaejoon/harness` 이름 존재
   - 루트 `package.json` workspaces 배열에 `tools/harness` 존재
   - `node_modules/@limjaejoon/harness`가 심볼릭 링크로 존재
3. `phases/index.json`의 step 0을 업데이트:
   - AC 전부 통과 → `status: completed`, `summary`에 "tools/harness workspace 부트스트랩, tsx/vitest 설치, 빈 execute.ts 스텁" 같이 한 줄 요약
   - 3회 시도 실패 → `status: error`, `error_message`
   - API/외부 권한 이슈 → `status: blocked`, `blocked_reason`

## 금지사항

- **루트 `package.json`에 `harness` 스크립트를 추가하지 마라**. 이유: step 7의 책임이며 CLI 인자 파싱과 함께 설계해야 한다.
- **Vitest 설정 파일(`vitest.config.ts`) 생성 금지**. 이유: 이 step은 설정만 준비하며, 테스트 러너는 step 1이 첫 테스트와 함께 실제 설정을 추가한다.
- **`src/` 하위에 stub 외의 코드 작성 금지**. 이유: 다른 step의 범위를 침범하면 AC가 중복되고 리뷰 단위가 깨진다.
- **기존 `frontend/` 또는 `backend/`의 설정을 수정하지 마라**. 이유: 이 플랜은 기존 workspace를 건드리지 않는다.
- **기존 테스트를 깨뜨리지 마라**.
