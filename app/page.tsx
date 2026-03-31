import Link from 'next/link';
import { BlogCard } from '@/features/blog/components/BlogCard';
import { getPostList } from '@/features/blog/lib/posts';
import * as s from './page.css';

export default function Home() {
  const recentPosts = getPostList().slice(0, 3);

  return (
    <main className={s.main}>
      <section className={s.hero}>
        <h1 className={s.heroName}>안녕하세요, 임재준입니다.</h1>
        <p className={s.heroRole}>프론트엔드 개발자</p>
        <p className={s.heroDesc}>성장을 코드로 기록합니다.</p>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionHeading}>최근 글</h2>
          <Link href="/blog" className={s.sectionLink}>
            모든 글 →
          </Link>
        </div>
        <div className={s.postGrid}>
          {recentPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
