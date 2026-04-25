# Vanilla Extract 규칙

- 프론트엔드 스타일은 반드시 Vanilla Extract (`*.css.ts`)로 작성, 인라인 스타일 지양

### 1. 토큰 우선
- 색상은 반드시 `vars.color.*` 사용, 하드코딩 금지
- 폰트 크기는 반드시 `vars.fontSize.*` 사용, 하드코딩 금지
- 반경은 `vars.radius.*` 사용
- 그림자는 `vars.shadow.*` 사용

### 2. 반응형
- **Mobile-first**: base 스타일은 모바일 기준으로 작성, `bp.*`로 큰 화면을 override
- 미디어 쿼리는 반드시 `breakpoints.ts`의 `bp.*` 상수 사용 (`min-width` 기반)
- 직접 `@media (min-width: 768px)` 작성 금지