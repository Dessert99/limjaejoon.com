/** 공용 ToggleGroup — Radix ToggleGroup 위에 분절 버튼 스타일만 입힌 토글 묶음 */
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'; // single/multiple 선택·roving focus·그룹 aria를 Radix가 처리
import { forwardRef } from 'react';
import { item, root } from './ToggleGroup.css';

/** 묶음 — Radix ToggleGroup.Root props(type·value 포함) + 외부 className */
const Root = forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Root.displayName = 'ToggleGroup.Root';

/** 항목 — 각 토글(value 필수) */
const Item = forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={[item, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Item.displayName = 'ToggleGroup.Item';

/** 네임스페이스 — <ToggleGroup.Root type="single"><ToggleGroup.Item /></ToggleGroup.Root> */
export const ToggleGroup = { Root, Item };
