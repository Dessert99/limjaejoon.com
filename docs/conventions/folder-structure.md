# 폴더·파일 구조 표준

이 프로젝트의 프론트엔드는 FSD(Feature-Sliced Design)를 연습 기준으로 삼는다. 문서는 위치 / 명명 / 분할의 기본값을 정하지만, 단순한 작업을 위해 파일을 과하게 쪼개지 않는다.

## 1. FSD 레이어

```
/
├── app/                    # Next.js App Router(라우터 전용). page.tsx 는 src/pages 를 re-export 하는 껍데기
├── pages/                  # 빈 폴더(.gitkeep) — Next 가 src/pages 를 레거시 Pages Router 로 오인하지 않게 슬롯 점유
└── src/                    # 모든 FSD 레이어
    ├── pages/              # 라우트 단위 화면 조립 (home, blog, blog-post …)
    ├── widgets/            # 여러 feature/entity 를 조합한 큰 UI 블록
    ├── features/           # 사용자 행동 단위 기능
    ├── entities/           # 핵심 도메인 모델과 그 모델 중심 UI/API
    └── shared/             # 도메인 무관 공용 코드
        ├── ui/             # Button, Input 같은 디자인 프리미티브
        ├── api/            # apiClient, 공용 API 타입/헬퍼 (MSW 목 포함)
        ├── lib/            # 공용 유틸 (navigation 훅 래퍼 등)
        ├── styles/         # 전역 테마·토큰·breakpoint 등 (vanilla-extract)
        ├── config/         # 전역 설정
        └── types/          # 전역 공용 타입
```

의존 방향은 위에서 아래로만 둔다.

- `app` -> `pages` (얇은 re-export)
- `pages` -> `widgets` / `features` / `entities` / `shared`
- `widgets` -> `features` / `entities` / `shared`
- `features` -> `entities` / `shared`
- `entities` -> `shared`
- `shared` -> 상위 레이어 참조 금지

**Next.js 적응:** FSD 레이어는 `src/` 아래 둔다(`@/* → ./src/*`). Next 라우터는 `app/` 에 남기고 `page.tsx` 는 `@/pages/*` 를 re-export 하는 껍데기로만 쓴다. FSD `pages` 레이어는 `src/pages` 인데, Next 가 이를 레거시 Pages Router 로 오인하지 않도록 루트에 빈 `pages/` 를 둔다. 그 부작용으로 `useSearchParams`·`usePathname` 타입이 nullable 로 과대추정되므로 `shared/lib/navigation` 래퍼에서 non-null 로 가둔다. 구조는 Steiger(`npm run fsd`)로 강제한다.

같은 레이어 안의 슬라이스끼리는 서로 import 하지 않는다 (slice 격리). `features/a` 가 `features/b` 를, `entities/x` 가 `entities/y` 를 직접 참조 금지. 공유가 필요하면 공통 부분을 아래 레이어 (`entities` / `shared`) 로 내린다.

## 2. Slice 내부 구조

`pages/{slice}`, `widgets/{slice}`, `features/{slice}`, `entities/{slice}` 는 필요한 segment 만 만든다.

```
features/{slice}/
├── ui/                 # 이 slice 의 화면 컴포넌트
├── api/                # 외부 데이터 소스 경계 (요청 함수·query 팩토리·훅)
│   ├── getProblems.ts        # 요청 함수(fetcher)
│   ├── createProblem.ts      # 변경 요청 함수
│   ├── problemQueries.ts     # query 팩토리 (key + options)
│   └── useCreateProblem.ts   # 커스텀 mutation 훅
├── model/              # 상태, schema 등 도메인 모델
│   └── problem.types.ts      # slice 밖에서 공유되는 앱-facing 타입
├── lib/                # 이 slice 전용 유틸
└── config/             # 이 slice 전용 설정
```

- TanStack Query 관련 코드 (요청 함수·query 팩토리·훅) 는 모두 `api/` 에 둔다. 관심사별로 파일을 나눈다 (fetcher ↔ query 팩토리 ↔ 훅). 한 파일에 몰지 않는다.
- fetcher 파일은 순수 transport (`react`·`@tanstack/react-query` 비의존) 로 유지해 Server Component·prefetch·테스트에서 직접 호출한다.
- queryKey 와 queryOptions 는 `api/` 의 query 팩토리에 모은다. 명명·작성 규칙은 api-convention.md 를 따른다.
- DB 생성 타입은 `shared/api/*` 에 두고, slice 밖에서 공유되는 앱-facing 타입 별칭은 `model/{slice}.types.ts` 에 둔다.
- segment 는 필요할 때만 만든다. 빈 폴더나 미래 대비 폴더 생성 금지.
- 작은 컴포넌트는 `ui/{Name}.tsx` 단일 파일 허용.
- 스타일, 테스트, 하위 컴포넌트가 생기면 `ui/{Name}/{Name}.tsx` 형태로 폴더화한다.

## 3. Public API

- 모든 slice(및 shared 의 각 segment)는 `index.ts` public API 를 둔다. slice 밖에서는 public API 만 import 하고(`@/` alias), slice 내부 파일끼리는 상대경로로 import 한다. Steiger 가 강제한다.
- **예외 — 클라이언트 전용 entrypoint:** 서버 전용 코드가 섞인 barrel 은 클라이언트 번들을 오염시키므로 우회를 허용한다. 예) `features/auth` 는 `@/shared/api` 대신 `@/shared/api/supabase/client` 를 직접 import 한다 — barrel 이 `next/headers` 를 쓰는 server client 까지 끌어오기 때문이다. Steiger 의 `fsd/no-public-api-sidestep` 을 끈 이유다.
- 내부 파일끼리 순환 참조를 만들기 쉬운 무분별한 barrel 은 피한다.

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
- E2E: `e2e/`
