export const decideRedirect = (
  pathname: string,
  hasSession: boolean,
  admin: boolean
): string | null => {
  const isAdminArea = pathname.startsWith('/admin');
  const isLogin = pathname === '/admin/login';

  if (isAdminArea && !isLogin && !hasSession) {
    return '/admin/login';
  }

  if (isLogin && admin) {
    return '/blog';
  }

  return null;
};
