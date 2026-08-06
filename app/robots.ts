import { SITE_URL } from '@/shared/config';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 색인은 접근 제어가 아니다 — 다만 로그인 화면이 검색 결과에 뜰 이유가 없다
      disallow: '/admin',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
