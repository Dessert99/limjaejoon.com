import Link from 'next/link';
import type { PostMeta } from '@/features/blog/types';
import * as s from './BlogCard.css';

interface BlogCardProps {
  post: PostMeta;
  href?: string;
}

export function BlogCard({ post, href }: BlogCardProps) {
  return (
    <Link
      href={href ?? `/blog/${post.slug}`}
      className={s.card}>
      <span
        className={s.idx}
        aria-hidden='true'
      />
      <span className={s.titleWrap}>
        <span
          className={s.arrow}
          aria-hidden='true'>
          →
        </span>
        <span className={s.title}>{post.title}</span>
      </span>
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
        <span className={s.date}>{post.date}</span>
      </div>
    </Link>
  );
}
