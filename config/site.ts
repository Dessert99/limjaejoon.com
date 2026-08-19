export const SITE_URL = 'https://www.limjaejoon.com';

export const EMAIL = 'lsjh1234@naver.com';

export const SITE = {
  name: '임재준',
  nameEn: 'Jaejoon Lim',
  role: '프론트엔드 개발자',
  roleEn: 'Frontend Engineer',
  description:
    '프론트엔드 개발자 임재준의 포트폴리오와 기술 블로그. 읽고 만들며 배운 것을 정리한다.',
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
