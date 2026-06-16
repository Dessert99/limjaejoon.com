/** 공용 Checkbox — Radix Checkbox 위에 박스/체크 스타일만 입힌 체크박스 */
import { Checkbox as CheckboxPrimitive } from 'radix-ui'; // checked/indeterminate·aria-checked=mixed·폼 input을 Radix가 처리
import { forwardRef } from 'react';
import { indicator, root } from './Checkbox.css';

/** 박스 — Radix Checkbox.Root props + 외부 className 병합 */
const Root = forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Root.displayName = 'Checkbox.Root';

/** 체크 표시 — children(아이콘/문자)을 받아 표시 */
const Indicator = forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Indicator
      ref={ref}
      className={[indicator, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Indicator.displayName = 'Checkbox.Indicator';

/** 네임스페이스 — <Checkbox.Root><Checkbox.Indicator>✓</Checkbox.Indicator></Checkbox.Root> */
export const Checkbox = { Root, Indicator };
