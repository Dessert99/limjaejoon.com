# Implementation Overview

## 1) 프로젝트 개요

이 프로젝트는 **개인 블로그 플랫폼**이며, 현재 핵심 기능은 **HTML/CSS 초심자용 인터랙티브 핸드북**입니다. 사용자는 "무엇을 하고 싶은지" 기준으로 카테고리를 선택하고, 각 스니펫에서 아래 3가지를 동시에 학습합니다.

- 코드 (HTML/CSS)
- 속성 테스트 (버튼 토글)
- 실시간 미리보기 (Live Preview)

현재 카테고리 범위:

- `Flex` (좌우, 세로 정렬하기)
- `Grid` (갤러리 모양 만들기)
- `Box` (박스 디자인 바꾸기)
- `Spacing` (여백 간격 다듬기)

추가 문서:

- 스니펫 유지보수/확장 가이드: `docs/snippet-maintenance-guide.md`
- 기술 스택 상세: `docs/tech-stack.md`

---

## 2) 기술 스택 / 라이브러리

### 프레임워크

- `Next.js 16 (App Router)`
- `React 19`
- `TypeScript`

### 스타일

- `Tailwind CSS v4` (레이아웃/유틸리티)
- `app/globals.css` (전역 토큰, 코드 하이라이트, preview 공통 스타일)

### 코드 하이라이트

- `prismjs`
- `@types/prismjs`

### 기타

- `ESLint`

---

## 3) 디렉터리 구조와 책임

```txt
app/
  page.tsx                  # 홈 페이지 (카테고리 카드 조합)
  category/[slug]/page.tsx  # 카테고리 상세 페이지 조합
  not-found.tsx             # 존재하지 않는 slug 처리
  layout.tsx
  globals.css

components/handbook/
  CategoryCard.tsx
  SnippetSection.tsx        # 스니펫 단위 조합 컴포넌트
  ControlsPanel.tsx         # 속성 토글 UI
  PreviewPanel.tsx          # 실시간 미리보기 UI
  CodePanel.tsx             # 코드 패널 + 복사
  code/
    HighlightedCode.tsx     # Prism 하이라이트
    CodeBlock.tsx

hooks/
  useSnippetPlayground.ts   # 선택 토큰 상태 / 복사 상태 관리

lib/handbook/
  types.ts                  # 도메인 타입
  data.ts                   # 카테고리 조회/맵핑
  content/
    flex.ts
    grid.ts
    box.ts
    spacing.ts              # 교육 콘텐츠 데이터
    index.ts
  preview/
    types.ts
    engine.ts               # Live Preview 스타일 계산 엔진
```

핵심 원칙:

- **페이지는 조합만 담당**
- **상태는 hook에서 관리**
- **미리보기 계산은 engine에서 관리**
- **콘텐츠는 content 파일에 분리**

---

## 4) 코드 흐름 (End-to-End)

### 4-1. 홈 진입

1. `app/page.tsx`
2. `handbookCategories`를 불러와 카드 렌더
3. 카드 클릭 시 `/category/[slug]` 이동

### 4-2. 카테고리 페이지

1. `app/category/[slug]/page.tsx`
2. `getCategoryBySlug(slug)`로 카테고리 조회
3. 없으면 `notFound()` 호출
4. 있으면 `SnippetSection`들을 map 렌더

### 4-3. 스니펫 동작

1. `SnippetSection.tsx`가 `useSnippetPlayground(snippet)` 호출
2. hook이 `selectedTokens`(선택된 styleToken) 상태를 관리
3. `computePreviewStyles(snippet, selectedTokens)` 호출
4. `PreviewPanel`이 계산된 `previewStyles`를 `style` prop으로 적용

요약:

- 버튼 클릭 → token 변경 → engine 재계산 → preview 즉시 반영

---

## 5) Live Preview 엔진 개념

### 기존 방식(문제)

- class 문자열 조합 + CSS 클래스 의존
- 데이터의 클래스와 CSS 정의가 불일치하면 preview가 깨짐

### 현재 방식

- 데이터는 `styleToken`만 보유
- 엔진은 아래 2단계로 스타일 계산
  - `presetKey` 기본 스타일 적용
  - 선택된 `styleToken` patch merge
- 최종 스타일을 `PreviewPanel`에서 인라인 `style`로 적용

엔진 파일:

- `lib/handbook/preview/engine.ts`

핵심 이점:

- 클래스 누락 이슈 구조적으로 감소
- 스니펫 확장 시 토큰 추가만으로 제어 가능

---

## 6) 콘텐츠 데이터 개념

각 스니펫은 다음 정보를 가집니다.

- `htmlCode`, `cssCode`
- `controls` (label + options + defaultStyleToken)
- `previewPreset` (`presetKey`, itemCount)
- `mdnLinks`

콘텐츠는 카테고리 파일로 분리되어 있어 유지보수가 쉽습니다.

- `lib/handbook/content/flex.ts`
- `lib/handbook/content/grid.ts`
- `lib/handbook/content/box.ts`
- `lib/handbook/content/spacing.ts`

---

## 7) 코드 하이라이트 흐름 (Prism)

1. `CodePanel`이 `CodeBlock` 사용
2. `CodeBlock`이 `HighlightedCode` 사용
3. `HighlightedCode`에서 Prism으로 `markup/css` 하이라이트
4. 토큰 색상은 `app/globals.css`의 `.token.*`에서 관리

관련 파일:

- `components/handbook/code/HighlightedCode.tsx`
- `components/handbook/code/CodeBlock.tsx`
- `app/globals.css`

---

## 8) Next.js 관점 핵심 개념

- App Router 기반 라우팅
- `generateStaticParams()`로 카테고리 페이지 SSG
- `notFound()`로 비정상 slug 처리
- 상호작용 컴포넌트만 `use client`

---

## 9) Tailwind + CSS 사용 기준

- Tailwind: 레이아웃, 간격, 타이포, 컴포넌트 배치
- globals.css: 전역 색상 토큰, 코드 하이라이트, preview 공통 스타일

현재 테마 방향:

- 딥블랙 미니멀 (`#000` 기반)
- 경계선 대비 강화
- 단일 블루 액센트

---

## 10) 확장 방법

### 새 스니펫 추가

1. 해당 카테고리 content 파일에 스니펫 객체 추가
2. 필요한 `styleToken`을 `engine.ts`에 추가
3. 필요하면 새 `presetKey`를 `types.ts`와 `engine.ts`에 추가

### 새 카테고리 추가

1. `CategorySlug` 확장 (`lib/handbook/types.ts`)
2. `lib/handbook/content/<new>.ts` 생성
3. `lib/handbook/content/index.ts`에 등록
4. 홈/사이드바는 데이터 기반이라 자동 반영

---

## 11) 로컬 검증 커맨드

```bash
npm run lint
npm run build
npm run dev
```

참고:

- 일부 샌드박스 환경에서는 Turbopack build가 권한 이슈를 낼 수 있습니다.
- 실제 로컬 터미널에서 실행하면 정상 검증됩니다.
