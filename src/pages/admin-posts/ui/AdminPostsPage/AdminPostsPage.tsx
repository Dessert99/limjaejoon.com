/** admin posts list page composition — 1차는 새 글 진입 허브를 제공한다 */
import Link from 'next/link';
import * as s from './AdminPostsPage.css';

/** admin posts 관리 화면 */
export function AdminPostsPage() {
  return (
    <main className={s.main}>
      <header>
        <h1 className={s.title}>게시글 관리</h1>
      </header>
      <Link
        className={s.action}
        href='/admin/posts/new'>
        새 글
      </Link>
    </main>
  );
}
