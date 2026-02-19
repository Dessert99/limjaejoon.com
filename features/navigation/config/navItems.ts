// 메뉴 항목 타입 검증을 위해 import 합니다.
import type { NavItem } from '@/features/navigation/types';

// 전역 헤더 1차 메뉴 정의입니다.
export const navItems: NavItem[] = [
  // 홈은 정확 경로(`/`)일 때만 활성화합니다.
  { label: '홈', href: '/', matchMode: 'exact' },
  // 블로그는 현재 1차 라우트만 사용하므로 exact 매칭을 사용합니다.
  { label: '블로그', href: '/blog', matchMode: 'exact' },
  // 핸드북은 상세(`/handbook/[slug]`)도 활성화되어야 하므로 prefix 매칭을 사용합니다.
  { label: '핸드북', href: '/handbook', matchMode: 'prefix' },
  // 포트폴리오는 현재 1차 라우트만 사용하므로 exact 매칭을 사용합니다.
  { label: '포트폴리오', href: '/portfolio', matchMode: 'exact' },
];
