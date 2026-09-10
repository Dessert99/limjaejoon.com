import { WorkPanel } from './WorkPanel';
import { WorkStage } from './WorkStage';

/** 어바웃 다음 한 판. 활동 로고를 3D로 세워 두고 그 옆에서 활동을 설명한다. */
export function WorkSection() {
  return (
    <WorkStage>
      <h2
        id='work-title'
        className='sr-only'>
        Work
      </h2>

      <WorkPanel
        logo='/images/work/forA.svg'
        period='2025.11 — 현재'
        role='창업팀 · 프론트엔드'
        title='forA'
        body='임시 문구입니다. 창업팀 forA에서 프론트엔드를 맡아 제품의 첫 화면부터 배포까지를 책임지고 있습니다. 아이디어가 화면이 되는 속도를 줄이는 데 집중했습니다.'
      />

      <WorkPanel
        logo='/images/work/pagelabs.svg'
        period='2026.03 — 현재'
        role='스타트업 · 프론트엔드 엔지니어'
        title='PageLabs'
        body='임시 문구입니다. PageLabs에서 프론트엔드 엔지니어로 일하며 사용자에게 닿는 인터페이스를 만들고 있습니다. 실제 사용자가 매일 쓰는 화면을 다듬는 일에서 많이 배웠습니다.'
      />
    </WorkStage>
  );
}
