import { SITE, SITE_URL } from '@/config/site';
import { OG_IMAGE_PATH } from '@/lib/seo';
import type { Post } from '../lib/post.types';

export function PostJsonLd({ post }: { post: Post }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: SITE.name, url: SITE_URL },
    keywords: post.tags,
    image: `${SITE_URL}${OG_IMAGE_PATH}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
