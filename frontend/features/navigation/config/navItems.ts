import type { NavItem } from '@/features/navigation/types';

export const navItems: NavItem[] = [
  { label: '지식 모음', href: '/blog' },
  // requiresAuth: 로그인된 사용자에게만 노출 (SiteHeader에서 user prop 기반 필터링)
  { label: '관광지', href: '/tour', requiresAuth: true },
  { label: '위시리스트', href: '/tour/wishlist', requiresAuth: true },
];
