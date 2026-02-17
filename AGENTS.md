## 프로젝트 목적

- 이 프로젝트는 **개인 블로그 플랫폼**이다.
- `handbook`은 여러 기능 중 하나이며, 이후 `blog`, `portfolio`, `about`, `lab` 같은 섹션으로 확장한다.
- 핵심 목표는 "콘텐츠(글/프로젝트) + 인터랙티브 학습(핸드북)"을 하나의 일관된 경험으로 제공하는 것이다.

## 현재 범위

- 구현 완료 범위(1차): HTML/CSS 인터랙티브 핸드북
- 상세 페이지 레이아웃: 좌측 `코드` + 우측 `실시간 미리보기` + `속성 테스트`
- 미리보기 엔진: 클래스 문자열 조합이 아닌 `인라인 스타일 엔진`

## 아키텍처 방향 (중요)

- 기존 `lib/*` 중심 구조를 점진적으로 `features/*`, `domains/*` 중심으로 전환한다.
- 다만 대규모 이동 리스크를 줄이기 위해 **점진 마이그레이션**을 적용한다.

### 권장 디렉터리 모델

- `app/*`: 라우팅/페이지 조합 (App Router)
- `features/*`: 사용자 기능 단위 UI + 기능 훅 + feature 전용 로직
- `domains/*`: 도메인 모델/타입/순수 비즈니스 규칙
- `shared/*` (또는 최소 `lib/shared/*`): 공용 유틸, 프레임워크 비의존 함수

### handbook의 목표 구조

1. `features/handbook/*`: 섹션 UI, 상호작용 훅, feature 조합
2. `domains/handbook/*`: snippet/category 타입, content 스키마, preview 계산 규칙
3. `shared/*`: 공용 스타일 유틸/문자열 유틸 등 재사용 코드

## 마이그레이션 원칙 (`lib` → `features/domain`)

- 한 번에 전체 이동하지 않는다.
- 기능 단위로 "복사 → 참조 전환 → 안정화 → 기존 경로 제거" 순서로 옮긴다.
- 경로 이동 시 import만 바꾸지 말고 책임도 함께 정리한다.

### 권장 순서

1. `lib/handbook/types.ts` → `domains/handbook/types.ts`
2. `lib/handbook/content/*` → `domains/handbook/content/*`
3. `lib/handbook/preview/*` → `domains/handbook/preview/*`
4. `hooks/useSnippetPlayground.ts` → `features/handbook/hooks/*`
5. `components/handbook/*` → `features/handbook/components/*`
6. 페이지(`app/*`) import를 새 경로로 교체
7. 마지막에 `lib/handbook/*` 제거

## 핵심 설계 원칙

### 1) 단일 책임 원리 (SRP)

- `app/*`: 조합과 라우팅만 담당
- `features/*`: 사용자 상호작용/뷰 조합 담당
- `domains/*`: 비즈니스 규칙/계산/타입 담당
- UI 컴포넌트는 렌더링 책임만 가지며 계산 로직을 최소화

### 2) 유지보수성

- 카테고리/스니펫 추가 시 콘텐츠 파일 수정만으로 확장 가능해야 한다.
- 스타일 토큰(`styleToken`) 해석은 엔진에서만 수행한다.
- 공통 UI(색상/경계/코드 하이라이트)는 `app/globals.css`에서 중앙 관리한다.

### 3) 확장성

- 블로그/포트폴리오 기능 추가 시 handbook과 결합하지 않고 feature를 분리한다.
- 도메인 타입은 feature 전반에서 재사용하고 중복 타입 생성을 피한다.

### 4) 주석

- 초심자/미래 유지보수자를 위해 "왜 이렇게 동작하는지" 중심 주석을 충분히 남긴다.
- 단순 대입 설명 주석은 지양하고, 분기/병합/예외 의도 위주로 작성한다.

## 디렉터리 책임 (현재 + 전환 기준)

- `app/page.tsx`: 홈 페이지 조합
- `app/category/[slug]/page.tsx`: handbook 카테고리 페이지 조합
- `components/handbook/*`: (현재) handbook UI 표현 컴포넌트
- `hooks/useSnippetPlayground.ts`: (현재) handbook 상호작용 상태
- `lib/handbook/content/*`: (현재) 교육 콘텐츠 데이터
- `lib/handbook/preview/engine.ts`: (현재) 미리보기 스타일 계산 엔진
- `lib/handbook/types.ts`: (현재) 도메인 타입
- `features/*`, `domains/*`: (목표) 신규/이관 코드는 우선 배치

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
- 컴포넌트 props는 도메인 타입을 재사용한다.
- 변경 시 최소 검증:

1. `npm run lint`
2. `npm run build`
3. handbook 주요 카테고리 수동 확인(Flex/Grid/Box/Spacing)

## 문서화 규칙

- 구현 변경 시 `docs/*` 문서도 함께 업데이트한다.
- 특히 handbook은 아래 문서를 기준으로 동기화한다.
  - `docs/snippet-maintenance-guide.md`
  - `docs/tech-stack.md`

## 향후 개선 백로그

- handbook 난이도/학습 경로(입문 → 응용) 표시
- 미리보기 상태 URL 공유
- 키보드 접근성 강화
- 다국어(ko/en) 콘텐츠 분리
- 블로그 글/포트폴리오 데이터 모델 분리 및 검색 기능
