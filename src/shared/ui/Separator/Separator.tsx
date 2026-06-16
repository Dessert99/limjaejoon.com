/** 공용 Separator — Radix Separator 위에 선 스타일만 입힌 구분선 */
import { Separator as SeparatorPrimitive } from 'radix-ui'; // role=separator/decorative·aria-orientation을 Radix가 처리
import { forwardRef } from 'react';
import { separator } from './Separator.css';

/** Radix Separator.Root props(orientation·decorative 포함) + 외부 className */
type SeparatorProps = React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
>;

/** 가로/세로 구분선 — decorative면 보조기기에서 숨김 */
export const Separator = forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      className={[separator, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});

Separator.displayName = 'Separator';
