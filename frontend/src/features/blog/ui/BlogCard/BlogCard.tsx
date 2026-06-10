import Link from 'next/link';
import type { PostMeta } from '@/features/blog/model/types';
import { Icon } from '@/shared/ui/Icon/Icon';
import * as s from './BlogCard.css';

interface BlogCardProps {
  post: PostMeta;
  // 그리드 내 위치 — 커버 색(primary/secondary/tertiary)을 회전시키는 데 사용
  index?: number;
  href?: string;
}

// 컬러 커버 post-card. 카드 전체가 포스트 상세로 이동하는 링크.
export function BlogCard({ post, index = 0, href }: BlogCardProps) {
  const tone = s.COVER_TONES[index % s.COVER_TONES.length];

  return (
    <Link
      href={href ?? `/blog/${post.slug}`}
      className={s.card}>
      <div className={`${s.coverBase} ${s.cover[tone]}`}>
        <span className={s.coverGlyph}>{post.title.slice(0, 1)}</span>
        <Icon
          name='article'
          size={20}
          className={s.coverIco}
        />
      </div>
      <div className={s.body}>
        <h2 className={s.title}>{post.title}</h2>
        <p className={s.description}>{post.description}</p>
        <div className={s.meta}>
          {post.tags.length > 0 && (
            <ul className={s.tags}>
              {post.tags.slice(0, 2).map((tag) => {
                return (
                  <li
                    key={tag}
                    className={s.tag}>
                    {tag}
                  </li>
                );
              })}
            </ul>
          )}
          <time
            className={s.date}
            dateTime={post.date}>
            {post.date}
          </time>
        </div>
      </div>
    </Link>
  );
}
