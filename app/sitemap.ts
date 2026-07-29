import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/config';

/** 존재하는 public route 만 sitemap 에 노출한다 */
export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split('T')[0];

  return [
    {
      url: SITE_URL,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
