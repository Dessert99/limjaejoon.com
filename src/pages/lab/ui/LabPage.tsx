/** Lab — 실험을 늘어놓는 자리. 지금은 우주 배경과 행성까지 세운다 */
import { LabBackdrop } from './LabBackdrop/LabBackdrop';
import { LabPlanet } from './LabPlanet/LabPlanet';

/** lab 페이지 구성 */
export function LabPage() {
  return (
    <>
      <LabBackdrop />

      {/* 배경이 z-base 로 깔려 있어 본문은 스스로 층을 올려야 한다 */}
      <main className='relative z-(--ds-z-content) flex grow flex-col items-center justify-center gap-10 px-lab-gutter text-center'>
        <LabPlanet />
      </main>
    </>
  );
}
