'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { formatPublishedAt } from '@/views/blog/lib/formatPublishedAt';
import type { PostListItem } from '@/views/blog/lib/post.types';

/** 호수의 달빛 줄기를 시간 축 삼아 이야기 글을 위에서부터 최근순으로 양옆에 번갈아 매단다. 들어오면 빛 한 점이 길을 타고 내려가며 글을 하나씩 켠다. */
export function MoonPath({ posts }: { posts: PostListItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const spark = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const nodes = gsap.utils.toArray<HTMLElement>('[data-node]');
        const labels = gsap.utils.toArray<HTMLElement>('[data-label]');

        if (!nodes.length) {
          return;
        }

        // 빛이 첫 화면 8편까지만 내려가고, 그 아래 글은 같은 간격으로 이어 켜진다. 8을 키우면 빛이 더 길게 흐른다
        const reach = Math.min(nodes.length, 8);
        // 글 한 칸을 0.0875초에 지난다. 키우면 빛이 느긋하게 내려오고, 줄이면 글이 거의 한꺼번에 켜진다
        const step = 0.0875;

        // 0.5초 늦게 출발해 서재에서 넘어올 때 위에서부터 걷히는 커튼 뒤를 따라 내려간다. 줄이면 빛이 커튼에 가려 안 보인다
        gsap
          .timeline({ delay: 0.5 })
          // power2.inOut이라 빛이 달 밑에서 천천히 출발해 가운데서 빨라지고 끝에서 멈칫한다
          .fromTo(
            spark.current,
            { y: 0 },
            {
              y: nodes[reach - 1].offsetTop,
              duration: reach * step,
              ease: 'power2.inOut',
            },
            0
          )
          // 0.07초에 켜져 마지막 0.1초에 꺼진다. 늘리면 빛이 길 끝에 오래 머문다
          .fromTo(
            spark.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.07 },
            0
          )
          .to(
            spark.current,
            { autoAlpha: 0, duration: 0.1 },
            reach * step - 0.1
          )
          // 점은 0에서 튀어나오듯 0.3초에 커진다. expo.out을 power1로 바꾸면 덜 톡 튄다
          .from(
            nodes,
            {
              scale: 0,
              autoAlpha: 0,
              duration: 0.3,
              ease: 'expo.out',
              stagger: step,
            },
            0
          )
          // 글은 6px 아래에서 0.3초에 떠오른다. 6을 키우면 올라오는 움직임이 눈에 띄고, 0이면 제자리에서 켜진다
          .from(
            labels,
            {
              autoAlpha: 0,
              y: 6,
              duration: 0.3,
              ease: 'power1.out',
              stagger: step,
            },
            0
          );
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className='relative mt-10'>
      {/* 달빛 길. 아래로 갈수록 옅어져 호수 반사광이 멀어지는 것처럼 보인다 */}
      <div className='absolute top-0 bottom-0 left-[calc(50%-1px)] w-0.5 bg-linear-to-b from-[#f5f1e8]/90 to-[#f5f1e8]/15 shadow-[0_0_12px_rgba(245,241,232,0.6)]' />
      <div
        ref={spark}
        aria-hidden
        className='invisible absolute top-[-3px] left-[calc(50%-9px)] size-4.5 rounded-full bg-blog-background shadow-[0_0_18px_8px_rgba(245,241,232,0.8)]'
      />

      <ol>
        {posts.map((post, index) => {
          const publishedAt = formatPublishedAt(post.published_at);
          const left = index % 2 === 0;

          return (
            <li
              key={post.id}
              className='grid h-15 grid-cols-[1fr_2.5rem_1fr]'>
              <span
                data-node
                className='col-start-2 mt-1.75 size-3 justify-self-center rounded-full bg-[#f5f1e8] shadow-[0_0_10px_3px_rgba(245,241,232,0.55)]'
              />
              {/* 2줄을 넘는 제목은 자른다. 칸이 좁아 3줄부터는 다음 글과 겹친다 */}
              <Link
                data-label
                href={`/experience/${post.slug}`}
                className={`row-start-1 block [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] ${left ? 'col-start-1 text-right' : 'col-start-3'}`}>
                {publishedAt ? (
                  <time
                    dateTime={post.published_at ?? undefined}
                    className='block text-[11.5px] opacity-60'>
                    {publishedAt}
                  </time>
                ) : null}
                <span className='mt-0.5 line-clamp-2 text-[13px] font-semibold break-keep underline-offset-4 hover:underline'>
                  {post.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
