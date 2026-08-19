
export const SITE_URL = 'https://limjaejoon.com';

export const EMAIL = 'lsjh1234@naver.com';

export const SITE = {
  name: '임재준',
  nameEn: 'Jaejoon Lim',
  role: '프론트엔드 개발자',
  roleEn: 'Frontend Engineer',
} as const;

export const SITE_ROUTES = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Labs', href: '/lab' },
] as const;

export const SOCIAL_LINKS = [
  { label: 'Email', href: `mailto:${EMAIL}` },
  { label: 'GitHub', href: 'https://github.com/Dessert99' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jae-joon-lim/' },
] as const;
