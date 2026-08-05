/** About — 홈의 Introduction 이 요약이라면 이쪽이 상세. 지금은 라우트만 세운다 */
import { Container } from '@/shared/ui';
import { SiteFooter } from '@/widgets/site-footer';

export function DocsPage() {
  return (
    // 임시 페이지는 밝게 뒤집는다 — svh 를 채워야 뒤로 body 의 다크 배경이 비치지 않는다
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background'>
      <main className='grow bg-background py-section text-foreground'>
        <Container className='flex min-h-[60svh] flex-col justify-center gap-5'>
          <h1 className='text-statement'>소개</h1>
          <p className='text-body-lg break-keep text-muted'>
            어떤 문제를 어떻게 풀어 왔는지 길게 적을 자리. 준비 중이다.
          </p>
        </Container>
      </main>
      {/* main 밖이다 — main 안에 중첩된 footer 는 contentinfo 랜드마크가 되지 않는다 */}
      <SiteFooter />
    </div>
  );
}
