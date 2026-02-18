## 프로젝트 목적

- 이 프로젝트는 **개인 블로그 플랫폼**이다.
- `handbook`은 여러 기능 중 하나이며, 이후 `blog`, `portfolio`, `about`, `lab` 같은 섹션으로 확장한다.
- 핵심 목표는 "콘텐츠(글/프로젝트) + 인터랙티브 학습(핸드북)"을 하나의 일관된 경험으로 제공하는 것이다.

## 현재 범위

- 구현 완료 범위(1차): HTML/CSS 인터랙티브 핸드북
- 상세 페이지 레이아웃: 좌측 `코드` + 우측 `실시간 미리보기` + `속성 테스트`
- 미리보기 엔진: 클래스 문자열 조합이 아닌 `인라인 스타일 엔진`

## 아키텍처 방향 (중요)

- 구조 기준은 `features/*` 중심으로 통일한다.
- handbook 관련 코드는 `features/handbook/*` 내부에 응집한다.
- `domain` 폴더 이름은 사용하지 않는다.
- 교차 feature 공통화가 필요할 때만 `shared/*`로 승격한다.
- `domains/*`를 별도 최상위 폴더로 강제하지 않는다.

### 권장 디렉터리 모델

- `app/*`: 라우팅/페이지 조합 (App Router)
- `features/*`: 기능 단위 UI + 상태 + 데이터 + 계산 로직
- `shared/*`: 공용 유틸/공용 타입/재사용 로직

### handbook 목표 구조

1. `features/handbook/components/*`: UI 표현/섹션 조합
2. `features/handbook/hooks/*`: 상호작용 상태
3. `features/handbook/content/*`: 스니펫/카테고리 콘텐츠
4. `features/handbook/preview/*`: 미리보기 스타일 계산
5. `features/handbook/css/*`: 코드 패널용 CSS 문자열 계산
6. `features/handbook/{types.ts,data.ts}`: 타입/조회 유틸
7. `features/handbook/{boxModel/*,shadow/*}`: 계산 보조 유틸

## 마이그레이션 원칙 (`lib` → `features/handbook`)

- 한 번에 전체 이동하지 않는다.
- 기능 단위로 "복사 → 참조 전환 → 안정화 → 기존 경로 제거" 순서로 옮긴다.
- 경로 이동 시 import만 바꾸지 말고 책임도 함께 정리한다.

### 권장 순서

1. `lib/handbook/types.ts` → `features/handbook/types.ts`
2. `lib/handbook/content/*` → `features/handbook/content/*`
3. `lib/handbook/preview/*` → `features/handbook/preview/*`
4. `lib/handbook/css/*`, `lib/handbook/data.ts`, `lib/handbook/{boxModel,shadow}/*` → `features/handbook/*` 하위 적절 위치
5. `hooks/useSnippetPlayground.ts` → `features/handbook/hooks/*`
6. `components/handbook/*` → `features/handbook/components/*`
7. 페이지(`app/*`) import를 새 경로로 교체한 뒤 기존 경로 제거

## 핵심 설계 원칙

### 1) 단일 책임 원리 (SRP)

- `app/*`: 조합과 라우팅만 담당
- `features/handbook/components/*`: 사용자 상호작용/뷰 렌더링 담당
- `features/handbook/hooks/*`: 상태 관리 담당
- `features/handbook/content|preview|css|types|data`: 콘텐츠/계산/타입 담당
- UI 컴포넌트는 렌더링 책임만 가지며 계산 로직을 최소화

### 2) 유지보수성

- 카테고리/스니펫 추가 시 콘텐츠 파일 수정만으로 확장 가능해야 한다.
- 스타일 토큰(`styleToken`) 해석은 엔진에서만 수행한다.
- 공통 UI(색상/경계/코드 하이라이트)는 `app/globals.css`에서 중앙 관리한다.

### 3) 확장성

- 블로그/포트폴리오 기능 추가 시 handbook과 결합하지 않고 feature를 분리한다.
- 타입/로직은 우선 feature 내부에서 재사용하고 중복 생성을 피한다.
- 교차 feature 재사용이 확인되면 `shared/*`로 승격한다.

### 4) 주석

- 초심자/미래 유지보수자를 위해 "왜 이렇게 동작하는지" 중심 주석을 충분히 남긴다.
- 단순 대입 설명 주석은 지양하고, 분기/병합/예외 의도 위주로 작성한다.

## 디렉터리 책임 (현재 + 전환 기준)

- `app/page.tsx`: 홈 페이지 조합
- `app/category/[slug]/page.tsx`: handbook 카테고리 페이지 조합
- `components/handbook/*`: (현재) handbook UI 컴포넌트
- `hooks/useSnippetPlayground.ts`: (현재) handbook 상호작용 상태
- `lib/handbook/*`: (현재) 타입/콘텐츠/엔진/유틸
- `features/handbook/components/*`: (목표) handbook UI 컴포넌트
- `features/handbook/hooks/*`: (목표) handbook 상호작용 상태
- `features/handbook/content/*`: (목표) 교육 콘텐츠 데이터
- `features/handbook/preview/*`: (목표) 미리보기 스타일 계산 엔진
- `features/handbook/css/*`: (목표) 코드 패널 CSS 계산 엔진
- `features/handbook/{types.ts,data.ts}`: (목표) 도메인 타입/조회
- `features/handbook/{boxModel/*,shadow/*}`: (목표) 계산 보조 유틸

## Next.js 가이드

- App Router 기준으로 페이지는 가능하면 Server Component를 유지한다.
- 사용자 상호작용이 필요한 부분만 `use client`를 사용한다.
- 동적 세그먼트는 `generateStaticParams`를 우선 검토한다.
- 존재하지 않는 slug는 `notFound()`로 처리한다.

## Tailwind/CSS 가이드

- 레이아웃/간격/타이포는 Tailwind 유틸리티 우선
- 코드 하이라이트/미리보기 베이스 스타일은 `globals.css`에 공통 정의
- 색상은 딥블랙 팔레트 중심(`#000`, `#111`, `#1a1a1a`, `#2a2a2a`)
- 액센트 컬러는 단일 블루 계열 유지

## 코드 품질 규칙

- UI 텍스트는 초심자 관점에서 짧고 명확하게 작성한다.
- 컴포넌트 props는 feature 내부 타입을 재사용한다.
- 변경 시 최소 검증:

1. `npm run lint`
2. `npm run build`
3. handbook 주요 카테고리 수동 확인(Flex/Grid/Box/Spacing)

## 문서화 규칙

- handbook 구현 변경 시 `features/handbook/docs/*` 문서를 함께 업데이트한다.
- handbook 문서는 아래 3개를 단일 기준 문서로 유지한다.
  - `features/handbook/docs/type-usage-guide.md`
  - `features/handbook/docs/preview-implementation-guide.md`
  - `features/handbook/docs/maintenance-extension-guide.md`

## 향후 개선 백로그

- handbook 난이도/학습 경로(입문 → 응용) 표시
- 미리보기 상태 URL 공유
- 키보드 접근성 강화
- 다국어(ko/en) 콘텐츠 분리
- 블로그 글/포트폴리오 데이터 모델 분리 및 검색 기능
