---
paths:
    - "**"
---

# 작업 완료 후 검증 규칙

작업이 끝나면 반드시 아래 순서로 검증한다.

### 1. CI 검사 (항상 실행)
- 프론트엔드: `npm run ci -w frontend` 실행 (lint → type-check → build 순차 실행)
- `npm run format:check` 실행하여 포맷 위반 없는지 확인 (위반 시 `npm run format`으로 자동 수정)

### 2. 영향 범위 확인
- 수정한 컴포넌트를 사용하는 페이지가 정상 렌더링되는지 확인
