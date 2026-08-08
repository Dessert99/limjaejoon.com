/** 기술 칩 — 타임라인과 마퀴가 같은 모양을 쓴다 */

/* 빈 상자는 지금부터 자리를 차지한다 — 나중에 로고를 넣어도 칩 폭이 안 흔들린다 */
export function StackChip({ name }: { name: string }) {
  return (
    <span className='inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-body-sm whitespace-nowrap text-foreground'>
      <span
        aria-hidden='true'
        className='size-4 shrink-0 rounded-sm border border-input'
      />
      {name}
    </span>
  );
}
