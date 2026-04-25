#!/usr/bin/env bash
# docs/plans/<plan>/* 파일 변경 시 plans-index.json을 자동 갱신한다.
# - active: 방금 만진 plan으로 설정
# - plans: 현재 docs/plans/ 안의 모든 plan 폴더와 동기화

set -e

filepath=$(jq -r '.tool_input.file_path // empty')
[[ -z "$filepath" ]] && exit 0

# docs/plans/<plan>/ 경로 외에는 무시
[[ "$filepath" != *"/docs/plans/"* ]] && exit 0

# plans-index.json 자체 변경은 무시 (무한 루프 방지)
[[ "$filepath" == *"/docs/plans/plans-index.json" ]] && exit 0

plan_id=$(echo "$filepath" | sed -E 's|.*/docs/plans/([^/]+)(/.*)?$|\1|')

# 잘못된 경로 (docs/plans/ 바로 아래 파일 등)는 무시
[[ -z "$plan_id" || "$plan_id" == "$filepath" ]] && exit 0
[[ "$plan_id" == _* ]] && exit 0

indexfile="$CLAUDE_PROJECT_DIR/docs/plans/plans-index.json"
plans_dir="$CLAUDE_PROJECT_DIR/docs/plans"

[[ ! -f "$indexfile" ]] && exit 0
[[ ! -d "$plans_dir/$plan_id" ]] && exit 0

# Python으로 JSON 안전하게 갱신
python3 - "$indexfile" "$plans_dir" "$plan_id" <<'PY'
import json, os, sys
from datetime import datetime, timezone

idx_path, plans_dir, active_id = sys.argv[1:4]
now = datetime.now(timezone.utc).isoformat(timespec="seconds")

with open(idx_path) as f:
    data = json.load(f)

# 현재 디스크의 plan 폴더 목록 (_ 시작 제외)
disk_plans = sorted(
    d for d in os.listdir(plans_dir)
    if os.path.isdir(os.path.join(plans_dir, d)) and not d.startswith("_")
)

existing = {p["id"]: p for p in data.get("plans", [])}
plans = []
for pid in disk_plans:
    if pid in existing:
        plans.append(existing[pid])
    else:
        plans.append({"id": pid, "created_at": now})

data["plans"] = plans
data["active"] = active_id
data["updated_at"] = now

with open(idx_path, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")
PY

exit 0
