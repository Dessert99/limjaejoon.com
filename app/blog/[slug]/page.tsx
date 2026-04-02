import { Mention } from '@/features/blog/components/Mention';
import { Tooltip } from '@/features/blog/components/Tooltip';
import { mdxOptions } from '@/features/blog/lib/mdx-options';
import { getPostBySlug, getPostList } from '@/features/blog/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import * as s from './page.css';

const mdxComponents = { Tooltip, Mention };

// 빌드 시 모든 포스트 slug를 정적 경로로 생성
export function generateStaticParams() {
  return getPostList().map((post) => ({ slug: post.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className={s.main}>
      <header className={s.header}>
        <span className={s.date}>{post.date}</span>
        <h1 className={s.title}>{post.title}</h1>
        <p className={s.description}>{post.description}</p>
        {post.tags.length > 0 && (
          <ul className={s.tags}>
            {post.tags.map((tag) => (
              <li
                key={tag}
                className={s.tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      <article className={s.prose}>
        <MDXRemote
          source={post.content}
          options={mdxOptions}
          components={mdxComponents}
        />
      </article>
    </main>
  );
}
