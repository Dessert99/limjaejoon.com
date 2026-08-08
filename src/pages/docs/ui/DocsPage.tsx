/** About — 홈의 Introduction 이 요약이라면 이쪽이 상세. 지금은 라우트만 세운다 */

export function DocsPage() {
  return (
    // 임시 페이지는 밝게 뒤집는다 — svh 를 채워야 뒤로 body 의 다크 배경이 비치지 않는다
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background'>
      <main className='grow bg-background py-section text-foreground'>
        <div className='mx-auto flex min-h-[60svh] max-w-content flex-col justify-center gap-5 px-gutter'>
          <h1 className='text-statement'>소개</h1>
          <p className='text-body-lg break-keep text-muted-foreground'>
            어떤 문제를 어떻게 풀어 왔는지 길게 적을 자리. 준비 중이다.
          </p>
        </div>
      </main>
    </div>
  );
}
