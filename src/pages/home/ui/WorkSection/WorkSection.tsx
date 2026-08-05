/** Work Index — 4안 중 "행 내부 thumbnail" 을 택했다 */
/* 커서 추적 preview·hover 확대는 모바일과 키보드에서 정보가 통째로 빠진다. 썸네일을 행 안에 늘 두면 그 문제가 없다 */
import { projects } from '@/entities/project';
import { Container } from '@/shared/ui';
import { ProjectRow } from './ProjectRow';
import { WORK } from '../../config/work';

const TITLE_ID = 'work-title';

export function WorkSection() {
  return (
    // Introduction 의 CTA 가 유일한 진입점이다 — tabIndex=-1 이라야 앵커 이동에 포커스가 따라온다
    <section
      id='work'
      tabIndex={-1}
      aria-labelledby={TITLE_ID}
      className='bg-background py-section text-foreground'>
      <Container>
        <div className='mb-section-sm flex flex-col gap-4'>
          <p className='text-label text-subtle uppercase'>{WORK.label}</p>
          {/* id 는 래퍼가 아니라 heading 에 붙는다 — 래퍼에 붙이면 랜드마크 이름이 라벨·부연까지 끌어온다 */}
          <h2
            id={TITLE_ID}
            className='text-section break-keep'>
            {WORK.title}
          </h2>
          <p className='text-body-lg break-keep text-muted'>
            {WORK.description}
          </p>
        </div>

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
