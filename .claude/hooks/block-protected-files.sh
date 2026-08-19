#!/bin/bash

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

BASENAME=$(basename "$FILE_PATH")

if [[ "$BASENAME" == "package-lock.json" ]]; then
  echo "BLOCKED: package-lock.json은 npm install로만 변경해야 합니다." >&2
  exit 2
fi

if [[ "$FILE_PATH" == *"/.git/"* || "$FILE_PATH" == ".git/"* ]]; then
  echo "BLOCKED: .git/ 내부 파일은 수정할 수 없습니다." >&2
  exit 2
fi

exit 0
