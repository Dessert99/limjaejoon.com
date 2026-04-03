import { SITE_URL } from '@/features/shared/constants';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/search',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
