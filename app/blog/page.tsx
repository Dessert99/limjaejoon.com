import type { Metadata } from 'next';
import { RoomScene } from '@/views/blog/components/RoomScene/RoomScene';

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

/** 블로그 홈. 3D 방 하나가 화면을 채우고, 사물 클릭과 책 더미는 그 위에 얹을 예정이다. */
export default function BlogPage() {
  return (
    // bg-blog-inverse는 glb가 뜨기 전 잠깐 보이는 바닥색. 방의 어두운 톤과 맞춰 깜빡임을 줄인다
    <main className='relative grow bg-blog-inverse'>
      {/* grow로 늘어난 높이는 자식이 %로 못 받으므로 absolute로 main을 꽉 채운다 */}
      <div className='absolute inset-0'>
        <RoomScene />
      </div>
    </main>
  );
}
