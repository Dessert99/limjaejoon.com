# 프론트엔드 아키텍처 지침

프론트엔드 계층별 책임과 분리 기준의 단일 출처. 폴더 위치와 파일명은 [folder-structure.md](./folder-structure.md), API/TQ hook 규칙은 [api-convention.md](./api-convention.md)를 따른다. 이 문서는 그 위에서 "어떤 책임이 어느 segment 것이고, 언제 분리하는가"를 정한다.

신규 기능·리팩터링·테스트 작성 전, 한 파일이나 함수에 변경 이유가 여러 개 섞이는지 판단할 때 참고한다.

서버 통신·상태 coordinator·payload workflow 관련 절은 서버 연동 기능이 생겼을 때 적용된다. 정적 콘텐츠 위주 화면에서는 §1·§3·§4가 주로 쓰인다.

## 1. 핵심 원칙

파일을 나누는 기준은 줄 수가 아니라 **변경 이유**다.

같은 화면에 속하더라도 아래 변경 이유가 섞이면 분리 후보로 본다.

- 서버 계약 변경: endpoint, 응답 shape, queryKey, invalidate 정책.
- 도메인 규칙 변경: 상태 판정, 정렬, 필터, payload 생성.
- UI 상태 변경: 입력 중 값, 선택 상태, pagination, modal, optimistic state.
- 렌더링 변경: 마크업, 스타일, 표시 문구, empty/loading/error view.

좋은 분리는 "파일이 작다"가 아니라 "어디를 고쳐야 하는지 바로 보인다"에 가깝다.

## 2. 계층별 책임

각 책임이 어느 segment 에 속하는지 아래에서 정한다. segment 의 위치·명명 정의 자체는 folder-structure.md 가 출처다.

`model/` 은 상태 coordinator hook 과 도메인 타입·스키마를 함께 품지만, 같은 segment 안의 **다른 파일**로 나눈다.

### app page → `app/`

`app/(group)/.../page.tsx` 는 라우트 경계다.

- params/searchParams 읽기.
- 잘못된 입력, 권한, route gate 처리.
- feature 컴포넌트와 횡단 wrapper 조합.

도메인 데이터 변환, API 응답 해석, 복잡한 이벤트 흐름은 두지 않는다.

### page client → `features/{slice}/ui/`

라우트 본문을 구성하는 feature 컴포넌트다.

- 필요한 query/mutation hook 호출.
- 에러/not-found/loading shell 분기.
- 도메인 hook 과 하위 컴포넌트 조합.

page client 가 커지면 "데이터 소유", "화면 배치", "사용자 액션" 이 섞였는지 먼저 확인한다.

### component → `features/{slice}/ui/`

컴포넌트는 렌더링과 사용자 이벤트 연결을 우선한다.

- props 를 표시한다.
- click/change/select 같은 이벤트를 callback 으로 올린다.
- 짧은 렌더 헬퍼와 표시용 분기는 허용한다.

컴포넌트가 API 응답 shape 을 직접 해석하거나 저장 payload 를 깊게 조립하기 시작하면 `model/` 또는 `lib/` 로 옮긴다.

### api query/mutation hook → `features/{slice}/api/`

`features/{slice}/api` 는 서버 통신 계약을 담당한다. 요청 함수·query 팩토리·훅은 관심사별 파일로 나눈다 (folder-structure.md §2).

- endpoint 호출.
- request/response 타입.
- queryKey.
- enabled/retry/select/invalidate 같은 TQ 정책.

화면 편집 상태, 복잡한 UI용 임시 버퍼, 여러 endpoint 를 결합한 workflow 는 `model/` 의 상태 hook 으로 보낸다.

### domain hook → `features/{slice}/model/`

`model/` 의 상태 hook 은 React 상태와 외부 훅을 조립하는 coordinator 다.

- `useState`, `useEffect`, `useMemo`, `useQueryClient`, mutation 호출을 연결한다.
- 화면 workflow 의 공개 API 를 만든다.
- 하위 컴포넌트가 몰라도 되는 상태 흐름을 캡슐화한다.

다만 순수한 변환·판정·정렬·payload 생성 규칙까지 길게 품고 있으면 `lib/` 분리 후보로 본다.

### 순수 규칙 → `features/{slice}/lib/`

`features/{slice}/lib` 은 React 없이 실행 가능한 도메인 순수 로직을 둔다.

- 서버 응답을 화면 모델로 변환.
- 입력값을 도메인 상태로 판정.
- 배열 재정렬, 중복 제거.
- 저장 payload 생성.

테스트하고 싶은 규칙인데 React provider, MSW, QueryClient 가 없어도 검증 가능하면 `lib/` 후보다.

### types → `features/{slice}/model/`

`model/` 은 도메인 모델과 페이지/플로우 전용 셰이프, schema 를 둔다.

- 여러 컴포넌트·훅·lib 가 공유하는 화면 모델.
- endpoint 응답 내부에서 재사용되는 도메인 셰이프.
- 특정 페이지 workflow 의 입력/출력 타입.

컴포넌트 파일 안 inline type 이 다른 파일로 새기 시작하면 `model/` 로 옮긴다.

## 3. 분리 신호

다음 중 하나라도 보이면 분리를 검토한다.

- 한 함수가 캐시 조회, API 호출, 응답 변환, 상태 갱신을 모두 수행한다.
- 한 훅 안에 "서버 응답 변환" 과 "사용자 입력 workflow" 와 "저장 payload 생성" 이 같이 있다.
- 테스트하고 싶은 순수 규칙이 hook 안에 있어서 provider/MSW 세팅이 필요해진다.
- 필드 묶음이 여러 곳에 흩어져 누락 위험이 있다.
- 함수 설명이 3문장 이상 필요하다.
- 버그를 고치려면 렌더링 코드, 서버 계약 코드, 도메인 규칙 코드를 동시에 읽어야 한다.

분리 후에도 파일명과 함수명이 실제 도메인 행동을 설명하지 못하면 아직 경계가 흐린 것이다.

## 4. 허용 예외

모든 코드를 쪼개지는 않는다. 아래는 인라인 유지가 더 낫다.

- 한 화면에서만 쓰이고 짧은 이벤트 핸들러.
- JSX 가독성을 위한 짧은 렌더 헬퍼.
- 분기 없는 passthrough, 단순 getter, 단순 label 매핑.
- 분리하면 이름만 늘고 실제 변경 이유가 나뉘지 않는 경우.
- 리팩터링 범위 밖의 기존 코드. 발견하면 언급하고, 요청이나 현재 변경 이유가 있을 때만 고친다.

## 5. 권장 패턴

상태 hook 은 흐름을 보여주고, 규칙은 이름 있는 순수 함수로 내린다.

```ts
const viewModel = buildViewModel(serverData);
const nextState = applyDomainAction(currentState, action);
const payload = buildSubmitPayload(nextState);
```

이 구조에서 hook 은 "언제 무엇을 호출하는지" 를 보여주고, `lib/` 는 "도메인 규칙이 무엇인지" 를 검증 가능하게 만든다.
