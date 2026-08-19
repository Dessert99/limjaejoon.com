import { getPostSlugs } from '@/views/blog/server/posts';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { SITE_URL } from '@/config/site';
import type { MetadataRoute } from 'next';

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
