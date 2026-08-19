#!/bin/bash

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

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

BLOCKED_GIT_PATTERNS=(
  "git checkout -b"
  "git switch"
  "git branch -d"
  "git branch -D"
  "git branch -m"
  "git branch -M"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$NORMALIZED" | grep -qi "$pattern"; then
    echo "BLOCKED: 파괴적 명령 감지 ('$pattern'). 더 안전한 대안을 사용하세요." >&2
    exit 2
  fi
done

for pattern in "${BLOCKED_GIT_PATTERNS[@]}"; do
  if echo "$NORMALIZED" | grep -qi "$pattern"; then
    echo "BLOCKED: '$pattern' 는 정책상 Claude가 자동 실행할 수 없습니다. 터미널에서 사람이 직접 실행하세요." >&2
    exit 2
  fi
done

exit 0
