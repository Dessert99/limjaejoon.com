/** Hero 상단 내비게이션 항목 — 홈에서만 쓰는 배치라 shared 로 올리지 않는다 */

/* 항목이 늘면 한 줄에 안 들어간다 — 5개를 넘기면 나열이 아니라 접는 방식을 다시 정해야 한다 */
export const HERO_NAV = [
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Lab', href: '/lab' },
] as const;
