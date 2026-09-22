import type { Metadata } from 'next';

/** 목록 페이지 메타. canonical을 /blog로 못 박아 필터가 붙은 주소가 따로 색인되지 않게 한다. */
export const metadata: Metadata = {
  title: 'jaejoon blog',
  description: '지금까지 쌓아온 개발 지식 모음',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/blog',
    title: 'jaejoon blog',
    description: '지금까지 쌓아온 개발 지식 모음',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'limjaejoon blog',
      },
    ],
  },
};

/** 블로그 홈. 새 배경색 위에 다시 쌓기 위해 비워 둔 상태다. */
export default function BlogPage() {
  return <main className='grow bg-blog-inverse' />;
}
