/** 공용 Menubar — Radix Menubar 위에 가로 메뉴바·메뉴 패널 스타일만 입힌 데스크톱식 메뉴 */
import { Menubar as MenubarPrimitive } from 'radix-ui'; // 메뉴 간 가로 roving·각 메뉴의 Portal/포커스/타입어헤드·menubar aria를 Radix가 처리
import { forwardRef } from 'react';
import { content, item, label, root, separator, trigger } from './Menubar.css';

/** 바 — role="menubar" 컨테이너, 트리거들을 가로 roving으로 묶는다 */
const Root = forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Root.displayName = 'Menubar.Root';

/** 메뉴 — 한 메뉴의 열림 상태 컨텍스트만 제공(DOM 없음) */
const Menu = MenubarPrimitive.Menu;

/** 트리거 — 바 위의 메뉴 이름 버튼(role="menuitem"·aria-haspopup="menu") */
const Trigger = forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Trigger
      ref={ref}
      className={[trigger, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Trigger.displayName = 'Menubar.Trigger';

/** 패널 — Portal을 내장해 body에 띄운 role="menu" 컨테이너 */
const Content = forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        className={[content, className].filter(Boolean).join(' ')}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
});
Content.displayName = 'Menubar.Content';

/** 항목 — role="menuitem" 액션 한 줄, onSelect로 선택 처리 후 자동 닫힘 */
const Item = forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Item
      ref={ref}
      className={[item, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Item.displayName = 'Menubar.Item';

/** 라벨 — 항목 묶음의 비선택 제목 */
const Label = forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>
>(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Label
      ref={ref}
      className={[label, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Label.displayName = 'Menubar.Label';

/** 구분선 — role="separator" 가로선 */
const Separator = forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Separator
      ref={ref}
      className={[separator, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Separator.displayName = 'Menubar.Separator';

/** 네임스페이스 — Root·Menu·Trigger·Content·Item·Label·Separator (Portal은 Content 내장; Checkbox/Radio/Sub는 소비자 요구 시 추가) */
export const Menubar = {
  Root,
  Menu,
  Trigger,
  Content,
  Item,
  Label,
  Separator,
};
