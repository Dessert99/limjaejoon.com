/** 공용 DropdownMenu — Radix DropdownMenu 위에 메뉴 패널·항목 스타일만 입힌 액션 메뉴 */
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'; // 위치계산·Portal·roving 포커스·타입어헤드·디스미스·menu aria를 Radix가 처리
import { forwardRef } from 'react';
import { content, item, label, separator } from './DropdownMenu.css';

/** 묶음 — 열림 상태 컨텍스트만 제공(DOM 없음) */
const Root = DropdownMenuPrimitive.Root;

/** 트리거 — 메뉴를 여는 버튼(aria-haspopup="menu"·aria-expanded를 Radix가 부여), 스타일은 asChild로 소비자 몫 */
const Trigger = DropdownMenuPrimitive.Trigger;

/** 패널 — Portal을 내장해 body에 띄운 role="menu" 컨테이너 */
const Content = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        className={[content, className].filter(Boolean).join(' ')}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
Content.displayName = 'DropdownMenu.Content';

/** 항목 — role="menuitem" 액션 한 줄, onSelect로 선택 처리 후 자동 닫힘 */
const Item = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={[item, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Item.displayName = 'DropdownMenu.Item';

/** 라벨 — 항목 묶음의 비선택 제목 */
const Label = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={[label, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Label.displayName = 'DropdownMenu.Label';

/** 구분선 — role="separator" 가로선 */
const Separator = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={[separator, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Separator.displayName = 'DropdownMenu.Separator';

/** 네임스페이스 — Root·Trigger·Content·Item·Label·Separator (Portal은 Content가 내장; Checkbox/Radio/Sub는 소비자 요구 시 추가) */
export const DropdownMenu = { Root, Trigger, Content, Item, Label, Separator };
