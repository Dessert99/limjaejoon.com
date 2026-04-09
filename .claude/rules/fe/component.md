---
paths:
    - "frontend/features/**/components/**"
---

# 컴포넌트 작성 규칙

- named export 사용, default export 금지
- props는 컴포넌트 위에 `interface`로 정의 (인라인 금지)
- 스타일 import는 `import * as s from './ComponentName.css'` 패턴 사용
- `'use client'`는 인터랙션(이벤트 핸들러, hooks)이 있을 때만 선언, 서버 컴포넌트가 기본
