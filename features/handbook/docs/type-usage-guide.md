# Handbook 타입 사용 가이드

## 1) 문서 목적

이 문서는 `features/handbook/types.ts`를 기준으로 handbook에서 타입을 어떻게 설계하고 사용하는지 설명한다.
목표는 "새 스니펫/카테고리를 추가할 때 타입 누락으로 런타임 오류가 나지 않게 하는 것"이다.

## 2) 타입 파일과 책임

- `features/handbook/types.ts`: handbook의 핵심 도메인 타입
- `features/handbook/preview/types.ts`: preview 엔진 전용 타입

핵심 원칙:

- handbook 데이터 구조는 `HandbookCategory -> HandbookSnippet -> SnippetControl` 계층으로 고정한다.
- UI 컴포넌트는 가능한 한 `types.ts` 타입을 그대로 props에 재사용한다.
- 임의 문자열 대신 리터럴 유니온(`CategorySlug`, `PreviewPresetKey`)으로 확장 경계를 강제한다.

## 3) 핵심 타입 구조

### 3-1. 카테고리/스니펫 계층

```ts
type CategorySlug = 'flex' | 'grid' | 'border-box' | 'spacing';

interface HandbookCategory {
  slug: CategorySlug;
  snippets: HandbookSnippet[];
  // ...
}

interface HandbookSnippet {
  id: string;
  controls: SnippetControl[];
  previewPreset: PreviewPreset;
  // ...
}
```

### 3-2. Control/Option 구조

```ts
interface SnippetControlOption {
  styleToken: string;
  cssDeclarations?: Array<{ property: string; value: string }>;
}

interface SnippetControl {
  id: string;
  target: PreviewTarget; // 'container' | 'itemA' | 'itemB' | 'itemC'
  defaultStyleToken: string;
  options: SnippetControlOption[];
}
```

의도:

- `styleToken`: preview 엔진에서 실제 동작을 결정하는 키
- `cssDeclarations`: 코드 패널 문자열(`features/handbook/css/engine.ts`) 동기화용 데이터

### 3-3. PreviewPreset 타입

```ts
interface PreviewPreset {
  presetKey: PreviewPresetKey;
  variant?: 'default' | 'box-model-compare';
  itemCount?: number;
  itemLabels?: string[];
}
```

의도:

- `presetKey`: preview 초기 레이아웃 선택
- `variant`: 기본 렌더/비교 렌더 분기
- `itemCount`, `itemLabels`: 미리보기 출력 형태 조정

## 4) 실제 사용 지점

- 콘텐츠 정의: `features/handbook/content/*.ts`
- 카테고리 조회: `features/handbook/categoryRepository.ts`
- 상태 타입 사용: `features/handbook/hooks/useSnippetPlayground.ts`
- UI props 타입 사용:
  - `features/handbook/components/CategoryCard.tsx`
  - `features/handbook/components/ControlsPanel.tsx`
  - `features/handbook/components/PreviewPanel.tsx`
  - `features/handbook/components/SnippetSection.tsx`

## 5) 확장 시 타입 변경 절차

### 5-1. 새 카테고리 추가

1. `features/handbook/types.ts`의 `CategorySlug`에 slug 추가
2. `features/handbook/content/<new>.ts` 생성
3. `features/handbook/content/index.ts`에 등록
4. `features/handbook/categoryRepository.ts`의 `categoryMap`에 slug 매핑 추가

### 5-2. 새 preset 추가

1. `features/handbook/types.ts`의 `PreviewPresetKey` 유니온에 키 추가
2. `features/handbook/preview/engine.ts`의 `presetStyleMap`에 동일 키 추가
3. 콘텐츠에서 `previewPreset.presetKey`에 같은 키 사용

### 5-3. 새 option 토큰 추가

1. 콘텐츠의 `option(..., styleToken, cssDeclarations)`에 토큰 정의
2. `features/handbook/preview/engine.ts`의 `previewStyleTokenMap`에 같은 토큰 키 추가
3. 코드 패널 동기화가 필요하면 `cssDeclarations`도 함께 작성

## 6) 타입 설계 규칙

- `styleToken` 문자열은 "의미 기반"으로 네이밍한다.
- `defaultStyleToken`은 반드시 `options.styleToken` 중 하나와 일치해야 한다.
- `target`은 설명 메타 성격이므로 렌더 동작 책임은 엔진 쪽에 둔다.
- 신규 타입은 먼저 `types.ts`에 추가하고, 컴포넌트에서 중복 타입 선언을 만들지 않는다.

## 7) 자주 나는 오류와 해결

### 오류 1: `presetKey` 타입 에러

원인:

- `PreviewPresetKey` 유니온에 키를 추가하지 않음

해결:

- `features/handbook/types.ts`에 키 추가 후 `preview/engine.ts`와 콘텐츠를 동기화

### 오류 2: UI 버튼은 보이는데 preview가 안 바뀜

원인:

- `styleToken`은 추가했지만 `previewStyleTokenMap` 누락

해결:

- `features/handbook/preview/engine.ts`에 토큰 매핑 추가

### 오류 3: 코드 패널만 바뀌고 preview는 안 바뀜

원인:

- `cssDeclarations`만 수정하고 preview 엔진 패치를 수정하지 않음

해결:

- 콘텐츠 + preview 엔진 + (필요 시) css 엔진까지 같이 확인

## 8) 타입 변경 후 최소 검증

1. `npm run lint`
2. `npm run build`
3. 수동 확인:
   - `/category/flex`
   - `/category/grid`
   - `/category/border-box`
   - `/category/spacing`
