/** Work Index — 4안 중 "행 내부 thumbnail" 을 택했다 */
/* 커서 추적 preview·hover 확대는 모바일과 키보드에서 정보가 통째로 빠진다. 썸네일을 행 안에 늘 두면 그 문제가 없다 */
import { projects } from '@/entities/project';
import { Container, MediaReveal, Media, SectionHeading } from '@/shared/ui';
import { WORK } from '../../config/work';

const TITLE_ID = 'work-title';

export function WorkSection() {
  return (
    <section
      id='work'
      tabIndex={-1}
      aria-labelledby={TITLE_ID}
      className='bg-background py-section text-foreground'>
      <Container>
        <SectionHeading
          label={WORK.label}
          title={WORK.title}
          description={WORK.description}
          className='mb-section-sm'
          titleId={TITLE_ID}
        />

        <ul aria-label='프로젝트'>
          {projects.map((project, index) => {
            return (
              <li
                key={project.slug}
                className='border-t border-border py-section-sm first:border-t-0 first:pt-0'>
                {/* 데스크톱 비대칭 — 썸네일 5 / 본문 7. 모바일은 단일 열로 떨어진다 */}
                <div className='grid gap-grid-gap md:grid-cols-12'>
                  <MediaReveal
                    staggerIndex={index}
                    className='md:col-span-5'>
                    <Media
                      src={project.thumbnail.src}
                      alt={project.thumbnail.alt}
                      ratio={project.thumbnail.ratio}
                      sizes='(min-width: 48rem) 40vw, 100vw'
                    />
                  </MediaReveal>

                  <div className='flex flex-col gap-4 md:col-span-7'>
                    <h3 className='text-section break-keep'>{project.title}</h3>

                    <p className='text-body-lg break-keep text-muted'>
                      {project.summary}
                    </p>

                    <p className='text-body break-keep text-subtle'>
                      {project.contribution}
                    </p>

                    <dl className='flex flex-wrap gap-x-8 gap-y-2 text-label text-subtle uppercase'>
                      <div className='flex gap-2'>
                        <dt>기간</dt>
                        <dd>{project.period}</dd>
                      </div>
                      <div className='flex gap-2'>
                        <dt>스택</dt>
                        <dd>{project.stack.join(' · ')}</dd>
                      </div>
                    </dl>

                    {project.links.length > 0 ? (
                      <ul
                        aria-label={`${project.title} 링크`}
                        className='flex flex-wrap gap-4'>
                        {project.links.map((link) => {
                          return (
                            <li key={link.href}>
                              <a
                                href={link.href}
                                target='_blank'
                                rel='noreferrer'
                                // 링크 목록에서 "GitHub" 만 여럿이면 서로 구별되지 않는다
                                aria-label={`${project.title} ${link.label}`}
                                className='text-body text-accent underline-offset-4 transition-colors duration-quick ease-standard hover:underline'>
                                {link.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
