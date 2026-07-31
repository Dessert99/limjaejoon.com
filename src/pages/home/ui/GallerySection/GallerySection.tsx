/** Gallery — 세로 스크롤 진행률을 가로 이동으로 바꾸는 rail 두 줄. 스크롤을 가로채지 않는다 */
import { Container, SectionHeading } from '@/shared/ui';
import { Rail } from './Rail';
import { GALLERY, GALLERY_ROWS } from '../../config/gallery';

const TITLE_ID = 'gallery-title';

export function GallerySection() {
  return (
    <section
      aria-labelledby={TITLE_ID}
      className='bg-background py-section text-foreground'>
      <Container>
        <SectionHeading.Root className='mb-section-sm'>
          <SectionHeading.Label>{GALLERY.label}</SectionHeading.Label>
          <SectionHeading.Title id={TITLE_ID}>
            {GALLERY.title}
          </SectionHeading.Title>
        </SectionHeading.Root>
      </Container>

      {/* Container 밖이다 — 화면보다 넓어야 흐르는 게 보인다 */}
      <div className='flex flex-col gap-grid-gap'>
        {GALLERY_ROWS.map((row, rowIndex) => {
          const direction = rowIndex % 2 === 1 ? 'reverse' : 'forward';

          return (
            <Rail
              key={direction}
              direction={direction}
              label={`작업 기록 ${rowIndex + 1}번째 줄`}
              items={row}
            />
          );
        })}
      </div>
    </section>
  );
}
