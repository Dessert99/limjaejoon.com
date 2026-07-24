/** 사이트 공용 네비 — main 기준(홈·지식 모음), Lab 미노출 */
import type { NavItem } from '../model/types';

/** 헤더에 노출하는 상위 네비 목록 */
export const navItems: NavItem[] = [
  { label: '홈', href: '/' },
  { label: '지식 모음', href: '/blog' },
];
