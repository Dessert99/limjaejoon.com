/** Blog — 글 목록이 설 자리. 지금은 라우트만 세우고 목록은 entities/post 가 붙을 때 채운다 */
import { Container } from '@/shared/ui';
import { SiteFooter } from '@/widgets/site-footer';

export function BlogPage() {
  return (
    <>
      <main className='bg-background py-section text-foreground'>
        <Container className='flex min-h-[60svh] flex-col justify-center gap-5'>
          <h1 className='text-statement'>블로그</h1>
          <p className='text-body-lg break-keep text-muted'>
            읽고 만들며 배운 것을 정리해 둔다. 목록은 준비 중이다.
          </p>
        </Container>
      </main>
      {/* main 밖이다 — main 안에 중첩된 footer 는 contentinfo 랜드마크가 되지 않는다 */}
      <SiteFooter />
    </>
  );
}
