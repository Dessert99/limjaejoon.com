# Handbook 코드 스니펫 유지보수/확장 가이드

## 1) 문서 목적

이 문서는 handbook 기능의 스니펫을 안정적으로 유지보수하고, 새 카테고리/새 스니펫을 빠르게 확장하기 위한 실무 가이드다.

대상 범위:

- 콘텐츠 데이터(`lib/handbook/content/*`)
- 미리보기 스타일 엔진(`lib/handbook/preview/engine.ts`)
- 도메인 타입(`lib/handbook/types.ts`)
- 페이지 조합(`app/category/[slug]/page.tsx`)

## 2) 현재 구조 요약

핸드북 스니펫 렌더 흐름:

1. 콘텐츠 파일에서 스니펫 정의 (`content/*.ts`)
2. `SnippetSection`에서 토큰 상태 관리 (`useSnippetPlayground`)
3. `computePreviewStyles`에서 preset + token patch 병합
4. `PreviewPanel`이 인라인 스타일로 렌더

핵심 원칙:

- 컴포넌트는 토큰 의미를 몰라도 동작해야 한다.
- 토큰 의미 해석은 `preview/engine.ts`에만 둔다.

## 3) 스니펫 1개 수정 절차

### 3-1. 콘텐츠 데이터 수정

수정 파일:

- `lib/handbook/content/<category>.ts`

수정 포인트:

- `htmlCode`, `cssCode`
- `controls`의 `defaultStyleToken`
- 각 `option(..., styleToken, cssDeclarations)`

주의:

- `styleToken` 문자열은 엔진 키와 1:1 대응되어야 한다.
- `cssDeclarations`는 코드 패널 표기용이며, 실제 미리보기 동작은 엔진 패치가 결정한다.

### 3-2. 미리보기 엔진 동기화

수정 파일:

- `lib/handbook/preview/engine.ts`

수정 포인트:

- 새 기본 레이아웃이 필요하면 `presetStyleMap`에 preset 추가
- 옵션 토글이 필요하면 `previewStyleTokenMap`에 token patch 추가

권장 방식:

- preset: "초기 상태"
- token patch: "버튼 토글 시 변경분"

### 3-3. 타입 동기화

새 presetKey가 생기면 반드시:

- `lib/handbook/types.ts`의 `PreviewPresetKey` 유니온 확장

새 카테고리 slug가 생기면 반드시:

- `lib/handbook/types.ts`의 `CategorySlug` 유니온 확장

## 4) 새 스니펫 추가 체크리스트

1. `content/<category>.ts`에 스니펫 객체 추가
2. `previewPreset.presetKey`가 엔진에 존재하는지 확인
3. `controls.options.styleToken`이 엔진에 모두 존재하는지 확인
4. `mdnLinks` 추가
5. `itemCount`/`itemLabels`가 실제 렌더 의도와 맞는지 확인
6. `npm run lint`, `npm run build` 수행
7. 카테고리 페이지 수동 테스트

## 5) 새 카테고리 추가 체크리스트

1. `lib/handbook/types.ts`에 `CategorySlug` 추가
2. `lib/handbook/content/<new>.ts` 생성
3. `lib/handbook/content/index.ts` 등록
4. 필요 시 `PreviewPresetKey`/engine preset/token 확장
5. `/category/<new-slug>` 라우트 렌더 확인

## 6) 자주 발생하는 이슈와 해결

### 6-1. 버튼 클릭해도 미리보기가 안 바뀜

확인 순서:

1. `option.styleToken` 오타 여부
2. `previewStyleTokenMap`에 해당 토큰 키 존재 여부
3. patch target(`container`, `itemA` 등)이 맞는지

### 6-2. `align-content`가 안 먹는 것처럼 보임

원인:

- 멀티라인이 아니거나 컨테이너에 여유 높이가 부족하면 변화가 거의 보이지 않음

대응:

- `flex-wrap`, `itemCount`, `maxWidth`, `minHeight`를 함께 조정

### 6-3. 코드 패널은 바뀌는데 미리보기가 안 바뀜

원인:

- `cssDeclarations`만 바뀌고 엔진 토큰 패치가 누락됨

대응:

- `engine.ts` 토큰 매핑 추가

## 7) 리뷰 기준 (PR/커밋 전)

필수:

1. `npm run lint`
2. `npm run build`
3. 주요 카테고리 수동 확인 (Flex/Grid/Box/Spacing)

권장:

- 토큰 누락 검사 스크립트(추가 예정) 도입
- 시각적으로 헷갈리는 스니펫에 보조 설명(`commonMistake`) 강화

## 8) 개인 블로그 확장 대비 가이드

현재 handbook은 `lib/handbook`에 있으나, 장기적으로는 아래와 같이 이관한다.

- `domains/handbook/*`: 타입/콘텐츠/엔진
- `features/handbook/*`: UI/훅/조합

이관 원칙:

- 대규모 일괄 이동 금지
- 스니펫 단위/파일 단위로 점진 이동
- 이동 후 lint/build + 주요 시나리오 수동 검증
