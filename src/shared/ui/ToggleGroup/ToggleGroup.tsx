'use client';

/** 공용 ToggleGroup — Radix ToggleGroup 위에 분절 버튼 + 슬라이드 인디케이터를 입힌 토글 묶음 */
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'; // single/multiple 선택·roving focus·그룹 aria를 Radix가 처리
import { Children, forwardRef, isValidElement, useState } from 'react';
import { indicator, item, root } from './ToggleGroup.css';

/** Radix Root props(type 판별 유니언 포함) + 외부 className */
type RootProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
>;

/** 묶음 — type="single"이면 선택 인덱스를 계산해 장식용 인디케이터 span에 주입 */
const Root = forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  RootProps
>(({ className, children, ...rest }, ref) => {
  const rootClassName = [root, className].filter(Boolean).join(' ');

  // Radix는 controlled/uncontrolled 모두 onValueChange를 호출한다 — 인디케이터 위치 계산 전용 그림자 상태
  const [shadowValue, setShadowValue] = useState(() => {
    return rest.type === 'single' ? rest.defaultValue : undefined;
  });

  if (rest.type !== 'single') {
    // multiple은 동시에 여러 항목이 켜질 수 있어 단일 위치 인디케이터가 성립하지 않는다
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        className={rootClassName}
        data-toggle-type={rest.type}
        {...rest}>
        {children}
      </ToggleGroupPrimitive.Root>
    );
  }

  const activeValue = rest.value ?? shadowValue;
  const items = Children.toArray(children).filter(isValidElement);
  const activeIndex = items.findIndex((child) => {
    return (child.props as { value?: string }).value === activeValue;
  });

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={rootClassName}
      data-toggle-type={rest.type}
      {...rest}
      onValueChange={(value: string) => {
        setShadowValue(value);
        rest.onValueChange?.(value);
      }}>
      {items.length > 0 && (
        <span
          aria-hidden
          className={indicator}
          style={
            {
              '--gt-count': items.length,
              '--gt-index': activeIndex,
              opacity: activeIndex >= 0 ? 1 : 0,
            } as React.CSSProperties
          }
        />
      )}
      {children}
    </ToggleGroupPrimitive.Root>
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
