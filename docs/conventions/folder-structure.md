# 폴더·파일 구조 표준

위치 / 명명 / 분할의 단일 출처. RHF / TQ 컨벤션 문서는 이 문서를 참조한다.

## 1. 최상위 구조

```
src/
├── features/{domain}/  # 도메인 단위 응집 (핵심) — §2
├── components/         # 도메인 무관 공용 UI. 도메인 UI 금지
│   ├── ui/             # 디자인 프리미티브 (Button, Input 등)
│   └── common/         # 도메인 무관 공용
├── lib/                # 전역 인프라 (apiClient, queryClient, providers 등)
├── hooks/              # 도메인 무관 공용 훅
├── utils/              # 도메인 무관 공용 유틸
├── constants/          # 전역 상수
└── types/              # 전역 공용 타입. 관심사별 파일 분할, barrel `index.ts` 금지
```

## 2. features/{domain}/

```
features/{domain}/
├── api/                # API 함수 — 1함수 1파일. camelCase. 파일명 = 함수명
├── components/         # 도메인 UI. 컴포넌트당 폴더 1개 (§3)
│   ├── {Name}/         # PascalCase 폴더. 진입 파일명 = 폴더명, barrel(index) 금지
│   │   ├── {Name}.tsx      # 컴포넌트 본체
│   │   ├── {Name}.css.ts   # Vanilla Extract 스타일 (그 컴포넌트 전용)
│   │   └── {Name}.test.tsx # 단위 테스트 co-located
│   ├── skeletons/      # 도메인 공용 로딩 UI (각 스켈레톤도 {Name}/ 규칙)
│   └── {page}/         # 라우트가 여럿이면 페이지별 하위 폴더
│       └── forms/      # RHF 자식 (FormProvider 하위). 그 안도 {Name}/ 규칙
├── constants/
│   └── {domain}Keys.ts # queryKey 팩토리
├── hooks/
│   ├── queries/        # useXxxQuery — 1훅 1파일, 파일명 = export 훅명
│   ├── mutations/      # useXxxMutation — 1훅 1파일
│   └── *.ts            # TQ 가 아닌 일반 훅
├── schemas/            # zod 스키마. camelCase. 폼이 있는 도메인만 생성
│   └── {name}Schema.ts # export {name}Schema + type {Name}FormValues = z.infer<...>
├── utils/              # 도메인 유틸. camelCase. 1파일 1책임, 평탄 배치
└── types/              # 도메인 타입 (API 응답·모델). camelCase
```

### 파일명 케이스

| 폴더 | 케이스 |
| --- | --- |
| `components/{Name}/` 폴더 + `{Name}.tsx` / `{Name}.css.ts` / `{Name}.test.tsx` | PascalCase |
| `api/`, `types/`, `utils/`, `schemas/`, `hooks/`, `constants/` | camelCase |

## 3. 테스트 위치 (co-located)

테스트는 별도 `tests/` 디렉토리 없이 **검증 대상 소스 바로 옆**에 둔다 (백엔드 `.spec.ts` 와 동일 모델).

- 컴포넌트: `components/{Name}/{Name}.test.tsx` — 컴포넌트 폴더 안
- 그 외(api·hooks·lib·utils): 대상 파일과 같은 디렉토리에 `{name}.test.ts`
- E2E 만 예외 — `frontend/e2e/` (Playwright)
- `vitest.config.ts` 의 `include` 는 `features/**` · `lib/**` 의 `*.test.{ts,tsx}` 를 스캔
