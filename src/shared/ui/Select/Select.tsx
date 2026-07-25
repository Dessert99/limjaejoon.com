/** 공용 Select — Radix Select 위에 트리거·옵션 패널 스타일만 입힌 폼 셀렉트 */
import { Select as SelectPrimitive } from 'radix-ui'; // 값 상태·위치계산·Portal·타입어헤드·listbox aria·키보드를 Radix가 처리
import { forwardRef } from 'react';
import { content, iconWell, item, trigger } from './Select.css';

/** 묶음 — 선택 값(value·onValueChange) 컨텍스트만 제공(DOM 없음) */
const Root = SelectPrimitive.Root;

/** 값 표시 — 선택된 항목의 ItemText(없으면 placeholder)를 트리거 안에 렌더 */
const Value = SelectPrimitive.Value;

/** 아이콘 — Radix Icon을 분리된 웰(well)로 감싼 펼침 표식 자리(글리프는 소비자가 children으로) */
const Icon = forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Icon>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Icon>
>(({ className, ...props }, ref) => {
  return (
    <span className={iconWell}>
      <SelectPrimitive.Icon
        ref={ref}
        className={className}
        {...props}
      />
    </span>
  );
});
Icon.displayName = 'Select.Icon';

/** Trigger props — Radix trigger 속성에 디자인 시스템 invalid 상태를 더한다 */
interface SelectTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  invalid?: boolean;
}

/** 트리거 — 현재 값을 보이고 목록을 여는 버튼(role="combobox") */
const Trigger = forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, invalid = false, ...props }, ref) => {
  const isInvalid =
    invalid ||
    props['aria-invalid'] === true ||
    props['aria-invalid'] === 'true';

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={[trigger, className].filter(Boolean).join(' ')}
      {...props}
      aria-invalid={isInvalid ? true : props['aria-invalid']}
      data-invalid={isInvalid ? '' : undefined}
    />
  );
});
Trigger.displayName = 'Select.Trigger';

/** 패널 — Portal + Viewport(Select 필수 구조)를 내장해 소비자는 Content 안에 Item만 둔다 */
const Content = forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={[content, className].filter(Boolean).join(' ')}
        {...props}>
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
Content.displayName = 'Select.Content';

/** 항목 — role="option" 한 줄, value 필수 */
const Item = forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={[item, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Item.displayName = 'Select.Item';

/** 항목 텍스트 — Value가 선택 표시에 재사용하는 라벨 */
const ItemText = SelectPrimitive.ItemText;

/** 선택 표식 — 선택된 항목에만 렌더(글리프는 소비자가 children으로) */
const ItemIndicator = SelectPrimitive.ItemIndicator;

/** 네임스페이스 — Root·Trigger·Value·Icon·Content·Item·ItemText·ItemIndicator (Portal·Viewport는 Content 내장; Group·Label·ScrollButton은 deferred) */
export const Select = {
  Root,
  Trigger,
  Value,
  Icon,
  Content,
  Item,
  ItemText,
  ItemIndicator,
};
