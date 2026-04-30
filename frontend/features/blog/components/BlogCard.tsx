import Link from 'next/link';
import type { PostMeta } from '@/features/blog/types';
import * as s from './BlogCard.css';

interface BlogCardProps {
  post: PostMeta;
  href?: string;
}

// 카드 전체가 포스트 상세로 이동하는 링크. href override가 없으면 slug 기반 경로 사용
export function BlogCard({ post, href }: BlogCardProps) {
  return (
    <Link
      href={href ?? `/blog/${post.slug}`}
      className={s.card}>
      <h2 className={s.title}>{post.title}</h2>
      <p className={s.description}>{post.description}</p>
      <div className={s.meta}>
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
        <time
          className={s.date}
          dateTime={post.date}>
          {post.date}
        </time>
      </div>
    </Link>
  );
}
