import { SITE_ROUTES } from '@/config/site';

export const SITE_NAV = SITE_ROUTES.filter((route) => {
  return route.href !== '/';
});
