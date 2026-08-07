/** Lab — 실험을 늘어놓는 자리. 지금은 라우트만 세운다 */
import { Container } from '@/shared/ui';

export function LabPage() {
  return (
    // 임시 페이지는 밝게 뒤집는다 — svh 를 채워야 뒤로 body 의 다크 배경이 비치지 않는다
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background'>
      <main className='grow bg-background py-section text-foreground'>
        <Container className='flex min-h-[60svh] flex-col justify-center gap-5'>
          <h1 className='text-statement'>랩</h1>
          <p className='text-body-lg break-keep text-muted'>
            제품이 되기 전의 것들 — 만들다 만 것과 실험 중인 것. 준비 중이다.
          </p>
        </Container>
      </main>
    </div>
  );
}
