/** 공용 Toggle — Radix Toggle 위에 눌림 스타일만 입힌 단일 on/off 버튼 */
import { Toggle as TogglePrimitive } from 'radix-ui'; // aria-pressed·data-state·controlled/uncontrolled를 Radix가 처리
import { forwardRef } from 'react';
import { toggle } from './Toggle.css';

/** Radix Toggle.Root props(pressed·onPressedChange 포함) + 외부 className */
type ToggleProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>;

/** 단일 토글 버튼 — 눌림 상태를 스스로/외부 제어로 관리 */
export const Toggle = forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, ...props }, ref) => {
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={[toggle, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});

Toggle.displayName = 'Toggle';
