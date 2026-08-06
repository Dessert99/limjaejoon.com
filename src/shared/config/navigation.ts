/** 사이트 목적지 목록 — 라우트마다 다른 내비게이션이 서므로 갈 곳은 여기 한 곳에서만 정한다 */

/* 항목이 늘면 홈 상단 한 줄에 안 들어간다 — 5개를 넘기면 상단 나열을 접고 사이드바만 남기는 쪽을 다시 정해야 한다 */
export const SITE_ROUTES = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Lab', href: '/lab' },
] as const;
