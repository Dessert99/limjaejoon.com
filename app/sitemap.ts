import { getPostSitemapEntries } from '@/views/blog/server/posts';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.limjaejoon.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostSitemapEntries(createSupabaseStaticClient());

  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/docs`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/lab`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...posts.map((post) => {
      return {
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updated_at,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    }),
  ];
}
