/** Work — 홈의 WorkSection 이 목록이라면 이쪽이 사례별 상세. 지금은 라우트만 세운다 */
import { Container } from '@/shared/ui';
import { SiteFooter } from '@/widgets/site-footer';

export function WorkPage() {
  return (
    <>
      <main className='bg-background py-section text-foreground'>
        <Container className='flex min-h-[60svh] flex-col justify-center gap-5'>
          <h1 className='text-statement'>프로젝트</h1>
          <p className='text-body-lg break-keep text-muted'>
            만든 것들을 과정까지 펼쳐 두는 자리. 준비 중이다.
          </p>
        </Container>
      </main>
      {/* main 밖이다 — main 안에 중첩된 footer 는 contentinfo 랜드마크가 되지 않는다 */}
      <SiteFooter />
    </>
  );
}
