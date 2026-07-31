/** Gallery — 세로 스크롤 진행률을 가로 이동으로 바꾸는 rail 두 줄. 스크롤을 가로채지 않는다 */
import { Container, Media, SectionHeading } from '@/shared/ui';
import { GALLERY, GALLERY_ROWS } from '../../config/gallery';

const TITLE_ID = 'gallery-title';

export function GallerySection() {
  return (
    <section
      aria-labelledby={TITLE_ID}
      className='bg-background py-section text-foreground'>
      <Container>
        <SectionHeading
          label={GALLERY.label}
          title={GALLERY.title}
          className='mb-section-sm'
          titleId={TITLE_ID}
        />
      </Container>

      {/* Container 밖이다 — 화면보다 넓어야 흐르는 게 보인다 */}
      <div className='flex flex-col gap-grid-gap'>
        {GALLERY_ROWS.map((row, rowIndex) => {
          const isReverse = rowIndex % 2 === 1;

          return (
            <div
              key={isReverse ? 'reverse' : 'forward'}
              // overflow-x-auto + tabindex — 애니메이션이 꺼져도 좌우로 직접 훑을 수 있어야 정보가 안 빠진다
              role='group'
              aria-label={`작업 기록 ${rowIndex + 1}번째 줄`}
              tabIndex={0}
              className='overflow-x-auto'>
              <div
                data-rail={isReverse ? 'reverse' : ''}
                className='flex w-max gap-grid-gap px-gutter'>
                {row.map((item) => {
                  return (
                    <Media
                      key={item.id}
                      src={item.src}
                      alt={item.alt}
                      ratio={item.ratio}
                      sizes='(min-width: 48rem) 40vw, 80vw'
                      className='w-rail-item shrink-0 rounded-md'
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
