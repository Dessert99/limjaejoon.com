---
paths:
    - "frontend/**/*.css.ts"
    - "frontend/styles/**"
---

# Vanilla Extract 규칙

### 1. 토큰 우선
- 색상은 반드시 `vars.color.*` 사용, 하드코딩 금지
- 폰트 크기는 반드시 `vars.fontSize.*` 사용, 하드코딩 금지
- 반경은 `vars.radius.*` 사용
- 그림자는 `vars.shadow.*` 사용

### 2. 반응형
- **Mobile-first**: base 스타일은 모바일 기준으로 작성, `bp.*`로 큰 화면을 override
- 미디어 쿼리는 반드시 `breakpoints.ts`의 `bp.*` 상수 사용 (`min-width` 기반)
- 직접 `@media (min-width: 768px)` 작성 금지

### 3. 재사용 패턴
- 2곳 이상에서 반복되는 스타일 조합은 `styles/utils.css.ts`로 추출
- 컴포넌트 스타일 합성은 `style([baseStyle, { ...overrides }])` 패턴 사용

### 4. 파일 위치
- 페이지 스타일: `app/[route]/[route].css.ts`
- 컴포넌트 스타일: 컴포넌트 파일과 같은 디렉토리에 `[ComponentName].css.ts`

### 5. 단순 구현 우선
- 장식 효과는 `box-shadow`, `border`, `outline`, `background` 등 단일 속성으로 먼저 시도
- `::before`/`::after`는 단일 속성으로 불가능할 때만 사용
- `transition`으로 충분하면 `keyframes` 사용 금지
- `globalStyle()`은 제어 불가 HTML(MDX 등)에만 사용, 같은 셀렉터 중복 호출 금지
