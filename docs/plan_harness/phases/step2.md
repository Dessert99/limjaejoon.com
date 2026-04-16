# Step 2: git-helper

## 읽어야 할 파일

- `/docs/plan_harness/ARCHITECTURE.md` ("2단계 커밋 전략" 섹션)
- `/docs/plan_harness/ADR.md`
- `/tools/harness/src/state/schema.ts` (타임스탬프 포맷 참고용)
- `/tools/harness/tests/state/io.test.ts` (실물 I/O 테스트 스타일 참고)

git 명령을 Node `child_process`로 wrapping 한다. 브랜치 체크아웃·생성과 2단계 커밋을 제공한다.

## 작업

### 1. `tools/harness/src/git/commands.ts` 생성

다음을 export한다:

```ts
export interface GitResult {
  code: number;
  stdout: string;
  stderr: string;
}

export function runGit(args: string[], cwd: string): GitResult;

// 이미 해당 브랜치에 있으면 no-op. verify-ref로 존재 여부 확인 후 checkout 또는 checkout -b.
export function checkoutBranch(name: string, cwd: string): void;

// staged 변경이 없으면 no-op. 있으면 -m으로 커밋하고 GitResult 반환.
export function commitStaged(message: string, cwd: string): GitResult | null;

// 2단계 커밋 도우미.
//   1) 전체 stage → excludePaths 로 언스테이지 → 차이 있으면 feat 커밋
//   2) 전체 stage → 차이 있으면 chore 커밋
// 반환: { feat: 결과 or null, chore: 결과 or null }
export function twoStageCommit(opts: {
  cwd: string;
  featMessage: string;
  choreMessage: string;
  excludeFromFeat: string[]; // repo-root 기준 상대 경로
}): { feat: GitResult | null; chore: GitResult | null };
```

구현 규칙:
- `child_process.spawnSync('git', args, { cwd, encoding: 'utf8' })` 사용. shell=false 유지.
- `runGit`은 exit code 그대로 반환. 예외 던지지 않음.
- `checkoutBranch`는 git 자체가 실패하면 예외(Error)로 승격.
- 파괴적 명령(`reset --hard`, `push --force` 등) 구현 금지.

### 2. `tools/harness/tests/git/commands.test.ts` 생성

실물 git 저장소를 `tmpdir` + `git init`으로 매 테스트마다 생성한다(beforeEach).

커버 케이스:
- `runGit(['rev-parse', '--is-inside-work-tree'], cwd)`이 code=0 반환.
- `checkoutBranch('test-1', cwd)`이 신규 브랜치를 만들고 이동한다.
- 이미 `test-1`인 상태에서 `checkoutBranch('test-1', cwd)`은 예외 없이 통과한다.
- 기존 `test-1`이 있는 상태에서 재호출 시 생성이 아니라 checkout 경로로 간다.
- `commitStaged`는 staged가 없으면 null을 반환한다.
- `commitStaged`는 파일 추가 후 `git add`한 상태에서 호출하면 커밋을 만든다(로그로 확인).
- `twoStageCommit`이 excludeFromFeat 파일을 feat에서 빼고 chore로 따로 커밋한다.
- `twoStageCommit`이 feat 대상 변경이 없으면 feat=null, chore만 생성.

`process.env.GIT_AUTHOR_NAME` / `GIT_COMMITTER_NAME` 같은 env를 테스트에서 고정(예: `test`)해서 로컬 git config에 의존하지 않게 한다.

## Acceptance Criteria

```bash
npm run build -w @limjaejoon/harness
npm run test -w @limjaejoon/harness
npm run lint -w @limjaejoon/harness
```

## 검증 절차

1. AC 실행.
2. `tools/harness/src/git/commands.ts` 존재.
3. `tools/harness/tests/git/commands.test.ts` 존재, 모든 케이스 통과.
4. 2단계 커밋 시나리오가 정확히 작동함을 테스트 로그에서 확인.
5. `phases/index.json` step 2 업데이트.

## 금지사항

- **실제 프로젝트 저장소에서 테스트를 실행하지 마라**. 이유: 테스트는 `tmpdir`에 새 저장소를 만들어 격리해야 한다. 안 그러면 테스트가 실제 브랜치를 건드릴 위험.
- **`reset --hard`, `push --force`, `branch -D` 같은 파괴적 명령을 래핑하지 마라**. 이유: 이 플랜 범위 아님. 추후 필요해지면 별도 ADR.
- **`simple-git` 등 git 래퍼 라이브러리 도입 금지**. 이유: 우리가 쓰는 명령 수가 적고, shell 없는 spawnSync만으로 충분.
- **state/ 또는 claude/ 디렉터리 건드리지 마라**.
- **기존 테스트를 깨뜨리지 마라**.
