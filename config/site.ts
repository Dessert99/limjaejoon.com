/** 사이트 전역 상수 — metadata·Contact 가 같은 출처를 본다 */

/** 절대 URL 기준점 — sitemap·metadata 가 소비한다 */
export const SITE_URL = 'https://limjaejoon.com';

/** 공개 연락처 — mailto 와 화면에 찍히는 문자열이 갈리지 않게 여기서 한 번만 정한다 */
export const EMAIL = 'lsjh1234@naver.com';

/** 사이트 정체 — 이름·영문명·직무·한 줄 소개 */
export const SITE = {
  name: '임재준',
  nameEn: 'Jaejoon Lim',
  role: '프론트엔드 개발자',
  roleEn: 'Frontend Engineer',
} as const;

/** 사이트 목적지 목록 — 라우트마다 다른 내비게이션이 서므로 갈 곳은 여기 한 곳에서만 정한다 */
/* 항목이 늘면 홈 상단 한 줄에 안 들어간다 — 5개를 넘기면 상단 나열을 접고 사이드바만 남기는 쪽을 다시 정해야 한다 */
export const SITE_ROUTES = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Labs', href: '/lab' },
] as const;

/** 소셜 링크 — metadata·Contact 가 소비한다 */
/* 블로그는 아직 라우트가 없다(철거 후 재구축 전) — 라우트가 서면 여기 한 줄을 더한다 */
export const SOCIAL_LINKS = [
  { label: 'Email', href: `mailto:${EMAIL}` },
  { label: 'GitHub', href: 'https://github.com/Dessert99' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jae-joon-lim/' },
] as const;
