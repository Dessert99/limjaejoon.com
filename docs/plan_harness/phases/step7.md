# Step 7: cli-root-integration

## 읽어야 할 파일

- `/docs/plan_harness/PRD.md` (핵심 기능 #1, #5의 `--push`)
- `/docs/plan_harness/ARCHITECTURE.md` ("execute.ts" 섹션)
- `/tools/harness/src/execute.ts`
- `/tools/harness/src/orchestrator/loop.ts`
- `/tools/harness/src/git/commands.ts`
- `/package.json` (루트)

CLI 인자 파싱·`--push` 처리·루트 `package.json` 스크립트 연결을 완성한다. `npm run harness <plan-dir-name> [--push]`로 실행 가능해진다.

## 작업

### 1. `tools/harness/src/execute.ts` 확장

CLI 진입점을 완성한다. 외부 라이브러리 도입 없이 `process.argv`만 파싱한다.

```ts
// 기존 runHarness(planDirName)를 재사용하되 옵션을 확장.
export function runHarness(opts: { planDirName: string; push: boolean }): number;
// 반환값: process exit code (0=성공, 1=error, 2=blocked).

// CLI 엔트리 — 파일을 tsx로 직접 실행했을 때만 동작.
// 인자 없이 호출되면 usage를 stderr로 찍고 exit 1.
// 플래그: --push (push 활성화). 알 수 없는 플래그는 에러.
// 인자: 첫 번째 non-flag 토큰 = plan-dir-name.
```

엔트리 가드 패턴(ESM):

```ts
import { fileURLToPath } from 'node:url';

const isCli = process.argv[1] === fileURLToPath(import.meta.url);
if (isCli) {
  const code = runHarness(parseArgv(process.argv.slice(2)));
  process.exit(code);
}
```

`--push` 처리:
- 모든 step completed 이후 `git push -u origin feat-<planDirName>` 실행.
- 실패 시 stderr에 git 에러를 흘리고 exit 1.
- plan이 error 또는 blocked로 끝나면 push하지 않음(당연).

**보안/안정성 규칙**:
- `plan-dir-name`에 `..` 또는 `/` 포함 금지(경로 traversal 방지). 정규식 `/^[a-z0-9_-]+$/i` 위배 시 거부.
- `docs/<plan-dir-name>/phases/index.json`이 없으면 친절한 에러로 종료(`ERROR: phases/index.json not found. Did you run /harness first?`).

### 2. 루트 `package.json` 갱신

```json
{
  "scripts": {
    "harness": "tsx tools/harness/src/execute.ts"
  },
  "devDependencies": {
    "tsx": "^<최신>"
  }
}
```

- `tsx`는 루트 devDependency로 설치한다(워크스페이스 경계를 넘는 엔트리이므로 루트에 두는 게 자연스러움).
- 기존 `test:fe`, `test:be` 스크립트는 **건드리지 마라**.
- `npm run harness <name>`을 `npm run harness -- <name>` 없이도 돌아가게 하려면 스크립트 뒤에 `--` 생략해도 인자가 전달되도록 npm 8+ 기본 동작을 활용(테스트해볼 것).

### 3. `tools/harness/tests/execute.test.ts` (또는 loop.test.ts 확장)

argv 파싱 유닛 테스트:
- `parseArgv([])` → usage 에러 메시지로 throw.
- `parseArgv(['plan_harness'])` → `{ planDirName: 'plan_harness', push: false }`.
- `parseArgv(['plan_harness', '--push'])` → push=true.
- `parseArgv(['--push', 'plan_harness'])` → 순서 무관하게 파싱.
- `parseArgv(['plan_harness', '--unknown'])` → 에러.
- `parseArgv(['../etc'])` → 정규식 위배로 에러.

push 경로는 runHarness를 모의 OrchestratorContext로 호출해 push 함수가 최종 시점에 호출되는지만 확인. 실제 `git push`는 호출하지 말고 `pushBranch` 함수도 주입 가능하게 만들어라(스파이).

## Acceptance Criteria

```bash
npm install
npm run build -w @limjaejoon/harness
npm run test -w @limjaejoon/harness
npm run lint -w @limjaejoon/harness
# CLI 동작 확인 — 실행만 하고 실제 Claude 호출 전에 usage/validation 걸리는지 체크
npm run harness 2>&1 | grep -qi 'usage\|error'
npm run harness ../bad 2>&1 | grep -qi 'invalid'
```

## 검증 절차

1. AC 실행(특히 마지막 2개 grep 라인).
2. `npm run harness plan_harness` 호출해서 step 0이 **실제로** 시작되는 것처럼 보이지 않도록(이 step에서는 아직 실제 실행은 하지 않는다 — smoke-test step 9에서 처리) 확인. 이 step의 CLI 호출은 validation까지만 돌리고 실제 Claude invoke는 안 하도록 환경변수 `HARNESS_DRY_RUN=1`를 구현할지는 재량. 다만 **의도치 않게 실제 claude -p가 호출되지 않도록** 개발자가 조심.
3. `phases/index.json` step 7 업데이트.

## 금지사항

- **`yargs`, `commander`, `minimist` 등 argv 파서 라이브러리 도입 금지**. 이유: 플래그 1개 + 인자 1개라 수동 파싱으로 충분.
- **`--push` 기본값을 true로 바꾸지 마라**. 이유: 의도치 않은 원격 변경은 위험.
- **`--force` 같은 destructive 플래그 추가 금지**. 범위 외.
- **기존 `test:fe`, `test:be`, `build:fe`, `build:be`, `dev:fe`, `dev:be` 스크립트를 건드리지 마라**.
- **`tsx`를 프로덕션 dependency로 설치하지 마라**. devDependency만.
- **기존 테스트를 깨뜨리지 마라**.
