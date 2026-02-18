# Handbook Preview 구현 가이드

## 1) 문서 목적

이 문서는 handbook의 실시간 미리보기가 어떤 흐름으로 동작하는지, 그리고 새 토큰/프리셋을 안전하게 추가하는 방법을 설명한다.
기준 코드는 아래 파일이다.

- `features/handbook/preview/engine.ts`
- `features/handbook/preview/types.ts`
- `features/handbook/components/SnippetSection.tsx`
- `features/handbook/components/PreviewPanel.tsx`
- `features/handbook/css/engine.ts`

## 2) 전체 데이터 흐름

1. 사용자가 `ControlsPanel`에서 옵션 버튼 클릭
2. `useSnippetPlayground`가 `selectedTokens` 갱신
3. `SnippetSection`에서 `computePreviewStyles(snippet, selectedTokens)` 호출
4. `PreviewPanel`이 반환된 `previewStyles`를 인라인 `style`로 적용

핵심 연결점:

- 상태: `features/handbook/hooks/useSnippetPlayground.ts`
- 계산: `features/handbook/preview/engine.ts`
- 렌더: `features/handbook/components/PreviewPanel.tsx`

## 3) 엔진 구조

## 3-1. 기본 골격

엔진은 아래 순서로 동작한다.

1. `emptyStyles()`로 기본 객체 생성
2. `presetStyleMap[presetKey]` 적용
3. 각 control의 활성 토큰을 순회하며 `previewStyleTokenMap` 패치 병합
4. 예외 로직(현재는 box-shadow 3종 조합) 재계산

## 3-2. 병합 전략

- `applyPatch`는 `container/itemA/itemB/itemC` 단위로 병합한다.
- 병합은 `mergeStyle(prev, next)`의 얕은 병합을 사용한다.
- 나중 패치가 이전 패치를 덮어쓴다.

주의:

- 같은 속성을 여러 control이 건드리면 마지막으로 적용된 패치가 승리한다.

## 3-3. 타입 모델

`features/handbook/preview/types.ts` 기준:

- `PreviewStylePatch`: target별 스타일 조각
- `PreviewStyleTokenMap`: `styleToken -> PreviewStylePatch`
- `PreviewPresetStyleMap`: `presetKey -> PreviewStylePatch`
- `ResolvedPreviewStyles`: 최종 렌더 스타일

## 4) preset과 token의 역할 분리

### presetStyleMap

- 스니펫 "초기 시각 상태"를 정의
- 레이아웃 형태(예: grid/flex), 기본 gap, 기본 높이 같은 기준값 담당

### previewStyleTokenMap

- 버튼 클릭 시 바뀌는 변경분만 정의
- control option의 `styleToken`과 1:1 매핑

설계 원칙:

- preset에는 초기값
- token 패치에는 사용자 상호작용으로 바뀌는 최소 변경분

## 5) box-shadow 조합 예외 로직

`box-shadow`는 방향/blur/색상 control이 독립 토큰이라 단순 패치 누적으로는 조합값 유지가 어렵다.
그래서 엔진 마지막 단계에서 `composeBoxShadow`를 사용해 최종 문자열을 재조합한다.

관련 파일:

- `features/handbook/preview/engine.ts`
- `features/handbook/shadow/compose.ts`

동일 패턴이 필요한 새 속성(예: `transform` 조합)이 생기면 같은 구조로 후처리 단계를 추가한다.

## 6) 코드 패널 동기화와 preview 차이

preview는 `preview/engine.ts`가 책임지고,
코드 패널 문자열은 `css/engine.ts`가 책임진다.

즉, 옵션 추가 시 두 경로를 함께 점검해야 한다.

1. preview 동작: `previewStyleTokenMap` 추가
2. 코드 문자열 동기화: `cssDeclarations` 또는 `css/engine.ts` 로직 확인

## 7) 새 preview 동작 추가 절차

### 7-1. 새 preset 추가

1. `types.ts`의 `PreviewPresetKey`에 키 추가
2. `preview/engine.ts`의 `presetStyleMap`에 스타일 추가
3. 콘텐츠 스니펫의 `previewPreset.presetKey`에 지정

### 7-2. 새 token 옵션 추가

1. 콘텐츠 `options`에 `styleToken` 추가
2. `previewStyleTokenMap`에 같은 키로 패치 추가
3. UI에서 예상대로 보이는지 확인

### 7-3. 새 렌더 variant 추가 (필요 시)

1. `PreviewPreset.variant` 유니온 확장
2. `PreviewPanel.tsx`에서 variant 분기 렌더 추가
3. 해당 variant가 요구하는 스타일/데이터를 엔진에서 공급

## 8) 디버깅 가이드

### 증상 1: 버튼 클릭해도 스타일 변화가 없음

체크:

1. `styleToken` 문자열 오타
2. `previewStyleTokenMap`에 키 존재 여부
3. patch target(`container`, `itemA` 등) 맞는지

### 증상 2: 일부 값만 덮어써져야 하는데 전체가 깨짐

체크:

1. preset에서 과도하게 많은 속성을 고정했는지
2. token patch가 의도치 않게 동일 속성을 덮는지

### 증상 3: 코드 패널과 미리보기 결과가 다름

체크:

1. `cssDeclarations` 누락 여부
2. `css/engine.ts`의 특수 케이스(현재 box-shadow 조합) 반영 여부

## 9) preview 변경 후 검증 시나리오

1. 기본 렌더:
   - 각 카테고리 첫 스니펫 로드 시 기본 상태 확인
2. 토큰 토글:
   - control별 모든 옵션 클릭 시 의도한 속성만 변화하는지 확인
3. 조합 케이스:
   - box-shadow 방향/blur/색상 교차 조합 확인
4. 렌더 variant:
   - `box-model-compare` 전용 렌더 깨짐 여부 확인
5. 빌드 검증:
   - `npm run lint`
   - `npm run build`
