#!/bin/bash
# Hook: PreToolUse (Bash) — Claude의 모든 Bash 실행 직전에 호출됨.
# 권한 모드(bypassPermissions)나 --allow-dangerously-skip-permissions 플래그와
# 무관하게 동작하는 "하드 차단" 계층. exit 0 = 허용, exit 2 = 차단(사유를 모델에 전달).
# settings.json 의 permissions.deny 는 선언적 1차 방어, 이 훅이 플래그까지 막는 보장 계층.

set -euo pipefail

# stdin 으로 들어온 훅 입력 JSON → 실행하려는 셸 명령 문자열만 추출
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# 명령이 비어있으면(추출 실패 등) 판단 불가 → 통과
if [ -z "$COMMAND" ]; then
  exit 0
fi

# 줄바꿈·연속 공백을 단일 공백으로 정규화 — 패턴 매칭이 띄어쓰기에 흔들리지 않게
NORMALIZED=$(echo "$COMMAND" | tr -s '[:space:]' ' ')

# (1) 되돌리기 어려운 파괴적·비가역 명령
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \."
  "git push --force"
  "git push -f "
  "git reset --hard"
  "git clean -fd"
  "git clean -fx"
)

# (2) 사람이 직접 해야 하는 git 쓰기(push·브랜치) — Claude 자동 실행 금지(무단 변경 방지)
# 커밋은 정책상 허용 — "커밋해라" 워크플로 유지
BLOCKED_GIT_PATTERNS=(
  "git push"
  "git checkout -b"
  "git switch"
  "git branch -d"
  "git branch -D"
  "git branch -m"
  "git branch -M"
)

# 파괴적 명령 우선 검사 — 매칭되면 즉시 차단(exit 2)
for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$NORMALIZED" | grep -qi "$pattern"; then
    echo "BLOCKED: 파괴적 명령 감지 ('$pattern'). 더 안전한 대안을 사용하세요." >&2
    exit 2
  fi
done

# 정책상 사람 확인이 필요한 git 변경 검사
for pattern in "${BLOCKED_GIT_PATTERNS[@]}"; do
  if echo "$NORMALIZED" | grep -qi "$pattern"; then
    echo "BLOCKED: '$pattern' 는 정책상 Claude가 자동 실행할 수 없습니다. 터미널에서 사람이 직접 실행하세요." >&2
    exit 2
  fi
done

exit 0
