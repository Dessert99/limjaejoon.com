/** 공용 RadioGroup — Radix RadioGroup 위에 원/점 스타일만 입힌 단일선택 그룹 */
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'; // radiogroup·roving tabindex·화살표 단일선택을 Radix가 처리
import { forwardRef } from 'react';
import { indicator, item, root } from './RadioGroup.css';

/** 묶음 — Radix RadioGroup.Root props + 외부 className 병합 */
const Root = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={[root, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Root.displayName = 'RadioGroup.Root';

/** 항목 — 각 선택지(value 필수) */
const Item = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={[item, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Item.displayName = 'RadioGroup.Item';

/** 선택 점 — 선택된 항목에서만 Radix가 마운트 */
const Indicator = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Indicator
    ref={ref}
    className={[indicator, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Indicator.displayName = 'RadioGroup.Indicator';

/** 네임스페이스 — <RadioGroup.Root><RadioGroup.Item><RadioGroup.Indicator /></RadioGroup.Item></RadioGroup.Root> */
export const RadioGroup = { Root, Item, Indicator };
