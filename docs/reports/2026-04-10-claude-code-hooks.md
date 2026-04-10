# Claude Code Hooks

## Claude Code Hooks란

1. Claude Code에서 hooks는 특정 시점에 자동으로 실행되는 셸 명령이다.
2. 예를 들어 "파일을 수정한 직후" 또는 "Bash 명령을 실행하기 직전" 같은 시점에 개입할 수 있다.
3. hooks가 필요한 이유는, LLM에게 "항상 이것을 해줘"라고 말해도 잊을 수 있기 때문이다.
4. hooks는 LLM이 아니라 Claude Code 하네스(harness)가 실행하므로, 빠뜨릴 가능성이 없다.
5. 일반 hooks(command, http 타입)는 셸 프로세스로 실행되어 토큰을 소비하지 않는다.
6. 단, prompt 타입과 agent 타입 hooks는 LLM 호출이 포함되어 토큰을 소비한다.
7. 우리 프로젝트에서 추가한 hooks는 모두 command 타입이므로 토큰 비용이 발생하지 않는다.

→ hooks는 "매번 확실히 실행되어야 하는 자동화"를 토큰 소비 없이 보장하는 장치다.

## Hook 설정 구조

1. hooks는 `settings.json`의 `hooks` 키 아래에 3단 구조로 설정한다.
2. 1단계는 이벤트 이름이다 — 언제 실행할지를 정한다.
3. 이벤트는 크게 세 가지 타이밍으로 나뉜다: 세션 단위, 턴 단위, 도구 단위.

    ```json
    {
      "hooks": {
        "PreToolUse": [...],   // 도구 실행 직전
        "PostToolUse": [...],  // 도구 실행 직후
        "Notification": [...]  // 알림 발생 시
      }
    }
    ```

    | 타이밍 | 이벤트 | 시점 |
    |--------|--------|------|
    | 세션 | `SessionStart` | 세션 시작/재개/clear/compact 시 |
    | 세션 | `SessionEnd` | 세션 종료 시 |
    | 턴 | `UserPromptSubmit` | 사용자 입력 직후, Claude 처리 전 |
    | 턴 | `Stop` | Claude 응답 완료 시 |
    | 턴 | `Notification` | 알림 발생 시 |
    | 도구 | `PreToolUse` | 도구 실행 직전 (차단 가능) |
    | 도구 | `PostToolUse` | 도구 실행 직후 |
    | 컨텍스트 | `PreCompact` | 컨텍스트 압축 직전 |
    | 컨텍스트 | `PostCompact` | 컨텍스트 압축 직후 |

4. 우리 프로젝트에서는 도구 단위(`PreToolUse`, `PostToolUse`)와 턴 단위(`Notification`) 이벤트를 사용했다.
5. 예를 들어 `PreToolUse`는 Claude가 도구를 호출할 때마다 매번 실행되고, `Stop`은 Claude가 한 턴의 응답을 마칠 때 한 번 실행된다.

6. 2단계는 매처(matcher)다 — 어떤 도구에 대해 실행할지 필터링한다.
4. `"Edit|Write"`는 Edit 또는 Write 도구에만 반응하고, `"Bash"`는 Bash 도구에만 반응한다.
5. 빈 문자열 `""`은 모든 도구에 반응한다.
6. 3단계는 핸들러 배열이다 — 실제로 실행할 명령을 정의한다.

    ```json
    {
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "command",
          "command": "실행할 셸 명령"
        }
      ]
    }
    ```

7. hook 스크립트는 stdin으로 JSON 데이터를 받는다 — `jq`로 파싱하여 파일 경로나 명령어를 추출한다.
8. exit code가 동작을 결정한다: `exit 0`은 허용, `exit 2`는 차단이다.
9. `exit 2`로 차단하면 stderr에 출력한 메시지가 Claude에게 차단 사유로 전달된다.
10. 설정 파일 위치에 따라 공유 범위가 달라진다.

    | 파일 | 용도 |
    |------|------|
    | `.claude/settings.json` | 프로젝트 공유용 (git 커밋) |
    | `.claude/settings.local.json` | 개인용 (gitignore 대상) |
    | `~/.claude/settings.json` | 전체 프로젝트 공통 개인 설정 |

→ hooks는 이벤트 → 매처 → 핸들러 3단 구조이며, exit code로 허용/차단을 제어한다.

## 프로젝트에 추가한 4개 Hook

1. 총 4개의 hook을 추가했고, 프로젝트 공유용 3개와 개인용 1개로 나누었다.

### 자동 포맷팅 (PostToolUse → Edit|Write)

