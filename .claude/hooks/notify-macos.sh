#!/bin/bash
# Hook: Notification
# macOS 네이티브 알림을 전송한다.

INPUT=$(cat)
TITLE=$(echo "$INPUT" | jq -r '.title // "Claude Code"')
BODY=$(echo "$INPUT" | jq -r '.body // "Task complete"')

if command -v osascript &>/dev/null; then
  osascript -e "display notification \"$BODY\" with title \"$TITLE\""
fi

exit 0
