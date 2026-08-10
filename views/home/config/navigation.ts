/** 홈 상단 나열 항목 — 사이트 목적지에서 홈 자신만 뺀다(이미 그 화면이라 갈 곳이 아니다) */
import { SITE_ROUTES } from '@/config/site';

export const SITE_NAV = SITE_ROUTES.filter((route) => {
  return route.href !== '/';
});
