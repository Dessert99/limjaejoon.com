#!/bin/bash
# Hook: PreToolUse (Edit|Write)
# 보호 대상 파일 수정을 차단한다.
# exit 0 = 허용, exit 2 = 차단

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

BASENAME=$(basename "$FILE_PATH")

# .env, .env.* 차단
if [[ "$BASENAME" == ".env" || "$BASENAME" == .env.* ]]; then
  echo "BLOCKED: env 파일($FILE_PATH)은 직접 수정해야 합니다." >&2
  exit 2
fi

# package-lock.json 차단
if [[ "$BASENAME" == "package-lock.json" ]]; then
  echo "BLOCKED: package-lock.json은 npm install로만 변경해야 합니다." >&2
  exit 2
fi

# .git/ 내부 파일 차단
if [[ "$FILE_PATH" == *"/.git/"* || "$FILE_PATH" == ".git/"* ]]; then
  echo "BLOCKED: .git/ 내부 파일은 수정할 수 없습니다." >&2
  exit 2
fi

exit 0
