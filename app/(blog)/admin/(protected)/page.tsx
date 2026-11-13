import Link from 'next/link';
import type { Metadata } from 'next';
import { getPosts } from '@/domains/posts/api/posts';
import { buttonVariants } from '@/components/ui/button';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SignOutButton } from './_components/SignOutButton/SignOutButton';

/** 어드민 화면은 검색에 걸리면 안 돼서 색인을 막는다. */
export const metadata: Metadata = {
  title: '어드민',
  robots: { index: false, follow: false },
};

/** 어드민 홈. 공개 화면에는 관리 버튼이 없어서, 글 수정·새 글·로그아웃은 모두 여기서 들어간다. */
export default async function AdminHomePage() {
  const client = await createSupabaseServerClient();
  const posts = await getPosts(client);

  return (
    <main className='py-blog-section'>
      <div className='mx-auto max-w-blog px-blog-gutter'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h1 className='text-blog-statement'>어드민</h1>
          <div className='flex items-center gap-3'>
            <Link
              href='/admin/posts/new'
              className={buttonVariants({ size: 'sm' })}>
              새 글
            </Link>
            <SignOutButton />
          </div>
        </div>

        {posts.length === 0 ? (
          <p className='mt-8 text-blog-muted-foreground'>아직 글이 없다.</p>
        ) : (
          <ul className='mt-8 divide-y divide-blog-border border-y border-blog-border'>
            {posts.map((post) => {
              return (
                <li key={post.id}>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className='block py-4 text-lg hover:text-blog-muted-foreground'>
                    {post.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
