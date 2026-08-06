import { getPostSlugs } from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';
import { SITE_URL } from '@/shared/config';
import type { MetadataRoute } from 'next';

/** 존재하는 public route 와 발행된 글만 sitemap 에 노출한다 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split('T')[0];
  const slugs = await getPostSlugs(createSupabaseStaticClient());

  return [
    {
      url: SITE_URL,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/lab`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...slugs.map((slug) => {
      return {
        url: `${SITE_URL}/blog/${slug}`,
        lastModified: today,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    }),
  ];
}
