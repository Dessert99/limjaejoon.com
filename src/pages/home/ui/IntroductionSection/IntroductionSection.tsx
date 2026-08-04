/** Introduction — 밝은 섹션. 어두운 Hero 와의 대비가 이 페이지의 리듬을 만든다 */
import { INTRODUCTION } from '../../config/introduction';
import { Container, SectionHeading, ShowcaseButton } from '@/shared/ui';
import { MaskReveal } from '../MaskReveal/MaskReveal';
import { RevealText } from '../RevealText/RevealText';

// 섹션을 region 랜드마크로 만들려면 이름이 필요하다 — id 만으로는 랜드마크 목록에 안 뜬다
const TITLE_ID = 'about-title';

export function IntroductionSection() {
  return (
    <section
      aria-labelledby={TITLE_ID}
      // 컴포넌트는 자기가 밝은 곳에 있는지 모른다 — 반전은 이 한 속성이 담당한다(설계 4.4)
      data-surface='light'
      className='bg-surface py-section text-foreground'>
      <Container>
        {/* 비대칭 — 라벨 4 / 본문 8. 모바일은 단일 열로 떨어진다 */}
        <SectionHeading.Root className='grid gap-grid-gap md:grid-cols-12'>
          <SectionHeading.Label className='md:col-span-4'>
            {INTRODUCTION.label}
          </SectionHeading.Label>

          <div className='flex flex-col gap-10 md:col-span-8'>
            {/* RevealText 는 span 을 낸다 — heading 안에 들어가도 콘텐츠 모델이 깨지지 않는다 */}
            <SectionHeading.Title
              id={TITLE_ID}
              className='text-statement'>
              <RevealText
                unit='word'
                className='text-foreground'>
                {INTRODUCTION.statement}
              </RevealText>
            </SectionHeading.Title>

            <div className='flex flex-col gap-5'>
              {INTRODUCTION.body.map((paragraph, index) => {
                return (
                  // p 는 등장 래퍼 안에 둔다 — 래퍼가 div 라 밖에 두면 문단 경계가 접근성 트리에서 사라진다
                  <MaskReveal
                    key={paragraph}
                    staggerIndex={index}
                    className='text-body-lg break-keep text-muted'>
                    <p>{paragraph}</p>
                  </MaskReveal>
                );
              })}
            </div>

            <ul className='flex flex-wrap gap-x-6 gap-y-2'>
              {INTRODUCTION.skills.map((skill) => {
                return (
                  <li
                    key={skill}
                    className='text-body text-subtle'>
                    {skill}
                  </li>
                );
              })}
            </ul>

            <div>
              <ShowcaseButton href={INTRODUCTION.cta.href}>
                {INTRODUCTION.cta.label}
              </ShowcaseButton>
            </div>
          </div>
        </SectionHeading.Root>
      </Container>
    </section>
  );
}
