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
├── components/         # 도메인 UI. PascalCase, 1파일 1컴포넌트
│   ├── {Shared}.tsx    # 2+ 페이지 공통은 루트에 평탄 배치
│   ├── skeletons/      # 도메인 공용 로딩 UI
│   └── {page}/         # 라우트가 여럿이면 페이지별 하위 폴더
│       └── forms/      # RHF 자식 (FormProvider 하위)
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
|---|---|
| `components/*.tsx` | PascalCase |
| `api/`, `types/`, `utils/`, `schemas/`, `hooks/`, `constants/` | camelCase |