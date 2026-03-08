// JavaScript 핸드북 정적 상세 페이지 골격입니다.
export default function HandbookJavascriptPage() {
  // JavaScript 카테고리 소개 화면을 렌더합니다.
  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl px-4 pt-28 pb-14 md:px-6'>
      {/* 페이지 목적과 단계 상태를 전달하는 헤더입니다. */}
      <header className='surface-card p-6 md:p-10'>
        <p className='text-xs font-semibold uppercase tracking-widest text-accent-strong'>
          Handbook Category
        </p>
        <h1 className='mt-3 text-3xl font-semibold tracking-tight text-text-primary md:text-5xl'>
          JavaScript
        </h1>
        <p className='mt-4 text-sm leading-7 text-text-secondary md:text-base'>
          JavaScript 런타임 흐름과 비동기 제어를 정리할 상세 페이지 골격입니다.
        </p>
      </header>

      {/* 실제 스니펫 섹션을 추가할 자리입니다. */}
      <section className='surface-subtle mt-6 p-6'>
        <p className='text-sm text-text-muted'>곧 JavaScript 스니펫 콘텐츠가 들어옵니다.</p>
      </section>
    </main>
  );
}
