// 블로그 페이지: 실제 데이터 전 단계에서 구조형 목업 레이아웃을 제공합니다.
export default function BlogPage() {
  // 게시물 카드 목업 데이터입니다.

  return (
    <main className='mx-auto min-h-screen w-full max-w-[1200px] px-4 pt-28 pb-10 md:px-6'>
      <header className='surface-card p-6 md:p-10'>
        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-(--accent-green-strong)'>
          Blog
        </p>
        <h1 className='mt-3 text-3xl font-semibold tracking-tight text-(--text-primary) md:text-5xl'>
          최신 글 아카이브
        </h1>
        <p className='mt-4 max-w-3xl text-sm leading-7 text-(--text-secondary) md:text-base'>
          기술 학습 과정에서 정리한 글을 주제별로 모아보는 공간입니다. 현재는
          레이아웃 목업 상태이며 곧 실제 포스트 데이터로 교체됩니다.
        </p>
      </header>

      <section className='mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3'></section>
    </main>
  );
}
