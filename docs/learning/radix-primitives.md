# Radix 프리미티브가 대신 해주는 것

`shared/ui`에서 감싼 Radix 프리미티브별로 Radix가 처리해 주는 항목을 누적 정리한다. "내가 왜 이걸 쓰는지"를 한눈에 보기 위한 학습 로그.

## Label — Radix가 해주는 것

- 연결: `htmlFor`로 라벨↔컨트롤 연결
- 동작: 라벨 클릭 시 연결 컨트롤 포커스 이동
- UX: 라벨 더블클릭 시 텍스트가 선택되지 않게 막아 폼 조작 방해를 줄임

## Separator — Radix가 해주는 것

- 접근성: `decorative=false`면 `role="separator"`, `true`면 역할 제거(순수 장식)
- 방향: `orientation`을 `aria-orientation` + `data-orientation`으로 노출(세로/가로 스타일 분기 근거)

## Toggle — Radix가 해주는 것
- 상태: controlled(`pressed`)/uncontrolled(`defaultPressed`) 둘 다
- 접근성: 버튼에 `aria-pressed` 부여
- 스타일 훅: 눌림을 `data-state="on|off"`로 노출
