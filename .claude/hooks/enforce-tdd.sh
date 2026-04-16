#!/bin/bash
# Hook: PreToolUse (Edit|Write|MultiEdit)
# 테스트 파일 없이 구현 파일을 수정하려 할 때 차단한다. (TDD 강제)
# exit 0 = 허용, exit 2 = 차단
#
# 대상 경로:
#   - frontend/features/**   → frontend/tests/features/**/<name>.test.{ts,tsx}
#   - backend/src/**         → co-located <name>.spec.ts
# 제외:
#   - 테스트 파일 자체 (*.test.*, *.spec.*)
#   - 타입 정의 (*.d.ts)
#   - Vanilla Extract 스타일 (*.css.ts)
#   - docs/, tests/, e2e/ 하위

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# 프로젝트 루트 기준 상대 경로로 변환
case "$FILE_PATH" in
  "$PROJECT_DIR"/*) REL="${FILE_PATH#$PROJECT_DIR/}" ;;
  /*) REL="$FILE_PATH" ;;
  *) REL="$FILE_PATH" ;;
esac

BASENAME=$(basename "$REL")

# 테스트 파일 자체 / d.ts / css.ts 는 통과
case "$BASENAME" in
  *.test.ts|*.test.tsx|*.spec.ts|*.spec.tsx) exit 0 ;;
  *.d.ts) exit 0 ;;
  *.css.ts) exit 0 ;;
esac

# 디렉터리 기반 제외
case "$REL" in
  docs/*|*/docs/*) exit 0 ;;
  frontend/tests/*|frontend/e2e/*) exit 0 ;;
esac

# 확장자 제한: ts/tsx 만 검사
case "$BASENAME" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# 대상 경로 판별 + 테스트 경로 계산
TEST_PATH=""
case "$REL" in
  frontend/features/*)
    # frontend/features/<sub>/foo.ts  →  frontend/tests/features/<sub>/foo.test.ts
    # frontend/features/<sub>/foo.tsx →  frontend/tests/features/<sub>/foo.test.tsx
    SUB="${REL#frontend/features/}"
    EXT="${BASENAME##*.}"
    STEM="${SUB%.*}"
    TEST_PATH="frontend/tests/features/${STEM}.test.${EXT}"
    ;;
  backend/src/*)
    # backend/src/foo.ts → backend/src/foo.spec.ts (co-located)
    STEM="${REL%.*}"
    TEST_PATH="${STEM}.spec.ts"
    ;;
  *)
    exit 0
    ;;
esac

if [ -f "$PROJECT_DIR/$TEST_PATH" ]; then
  exit 0
fi

cat >&2 <<EOF
BLOCKED: TDD 위반 — 대응 테스트 파일이 없습니다.
  구현 파일: $REL
  필요한 테스트: $TEST_PATH
먼저 실패하는 테스트를 작성한 뒤 구현하세요.
EOF
exit 2
