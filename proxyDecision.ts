/** 어드민 주소에서 어디로 보낼지 정한다. 보낼 곳이 없으면 null이라 그대로 통과한다. */
export const decideRedirect = (
  pathname: string,
  hasSession: boolean,
  admin: boolean
): string | null => {
  const isAdminArea = pathname.startsWith('/admin');
  const isLogin = pathname === '/admin/login';

  // 로그인 화면까지 막으면 로그인하러 들어올 길이 없어진다
  if (isAdminArea && !isLogin && !hasSession) {
    return '/admin/login';
  }

  // 이미 관리자면 로그인 화면에 머물 이유가 없다
  if (isLogin && admin) {
    return '/blog';
  }

  return null;
};
