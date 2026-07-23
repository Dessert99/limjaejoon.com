/** 경로+admin여부로 redirect 목적지를 정한다 (proxy 에서 쿠키 IO 와 분리해 테스트 가능하게) */
export const decideRedirect = (
  pathname: string,
  admin: boolean
): string | null => {
  const isAdminArea = pathname.startsWith('/admin');
  const isLogin = pathname === '/admin/login';

  if (isAdminArea && !isLogin && !admin) {
    return '/admin/login';
  }

  if (isLogin && admin) {
    return '/admin/posts';
  }

  return null;
};
