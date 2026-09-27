import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { formatPublishedAt } from '@/views/blog/lib/formatPublishedAt';
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

/** 서재 창문 너머의 공간. 창밖 풍경 위에 이야기 글 목록을 띄운다. 레이아웃은 임시다. */
export default async function ExperiencePage() {
  const posts = (await getPosts(createSupabaseStaticClient())).filter(
    (post) => {
      return post.kind === 'story';
    }
  );

  return (
    <main className='relative grow bg-blog-inverse text-[#f5f1e8]'>
      {/* 창문으로 나온 첫 화면이라 기다리지 않게 먼저 받는다. placeholder blur가 받는 동안 같은 톤으로 채운다 */}
      <Image
        src={background}
        alt=''
        fill
        priority
        placeholder='blur'
        sizes='100vw'
        className='object-cover'
      />

      <div className='relative mx-auto max-w-[48rem] px-blog-gutter py-blog-section'>
        <TransitionLink
          href='/library'
          className='text-xs tracking-widest opacity-70 transition-opacity hover:opacity-100'>
          ← 서재
        </TransitionLink>

        <h1 className='mt-6 text-3xl font-semibold sm:text-4xl'>Experience</h1>

        <ul className='mt-10 space-y-4'>
          {posts.map((post) => {
            const publishedAt = formatPublishedAt(post.published_at);

            return (
              <li key={post.id}>
                {/* 크림 15%·뒤 흐림은 풍경 위에서 글자를 읽히게 하는 최소한이다. 올리면 풍경이 가려지고 내리면 호수 반사광에 글자가 묻힌다 */}
                <Link
                  href={`/experience/${post.slug}`}
                  className='block rounded-xl bg-blog-background/15 px-6 py-5 backdrop-blur-md transition-colors hover:bg-blog-background/25'>
                  <h2 className='text-lg font-semibold break-keep'>
                    {post.title}
                  </h2>
                  <p className='mt-2 line-clamp-2 text-[15px] break-keep opacity-80'>
                    {post.description}
                  </p>
                  {publishedAt ? (
                    <time
                      dateTime={post.published_at ?? undefined}
                      className='mt-3 block text-[13px] opacity-70'>
                      {publishedAt}
                    </time>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
