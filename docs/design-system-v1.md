# Design System V1 (Light Editorial)

## 1) 목적

이 문서는 블로그 중심 UI를 위해 도입한 라이트 에디토리얼 디자인 시스템의 기준을 정리한다.
핵심 목표는 페이지마다 다른 톤을 줄이고, 색상/간격/표면 규칙을 일관되게 재사용하는 것이다.

## 2) 토큰

색상 토큰(`app/globals.css`):

- `--bg-page`: 전체 페이지 배경(아이보리)
- `--bg-surface`: 기본 카드 배경
- `--bg-elevated`: 강조 카드 배경
- `--bg-soft`: 보조 표면 배경
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--line-soft`, `--line-strong`
- `--accent-green`, `--accent-green-strong`, `--accent-green-soft`

형태 토큰:

- `--radius-sm: 10px`
- `--radius-md: 12px`
- `--radius-lg: 14px`
- `--shadow-sm`, `--shadow-md`

모션 토큰:

- `--motion-fast: 160ms`
- `--motion-normal: 220ms`

## 3) 공통 표면 클래스

- `.surface-card`: 라이트 기본 카드 (보더 + 약한 그림자)
- `.surface-subtle`: 라이트 보조 카드
- `.surface-dark`: 코드/미리보기 전용 다크 패널

## 4) 레이아웃 원칙

- 콘텐츠 컨테이너 최대 폭: `1200px`
- 헤더 레이아웃: `좌 로고 / 중 검색(or 네비) / 우 유틸`
- 홈 전용 헤더:
  - 상단: 2행(1행 nav, 2행 검색)
  - 스크롤 72px 이후: 1행(검색이 중앙을 차지)

## 5) 컴포넌트 규칙

Header:

- 배경은 불투명 아이보리 유지
- 성능을 위해 임계값 교차 시에만 상태 변경

Search:

- 확장 상태와 축소 상태의 값은 동일 상태를 공유
- 검색 입력은 시각적으로만 제공하고 실제 검색 동작은 추후 연결

Card/Panel:

- 라이트 페이지에서 정보 카드/설명 패널은 `.surface-card` 우선
- handbook 상세는 "라이트 쉘 + 다크 코드/프리뷰" 패턴 유지

## 6) 후속 작업 메모

- 블로그 데이터 소스 연결 시 카드 컴포넌트를 `features/blog`로 분리
- handbook 상세에서 다크 패널 내부 타이포 대비를 추가 미세조정
