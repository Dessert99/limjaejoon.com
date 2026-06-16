/** 공용 Progress — Radix Progress 위에 트랙/막대 스타일을 입힌 진행 표시 */
import { Progress as ProgressPrimitive } from 'radix-ui'; // role=progressbar·aria-valuenow/max·indeterminate data-state를 Radix가 처리
import { forwardRef } from 'react';
import { indicator, root } from './Progress.css';

/** Radix Progress.Root props(value·max 포함) + 외부 className */
type ProgressProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
>;

/** value(0~max) 비율만큼 막대를 채운다. value 미지정이면 Radix가 indeterminate 처리 */
export const Progress = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, max = 100, ...props }, ref) => {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={value}
      max={max}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}>
      {/* 채움 막대 위치 연출만 우리 몫 — 부족분만큼 왼쪽으로 밀어 비율 표시 */}
      <ProgressPrimitive.Indicator
        className={indicator}
        style={{
          transform: `translateX(-${100 - ((value ?? 0) / max) * 100}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = 'Progress';
