# 폴더·파일 구조 표준

이 프로젝트의 프론트엔드는 FSD(Feature-Sliced Design)를 연습 기준으로 삼는다. 문서는 위치 / 명명 / 분할의 기본값을 정하지만, 단순한 작업을 위해 파일을 과하게 쪼개지 않는다.

## 1. FSD 레이어

```
frontend/
├── app/                # Next.js App Router. 라우팅, layout, provider 조립
├── widgets/            # 여러 feature/entity 를 조합한 큰 UI 블록
├── features/           # 사용자 행동 단위 기능
├── entities/           # 핵심 도메인 모델과 그 모델 중심 UI/API
└── shared/             # 도메인 무관 공용 코드
    ├── ui/             # Button, Input 같은 디자인 프리미티브
    ├── api/            # apiClient, 공용 API 타입/헬퍼
    ├── lib/            # 공용 유틸
    ├── styles/         # 전역 테마·토큰·breakpoint 등 도메인 무관 스타일
    ├── config/         # 전역 설정
    └── types/          # 전역 공용 타입
```

의존 방향은 위에서 아래로만 둔다.

- `app` -> `widgets` / `features` / `entities` / `shared`
- `widgets` -> `features` / `entities` / `shared`
- `features` -> `entities` / `shared`
- `entities` -> `shared`
- `shared` -> 상위 레이어 참조 금지

같은 레이어 안의 슬라이스끼리는 서로 import 하지 않는다 (slice 격리). `features/a` 가 `features/b` 를, `entities/x` 가 `entities/y` 를 직접 참조 금지. 공유가 필요하면 공통 부분을 아래 레이어 (`entities` / `shared`) 로 내린다.

## 2. Slice 내부 구조

`features/{slice}`, `entities/{slice}`, `widgets/{slice}` 는 필요한 segment 만 만든다.

```
features/{slice}/
├── ui/                 # 이 slice 의 화면 컴포넌트
├── api/                # 백엔드 연동 (요청 함수·query 팩토리·훅)
│   ├── getProblems.ts        # 요청 함수(fetcher)
│   ├── createProblem.ts      # 변경 요청 함수
│   ├── problemQueries.ts     # query 팩토리 (key + options)
│   └── useCreateProblem.ts   # 커스텀 mutation 훅
├── model/              # 상태, schema 등 도메인 모델
├── lib/                # 이 slice 전용 유틸
└── config/             # 이 slice 전용 설정
```

- TanStack Query 관련 코드 (요청 함수·query 팩토리·훅) 는 모두 `api/` 에 둔다. 관심사별로 파일을 나눈다 (fetcher ↔ query 팩토리 ↔ 훅). 한 파일에 몰지 않는다.
- fetcher 파일은 순수 transport (`react`·`@tanstack/react-query` 비의존) 로 유지해 Server Component·prefetch·테스트에서 직접 호출한다.
- queryKey 와 queryOptions 는 `api/` 의 query 팩토리에 모은다. 명명·작성 규칙은 api-convention.md 를 따른다.
- segment 는 필요할 때만 만든다. 빈 폴더나 미래 대비 폴더 생성 금지.
- 작은 컴포넌트는 `ui/{Name}.tsx` 단일 파일 허용.
- 스타일, 테스트, 하위 컴포넌트가 생기면 `ui/{Name}/{Name}.tsx` 형태로 폴더화한다.

## 3. Public API

- slice 밖에서 여러 파일을 직접 깊게 import 해야 하면 `index.ts` public API 를 둘 수 있다.
- 내부 파일끼리 순환 참조를 만들기 쉬운 barrel 은 피한다.
- 단순한 slice 에서는 `index.ts` 를 만들지 않아도 된다.

## 4. 파일명 케이스

| 대상                            | 케이스                      |
| ------------------------------- | --------------------------- |
| React 컴포넌트                  | PascalCase                  |
| API, hook, util, schema, config | camelCase                   |
| 테스트 파일                     | 대상 파일명 + `.test.ts(x)` |

## 5. 테스트 위치

테스트는 검증 대상 소스 가까이에 둔다.

- 컴포넌트: 대상 컴포넌트 옆의 `{Name}.test.tsx`
- API, hook, lib, util: 대상 파일 옆의 `{name}.test.ts`
- E2E: `frontend/e2e/`
