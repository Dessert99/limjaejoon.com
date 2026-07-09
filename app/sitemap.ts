import type { MetadataRoute } from 'next';
import { getPublishedPostNavigationData } from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';
import { SITE_URL } from '@/shared/config';

/** published 글과 핵심 public route 를 sitemap 에 노출한다 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split('T')[0];
  const client = createSupabaseStaticClient();
  const posts = await getPublishedPostNavigationData(client);
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  return [
    ...staticRoutes,
    ...posts.map((post) => {
      return {
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.published_at?.split('T')[0] ?? today,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    }),
  ];
}
