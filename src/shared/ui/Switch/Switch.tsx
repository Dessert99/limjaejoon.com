/** 공용 Switch — Radix Switch 위에 트랙/썸 스타일만 입힌 on/off 토글 */
import { Switch as SwitchPrimitive } from 'radix-ui'; // checked 상태·키보드·ARIA switch·폼 input을 Radix가 처리
import { forwardRef } from 'react';
import { root, thumb } from './Switch.css';

/** 트랙 — Radix Switch.Root props + 외부 className 병합 */
const Root = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Root.displayName = 'Switch.Root';

/** 손잡이 — 위치 연출만 우리 몫, data-state는 Radix가 채운다 */
const Thumb = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitive.Thumb
      ref={ref}
      className={[thumb, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Thumb.displayName = 'Switch.Thumb';

/** 네임스페이스 — <Switch.Root><Switch.Thumb /></Switch.Root> */
export const Switch = { Root, Thumb };
