import type { Post } from '../lib/post.types';

/** 검색 엔진이 읽을 글 구조화 데이터. 화면에는 아무것도 안 보인다. */
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
        // 제목에 </script>가 섞이면 태그가 끊겨 뒤가 스크립트로 실행된다
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
