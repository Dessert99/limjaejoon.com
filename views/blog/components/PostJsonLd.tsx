import type { Post } from '../lib/post.types';

export function PostJsonLd({ post }: { post: Post }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: '재준',
      url: 'https://www.limjaejoon.com',
    },
    keywords: post.tags,
    image: 'https://www.limjaejoon.com/opengraph-image.png',
    mainEntityOfPage: `https://www.limjaejoon.com/blog/${post.slug}`,
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
