/** Gallery — 세로 스크롤 진행률을 가로 이동으로 바꾸는 rail 두 줄. 스크롤을 가로채지 않는다 */
import { Container } from '@/shared/ui';
import { Rail } from './Rail';
import { GALLERY, GALLERY_ROWS } from '../../config/gallery';

const TITLE_ID = 'gallery-title';

export function GallerySection() {
  return (
    <section
      aria-labelledby={TITLE_ID}
      className='bg-background py-section text-foreground'>
      <Container>
        <div className='mb-section-sm flex flex-col gap-4'>
          <p className='text-label text-subtle uppercase'>{GALLERY.label}</p>
          {/* id 는 래퍼가 아니라 heading 에 붙는다 — 래퍼에 붙이면 랜드마크 이름이 라벨까지 끌어온다 */}
          <h2
            id={TITLE_ID}
            className='text-section break-keep'>
            {GALLERY.title}
          </h2>
        </div>
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
