# Handbook 유지보수 및 확장 가이드

## 1) 문서 목적

이 문서는 handbook 기능을 장기적으로 유지보수할 때 필요한 작업 순서, 확장 규칙, 검증 기준을 정의한다.
목표는 "스니펫 추가/수정이 빠르고 안전하게 이루어지는 운영 루틴"을 만드는 것이다.

## 2) 현재 기준 구조

handbook 관련 코드는 모두 `features/handbook/*` 아래에 둔다.

- `components/*`: UI/렌더
- `hooks/*`: 상호작용 상태
- `content/*`: 학습 콘텐츠 데이터
- `preview/*`: 미리보기 계산 엔진
- `css/*`: 코드 패널 문자열 계산
- `types.ts`, `data.ts`: 타입/조회
- `boxModel/*`, `shadow/*`: 계산 보조 유틸
- `docs/*`: handbook 전용 문서

규칙:

- 폴더명 `domain`은 사용하지 않는다.
- handbook 전용 로직을 다른 최상위 폴더로 분산하지 않는다.

## 3) 일상 유지보수 루틴

### 3-1. 스니펫 텍스트/라벨 수정

수정 파일:

- `features/handbook/content/<category>.ts`

확인 항목:

- `title`, `learningGoal`, `conceptSummary`, `commonMistake`, `useCaseHint`
- `mdnLinks`
- UI 문구 길이(초심자 기준으로 짧고 명확한지)

### 3-2. 옵션 값(토큰) 수정

수정 파일:

- `features/handbook/content/<category>.ts`
- `features/handbook/preview/engine.ts`
- 필요 시 `features/handbook/css/engine.ts`

확인 항목:

- `styleToken`과 엔진 키 일치
- `defaultStyleToken` 유효성
- 코드 패널 문자열 반영 필요 여부

### 3-3. 시각 스타일 공통 조정

수정 파일:

- `app/globals.css`
- 필요 시 handbook 컴포넌트 스타일 클래스

확인 항목:

- preview 공통 클래스(`preview-canvas`, `preview-item`) 영향 범위
- 코드 하이라이트 토큰 색상 영향 범위

## 4) 확장 작업 가이드

## 4-1. 새 스니펫 추가

1. 카테고리 콘텐츠 파일에 스니펫 객체 추가
2. `previewPreset.presetKey`가 `PreviewPresetKey` 및 엔진과 일치하는지 확인
3. control option `styleToken`을 엔진 매핑에 추가
4. 코드 패널 반영이 필요하면 `cssDeclarations` 작성
5. `mdnLinks` 추가
6. 수동 시나리오 + lint/build 검증

## 4-2. 새 카테고리 추가

1. `features/handbook/types.ts`의 `CategorySlug` 확장
2. `features/handbook/content/<new>.ts` 생성
3. `features/handbook/content/index.ts` 등록
4. `features/handbook/data.ts`의 `categoryMap` 등록
5. `app/category/[slug]/page.tsx`에서 SSG/404 동작 확인

## 4-3. 새 preview variant 추가

1. `features/handbook/types.ts`의 `PreviewPreset.variant` 확장
2. `features/handbook/components/PreviewPanel.tsx` 분기 추가
3. variant 전용 계산이 필요하면 `preview/engine.ts` 또는 보조 유틸 추가
4. 기존 variant 회귀 테스트 수행

## 5) 리뷰 체크리스트 (PR 전)

기능 정확성:

1. token 클릭 시 preview 변화가 의도대로 일어나는가
2. 코드 패널 문자열과 preview 결과가 개념적으로 일치하는가
3. 기본 렌더(`defaultStyleToken`)가 학습 의도와 맞는가

데이터 정확성:

1. `styleToken` 누락/오타가 없는가
2. `presetKey`가 타입/엔진/콘텐츠에서 일관적인가
3. `categoryMap`과 실제 content 배열이 일치하는가

문서/품질:

1. 변경된 규칙을 `features/handbook/docs/*`에 반영했는가
2. `npm run lint` 통과
3. `npm run build` 통과

## 6) 자주 발생하는 리스크와 예방책

### 리스크 1: 토큰 추가 후 일부 화면만 갱신됨

원인:

- content, preview, css 중 한 축만 수정

예방:

- "토큰 변경 3점 체크" 루틴 적용
  - content 옵션
  - preview 엔진 매핑
  - code 문자열 동기화 여부

### 리스크 2: 카테고리 slug 추가 후 404/빌드 오류

원인:

- `CategorySlug`와 `categoryMap` 불일치

예방:

- 새 카테고리 작업 시 `types.ts -> content/index.ts -> data.ts` 순서를 고정

### 리스크 3: 학습 의도와 초기 미리보기 불일치

원인:

- `defaultStyleToken`과 `preset` 초기값이 충돌

예방:

- 스니펫 추가 시 "첫 렌더 상태 스크린샷/수동 확인"을 PR 체크리스트에 포함

## 7) 운영 정책

- handbook 관련 문서의 단일 소스는 `features/handbook/docs/*`다.
- handbook 구조/규칙 변경 시 아래 3개 문서를 항상 동기화한다.
  - `features/handbook/docs/type-usage-guide.md`
  - `features/handbook/docs/preview-implementation-guide.md`
  - `features/handbook/docs/maintenance-extension-guide.md`

## 8) 변경 후 최소 확인 명령

```bash
npm run lint
npm run build
```

수동 확인 경로:

- `/category/flex`
- `/category/grid`
- `/category/border-box`
- `/category/spacing`
