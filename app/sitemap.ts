import { getPostSitemapEntries } from '@/views/blog/server/posts';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import type { MetadataRoute } from 'next';

/** 크롤러가 읽을 사이트맵. 고정 페이지 셋에 글 주소를 이어 붙인다. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostSitemapEntries(createSupabaseStaticClient());

  return [
    // priority는 이 사이트 안에서의 상대적 무게다. 1.0인 홈이 기준이 된다
    {
      url: 'https://www.limjaejoon.com',
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://www.limjaejoon.com/blog',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.limjaejoon.com/labs',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // lastModified가 있어야 크롤러가 고친 글만 골라 다시 읽는다
    ...posts.map((post) => {
      return {
        url: `https://www.limjaejoon.com/blog/${post.slug}`,
        lastModified: post.updated_at,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    }),
  ];
}
