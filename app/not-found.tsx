import Link from 'next/link';
import * as s from './not-found.css';

export default function NotFound() {
  return (
    <main className={s.main}>
      <div className={s.card}>
        <p className={s.label}>404</p>
        <h1 className={s.heading}>페이지를 찾을 수 없습니다</h1>
        <p className={s.body}>카테고리가 제거되었거나 주소가 잘못되었습니다.</p>
        <Link href='/' className={s.homeLink}>
          홈으로 이동
        </Link>
      </div>
    </main>
  );
}
