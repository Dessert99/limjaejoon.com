/** Work Index — 4안 중 "행 내부 thumbnail" 을 택했다 */
/* 커서 추적 preview·hover 확대는 모바일과 키보드에서 정보가 통째로 빠진다. 썸네일을 행 안에 늘 두면 그 문제가 없다 */
import { projects } from '@/entities/project';
import { Container, SectionHeading } from '@/shared/ui';
import { ProjectRow } from './ProjectRow';
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
        <SectionHeading.Root className='mb-section-sm'>
          <SectionHeading.Label>{WORK.label}</SectionHeading.Label>
          <SectionHeading.Title id={TITLE_ID}>
            {WORK.title}
          </SectionHeading.Title>
          <SectionHeading.Description>
            {WORK.description}
          </SectionHeading.Description>
        </SectionHeading.Root>

        <ul aria-label='프로젝트'>
          {projects.map((project, index) => {
            return (
              <ProjectRow
                key={project.slug}
                project={project}
                staggerIndex={index}
              />
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