2. 파일을 수정하면 자동으로 `npx prettier --write`가 실행된다.
3. 별도 스크립트 없이 인라인 명령으로 구현했다.

    ```bash
    filepath=$(cat | jq -r '.tool_input.file_path // empty') \
      && [ -n "$filepath" ] \
      && [ -f "$filepath" ] \
      && npx prettier --write "$filepath" 2>/dev/null || true
    ```

4. `[ -f "$filepath" ]`로 파일 존재를 확인하고, prettier가 지원하지 않는 파일은 자동으로 스킵된다.
5. `.prettierignore`에 `*.md`, `*.mdx` 등이 이미 등록되어 있어 해당 파일은 건드리지 않는다.

### 보호 파일 차단 (PreToolUse → Edit|Write)

6. `.env*`, `package-lock.json`, `.git/` 내부 파일 수정을 사전에 차단한다.
7. 스크립트 `.claude/hooks/block-protected-files.sh`에서 파일 경로를 검사한다.

    ```bash
    BASENAME=$(basename "$FILE_PATH")
    if [[ "$BASENAME" == ".env" || "$BASENAME" == .env.* ]]; then
      echo "BLOCKED: env 파일은 직접 수정해야 합니다." >&2
      exit 2
    fi
    ```

8. `basename`을 사용하여 어떤 디렉토리 깊이에 있든 `.env`, `.env.local` 등을 잡아낸다.

### 위험 명령 차단 (PreToolUse → Bash)

9. `rm -rf /`, `git push --force`, `git reset --hard` 같은 위험한 명령을 차단한다.
10. 스크립트 `.claude/hooks/block-dangerous-commands.sh`에서 명령어 패턴을 검사한다.

    ```bash
    DANGEROUS_PATTERNS=(
      "rm -rf /"
      "rm -rf ~"
      "git push --force"
      "git push -f "
      "git reset --hard"
      "git clean -fd"
    )
    for pattern in "${DANGEROUS_PATTERNS[@]}"; do
      if echo "$NORMALIZED" | grep -qi "$pattern"; then
        exit 2
      fi
    done
    ```

11. `rm -rf dist/` 같은 정상적인 삭제는 차단하지 않고, 전체 삭제(`/`, `~`, `.`)만 차단한다.
12. `tr -s '[:space:]' ' '`로 공백을 정규화하여 여러 공백이나 개행으로 우회하는 것을 방지한다.

### macOS 알림 (Notification)

13. Claude가 알림을 보낼 때 macOS 네이티브 알림을 표시한다.
14. `settings.local.json`에 설정했다 — OS 종속적이라 개인 설정으로 분리했다.

    ```bash
    if command -v osascript &>/dev/null; then
      osascript -e "display notification \"$BODY\" with title \"$TITLE\""
    fi
    ```

15. `command -v osascript` 체크로 macOS가 아닌 환경에서는 조용히 건너뛴다.

→ 자동 포맷팅, 보호 파일 차단, 위험 명령 차단, 알림 — 4개 hook이 토큰 소비 없이 안전장치와 편의 기능을 제공한다.

## 유지보수 가이드

1. hook을 추가/수정/제거하려면 두 곳을 확인해야 한다.

    | 변경 대상 | 파일 |
    |-----------|------|
    | hook 등록/해제 | `.claude/settings.json` 또는 `.claude/settings.local.json` |
    | hook 로직 수정 | `.claude/hooks/*.sh` 스크립트 |

2. 새 hook을 추가하려면 settings.json의 해당 이벤트 배열에 매처와 핸들러를 추가한다.

    ```json
    {
      "matcher": "도구이름",
      "hooks": [
        { "type": "command", "command": "실행할 명령" }
      ]
    }
    ```

3. 보호 파일 목록을 수정하려면 `block-protected-files.sh`에 조건문을 추가하거나 제거한다.
4. 위험 명령 목록을 수정하려면 `block-dangerous-commands.sh`의 `DANGEROUS_PATTERNS` 배열을 편집한다.
5. hook을 일시적으로 비활성화하려면 settings.json에서 해당 매처 블록을 제거하면 된다.
6. 전체 hooks를 한번에 끄려면 settings.json에 `"disableAllHooks": true`를 추가한다.
7. 현재 등록된 hooks를 확인하려면 Claude Code에서 `/hooks` 명령을 입력한다.
8. hooks 설정 변경은 Claude Code를 재시작해야 적용된다.

→ 설정은 settings.json에서 등록/해제하고, 로직은 `.claude/hooks/` 스크립트에서 수정한다.
