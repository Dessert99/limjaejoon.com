// 홈 페이지: 헤더 검색 인터랙션을 중심으로 보여주는 라이트 랜딩 화면입니다.
export default function Home() {
  return (
    <main className='min-h-[160vh] w-full px-4 pt-28 pb-24 md:px-8'>
      {/* 화면 낭독기용 홈 제목을 제공합니다. */}
      <h1 className='sr-only'>홈</h1>

      <section className='surface-card p-6 md:p-10'>제작중</section>

      {/* 홈 본문은 검색 중심 구조를 유지하되 스크롤 전환 확인을 위한 여백을 확보합니다. */}
      <section
        aria-hidden='true'
        className='h-[120vh]'
      />
    </main>
  );
}
