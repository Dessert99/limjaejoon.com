/** Lab — 실험을 늘어놓는 자리. 지금은 우주 배경과 표제만 세운다 */
import { LabBackdrop } from './LabBackdrop/LabBackdrop';

/** lab 페이지 구성 */
export function LabPage() {
  return (
    <>
      <LabBackdrop />

      {/* 배경이 z-base 로 깔려 있어 본문은 스스로 층을 올려야 한다 */}
      <main className='relative z-(--ds-z-content) flex grow flex-col items-center justify-center gap-5 px-lab-gutter text-center'>
        <h1 className='text-lab-title text-lab-foreground'>랩</h1>
        <p className='max-w-lab-measure text-lab-body break-keep text-lab-muted'>
          제품이 되기 전의 것들 — 만들다 만 것과 실험 중인 것.
        </p>
      </main>
    </>
  );
}
