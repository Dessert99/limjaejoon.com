import Link from 'next/link';
import type { PostMeta } from '@/features/blog/types';
import * as s from './BlogCard.css';

interface BlogCardProps {
  post: PostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={s.card}>
      <div className={s.cardBody}>
        <span className={s.title}>{post.title}</span>
        {post.description && (
          <span className={s.description}>{post.description}</span>
        )}
      </div>
      <div className={s.cardFooter}>
        {post.tags.length > 0 && (
          <ul className={s.tags}>
            {post.tags.map((tag) => (
              <li key={tag} className={s.tag}>
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
