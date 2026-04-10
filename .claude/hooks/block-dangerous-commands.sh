#!/bin/bash
# Hook: PreToolUse (Bash)
# 위험한 셸 명령을 차단한다.
# exit 0 = 허용, exit 2 = 차단

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# 공백 정규화
NORMALIZED=$(echo "$COMMAND" | tr -s '[:space:]' ' ')

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

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$NORMALIZED" | grep -qi "$pattern"; then
    echo "BLOCKED: 위험한 명령이 감지되었습니다 ('$pattern'). 더 안전한 대안을 사용하세요." >&2
    exit 2
  fi
done

exit 0
