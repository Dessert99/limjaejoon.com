import * as s from './blog.css';

export default function BlogPage() {
  return (
    <main className={s.main}>
      <header className={s.header}>
        <p className={s.label}>Blog</p>
        <h1 className={s.heading}>최신 글 아카이브</h1>
        <p className={s.description}>
          기술 학습 과정에서 정리한 글을 주제별로 모아보는 공간입니다. 현재는
          레이아웃 목업 상태이며 곧 실제 포스트 데이터로 교체됩니다.
        </p>
      </header>

      <section className={s.grid}></section>
    </main>
  );
}
