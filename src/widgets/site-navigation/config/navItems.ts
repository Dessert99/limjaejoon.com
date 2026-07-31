/** 내비게이션 항목 — 위젯이 소유한다(홈 1페이지라 전부 같은 문서 안 앵커다) */

/* 블로그는 넣지 않는다 — 철거 후 라우트가 아직 없어 지금 걸면 404 다. 라우트가 서면 한 줄을 더한다 */
export const NAV_ITEMS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;
