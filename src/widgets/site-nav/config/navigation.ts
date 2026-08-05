/** 사이트 내비게이션 항목 — 어느 라우트에서도 같은 목록을 보여주는 단일 출처 */

/* 항목이 늘면 상단 한 줄에 안 들어간다 — 5개를 넘기면 상단 나열을 접고 사이드바만 남기는 쪽을 다시 정해야 한다 */
export const SITE_NAV = [
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Lab', href: '/lab' },
] as const;
