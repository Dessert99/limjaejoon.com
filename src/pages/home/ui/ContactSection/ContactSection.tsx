/** Contact — surface inverse 로 뒤집어 페이지를 닫는다. magnetic·커서 추적은 쓰지 않는다 */
import { EMAIL } from '@/shared/config';
import {
  Container,
  MaskReveal,
  SectionHeading,
  ShowcaseButton,
} from '@/shared/ui';
import { CONTACT } from '../../config/contact';

const TITLE_ID = 'contact-title';

export function ContactSection() {
  return (
    <section
      id='contact'
      tabIndex={-1}
      aria-labelledby={TITLE_ID}
      // 마지막 섹션만 밝게 뒤집어 페이지가 닫히는 느낌을 준다
      data-surface='light'
      className='bg-surface py-section text-foreground'>
      <Container>
        <SectionHeading.Label>{CONTACT.label}</SectionHeading.Label>

        {/* 제목만 마스크로 감싼다 — 부품이라 래퍼를 끼워도 id 가 heading 에 그대로 남는다 */}
        <MaskReveal className='mt-6 text-section break-keep text-foreground'>
          <SectionHeading.Title id={TITLE_ID}>
            {CONTACT.headline}
          </SectionHeading.Title>
        </MaskReveal>

        <p className='mt-6 text-body-lg break-keep text-muted'>
          {CONTACT.supporting}
        </p>

        <div className='mt-10 flex flex-wrap items-center gap-6'>
          <ShowcaseButton href={`mailto:${EMAIL}`}>
            {CONTACT.cta}
          </ShowcaseButton>
          {/* mailto 가 아무 일도 안 하는 환경이 있다 — 주소를 눈으로 읽고 복사할 수 있어야 한다 */}
          <p className='text-body text-muted select-all'>{EMAIL}</p>
        </div>
      </Container>
    </section>
  );
}
