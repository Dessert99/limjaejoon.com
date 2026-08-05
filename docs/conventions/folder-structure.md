# 폴더·파일 구조 표준

이 프로젝트의 프론트엔드는 FSD(Feature-Sliced Design)를 연습 기준으로 삼는다. 문서는 위치 / 명명 / 분할의 기본값을 정하지만, 단순한 작업을 위해 파일을 과하게 쪼개지 않는다.

## 1. FSD 레이어

```
/
├── app/                    # Next.js App Router(라우터 전용). page.tsx 는 src/pages 를 re-export 하는 껍데기
├── pages/                  # 빈 폴더(.gitkeep) — Next 가 src/pages 를 레거시 Pages Router 로 오인하지 않게 슬롯 점유
└── src/                    # 모든 FSD 레이어
    ├── pages/              # 라우트 단위 화면 조립 (라우트 하나에 슬라이스 하나)
    ├── widgets/            # 여러 feature/entity 를 조합한 큰 UI 블록
    ├── features/           # 사용자 행동 단위 기능
    ├── entities/           # 핵심 도메인 모델과 그 모델 중심 UI/API
    └── shared/             # 도메인 무관 공용 코드
        ├── ui/             # Button, Input 같은 디자인 프리미티브
        ├── transition/     # 라우트 전환 커튼(프로바이더 + TransitionLink)
        ├── api/            # apiClient, 공용 API 타입/헬퍼 (MSW 목 포함)
        ├── lib/            # 공용 유틸 (navigation 훅 래퍼 등)
        ├── styles/         # 전역 테마·토큰·breakpoint 등
        └── config/         # 전역 설정
```

segment 는 목적으로 이름 짓고 필요하면 새로 만든다(`transition` 이 그렇게 생겼다). 내용물이 무엇인지로 부르는 `components`·`hooks`·`utils`·`types` 등은 Steiger `fsd/segments-by-purpose` 가 막는다 — 훅은 도메인을 알면 `model/`, 모르면 `lib/` 로 간다.

**Next.js 적응:** FSD 레이어는 `src/` 아래 둔다(`@/* → ./src/*`). Next 라우터는 `app/` 에 남기고 `page.tsx` 는 `@/pages/*` 를 re-export 하는 껍데기로만 쓴다. FSD `pages` 레이어는 `src/pages` 인데, Next 가 이를 레거시 Pages Router 로 오인하지 않도록 루트에 빈 `pages/` 를 둔다. 그 부작용으로 `useSearchParams`·`usePathname` 타입이 nullable 로 과대추정되므로 `shared/lib/navigation` 래퍼에서 non-null 로 가둔다. 구조는 Steiger(`npm run fsd`)로 강제한다.

## 2. Slice 내부 구조

`pages/{slice}`, `widgets/{slice}`, `features/{slice}`, `entities/{slice}` 는 필요한 segment 만 만든다.

```
entities/post/
├── ui/                 # 이 slice 의 화면 컴포넌트
├── api/                # 외부 데이터 소스 경계 (요청 함수)
│   ├── publicPosts.ts        # 조회 요청 함수(fetcher)
│   └── adminPosts.ts         # 변경 요청 함수
├── model/              # 상태, schema 등 도메인 모델
│   └── post.types.ts         # slice 밖에서 공유되는 앱-facing 타입
├── lib/                # 이 slice 전용 유틸
└── config/             # 이 slice 전용 설정
```

- 외부 데이터 소스를 부르는 코드는 모두 `api/` 에 둔다. 요청 하나에 파일 하나로 나누고 한 파일에 몰지 않는다.
- 요청 함수는 순수 transport (`react` 비의존) 로 유지해 Server Component·테스트에서 직접 호출한다.
- DB 생성 타입은 `shared/api/*` 에 두고, slice 밖에서 공유되는 앱-facing 타입 별칭은 `model/{slice}.types.ts` 에 둔다.
- `model/` 은 상태 coordinator 훅과 도메인 타입·스키마를 함께 품되, 같은 segment 안의 다른 파일로 나눈다.
- segment 는 필요할 때만 만든다. 빈 폴더나 미래 대비 폴더 생성 금지.
- 작은 컴포넌트는 `ui/{Name}.tsx` 단일 파일 허용.
- 스타일, 테스트, 하위 컴포넌트가 생기면 `ui/{Name}/{Name}.tsx` 형태로 폴더화한다.

## 3. Public API

- 모든 slice(및 shared 의 각 segment)는 `index.ts` public API 를 둔다. slice 밖에서는 public API 만 import 하고(`@/` alias), slice 내부 파일끼리는 상대경로로 import 한다. Steiger 가 강제한다.
- **예외 — 클라이언트 전용 entrypoint:** 서버 전용 코드가 섞인 barrel 은 클라이언트 번들을 오염시키므로 우회를 허용한다. 예) `features/auth` 는 `@/shared/api` 대신 `@/shared/api/supabase/client` 를 직접 import 한다 — barrel 이 `next/headers` 를 쓰는 server client 까지 끌어오기 때문이다. Steiger 의 `fsd/no-public-api-sidestep` 을 끈 이유다.

## 4. 테스트 위치

단위 테스트는 검증 대상 파일 옆에 둔다. Supabase 등 실제 외부 자원을 쓰는 통합 테스트만 루트 `tests/integration/` 에 모으고 `npm run test:integration` 으로 따로 돌린다.
