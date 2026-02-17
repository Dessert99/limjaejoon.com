# 기술 스택 상세 문서

## 1) 개요

이 프로젝트는 "개인 블로그 플랫폼"을 목표로 하며, 현재는 `handbook` 기능이 핵심 구현 범위다.
기술 선택 기준은 다음 3가지다.

- 빠른 실험/확장
- 타입 안정성
- UI/학습 콘텐츠 유지보수성

## 2) 런타임/프레임워크

### Next.js 16 (App Router)

사용 이유:

- 파일 기반 라우팅과 레이아웃 조합이 명확함
- SSG/SSR 선택이 쉬워 콘텐츠 페이지에 유리함
- `notFound()`, `generateStaticParams()` 같은 표준 API 제공

현재 사용 위치:

- `app/page.tsx`
- `app/category/[slug]/page.tsx`
- `app/not-found.tsx`

운영 포인트:

- 상호작용이 필요한 컴포넌트만 `use client`를 사용
- 카테고리 페이지는 `generateStaticParams()` 기반 정적 생성 우선

### React 19

사용 이유:

- 컴포넌트 기반 UI 구성
- hook 기반 상태 관리가 학습 UI와 잘 맞음

현재 사용 패턴:

- `useMemo`: 스타일 계산/코드 문자열 계산 캐싱
- `useState`: 선택된 토큰 상태 관리

## 3) 언어/타입

### TypeScript

사용 이유:

- 스니펫 스키마와 토큰 구조를 타입으로 강제
- 확장 시 누락(slug/preset/token) 리스크 감소

핵심 타입 파일:

- `lib/handbook/types.ts`
- `lib/handbook/preview/types.ts`

운영 포인트:

- 문자열 리터럴 유니온(`CategorySlug`, `PreviewPresetKey`)으로 확장 경계를 명시
- 컴포넌트 props에 도메인 타입 재사용

## 4) 스타일/UI

### Tailwind CSS v4

사용 이유:

- 레이아웃/간격/타이포를 빠르게 조립 가능
- 반복되는 유틸 패턴으로 코드 일관성 유지

현재 사용 위치:

- `app/*`, `components/*` 전반

운영 포인트:

- 레이아웃/간격/타이포는 Tailwind 우선
- 반복되는 복잡 스타일은 `globals.css`로 승격

### 전역 CSS (`app/globals.css`)

역할:

- 색상 토큰(딥블랙 + 블루 액센트)
- 미리보기 공통 클래스 (`.preview-canvas`, `.preview-item`)
- Prism 하이라이트 토큰 색상

운영 포인트:

- 공통 룩앤필은 여기서 중앙 관리
- 스니펫별 동작 스타일은 엔진 인라인 스타일로 분리

## 5) 코드 하이라이트

### PrismJS

사용 이유:

- HTML/CSS 코드 예시를 시각적으로 명확하게 제공
- 초심자 학습 UX 개선

현재 사용 위치:

- `components/handbook/code/HighlightedCode.tsx`
- `components/handbook/code/CodeBlock.tsx`

운영 포인트:

- 문법 토큰 색상은 `globals.css`의 `.token.*` 규칙에서 제어

## 6) handbook 전용 엔진 설계

### 인라인 스타일 엔진 (`lib/handbook/preview/engine.ts`)

역할:

- `presetStyleMap`: 스니펫 기본 상태
- `previewStyleTokenMap`: 토글 변경 패치
- `computePreviewStyles`: 최종 병합 결과 반환

장점:

- class 문자열 의존도 감소
- 토큰 기반 확장성 확보
- 콘텐츠 데이터와 미리보기 계산 책임 분리

주의점:

- `styleToken` 추가 시 반드시 엔진 키 동기화
- 조건부 속성(`align-content` 등)은 시각 조건까지 같이 설계

## 7) 상태 관리

### `useSnippetPlayground`

역할:

- control별 선택 토큰 상태 저장
- 토큰 선택 이벤트 핸들링

운영 포인트:

- 스니펫 단위 상태 격리
- 상위 페이지는 상태 세부 구현을 몰라도 조합 가능

## 8) 품질/검증 도구

### ESLint

목적:

- 코드 품질/규칙 위반 사전 탐지

커맨드:

```bash
npm run lint
```

### Production Build (Next build)

목적:

- 타입/번들/페이지 생성 포함 종합 검증

커맨드:

```bash
npm run build
```

## 9) 의존성 목록 (package.json 기준)

런타임 의존성:

- `next`
- `react`, `react-dom`
- `prismjs`
- `@types/prismjs`
- `framer-motion`
- `lucide-react`

개발 의존성:

- `typescript`
- `eslint`, `eslint-config-next`
- `tailwindcss`, `@tailwindcss/postcss`
- `@types/node`, `@types/react`, `@types/react-dom`

참고:

- 현재 `framer-motion`, `lucide-react`는 확장 기능(블로그/포트폴리오 UI) 대비 의존성으로 유지 가능
- 실제 미사용 상태가 길어지면 번들/관리 비용 관점에서 정리 검토

## 10) 향후 구조 전환 계획

개인 블로그 확장에 맞춰 장기적으로 다음 구조를 목표로 한다.

- `features/*`: 기능 단위 UI/상호작용
- `domains/*`: 도메인 타입/규칙/엔진
- `shared/*`: 범용 유틸/공용 모듈

이때 handbook은 아래로 분리한다.

- `features/handbook/*`
- `domains/handbook/*`

전환 전략:

- 현재 동작 보존 우선
- 기능 단위 점진 이관
- 매 단계 `lint/build` + 수동 시나리오 검증
