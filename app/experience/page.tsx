import type { Metadata } from 'next';
import Image from 'next/image';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { MoonPath } from '@/views/blog/components/MoonPath/MoonPath';
import { getPosts } from '@/views/blog/server/posts';
import background from '@/public/images/experience-background.png';

/** 창밖 공간 메타. 방 안이 공부 흔적이라면 이곳은 회고·의사결정 같은 경험을 모은다. */
export const metadata: Metadata = {
  title: 'jaejoon experience',
  description: '회고와 의사결정, 내가 겪어온 것들',
  alternates: { canonical: '/experience' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/experience',
    title: 'jaejoon experience',
    description: '회고와 의사결정, 내가 겪어온 것들',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'limjaejoon experience',
      },
    ],
  },
};

/** 서재 창문 너머의 공간. 창밖 호수의 달빛 길 위에 이야기 글을 시간순으로 매단다. */
export default async function ExperiencePage() {
  const posts = (await getPosts(createSupabaseStaticClient())).filter(
    (post) => {
      return post.kind === 'story';
    }
  );

  return (
    <main className='relative grow bg-blog-inverse text-[#f5f1e8]'>
      {/* 글이 늘어 페이지가 길어져도 풍경이 늘어나지 않게 화면에 붙인다 */}
      <div className='fixed inset-0'>
        {/* 창문으로 나온 첫 화면이라 기다리지 않게 먼저 받는다. placeholder blur가 받는 동안 같은 톤으로 채운다 */}
        {/* 가로 28.5%는 세로로 긴 화면에서 호수의 달빛 줄기를 화면 한가운데, 곧 달빛 길 자리에 맞춘다 */}
        <Image
          src={background}
          alt=''
          fill
          priority
          placeholder='blur'
          sizes='100vw'
          className='object-cover object-[28.5%_50%]'
        />
        {/* 풍경 전체를 25% 눌러 길 양옆 글자를 띄운다. 올리면 글이 또렷해지는 대신 호수가 어두워진다 */}
        <div className='absolute inset-0 bg-[#050816]/25' />
      </div>

      <div className='relative mx-auto max-w-[48rem] px-blog-gutter py-blog-section'>
        <TransitionLink
          href='/library'
          className='text-xs tracking-widest opacity-70 transition-opacity hover:opacity-100'>
          ← 서재
        </TransitionLink>

        <h1 className='mt-6 text-3xl font-semibold sm:text-4xl'>Experience</h1>

        <MoonPath posts={posts} />
      </div>
    </main>
  );
}
