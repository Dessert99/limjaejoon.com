// 전역 헤더에서 사용하는 단일 메뉴 항목 타입입니다.
export interface NavItem {
  // 사용자에게 보여줄 메뉴 라벨입니다.
  label: string;
  // 클릭 시 이동할 경로입니다.
  href: string;
  // 현재 경로와 메뉴를 매칭할 규칙입니다.
  matchMode: 'exact' | 'prefix';
}
