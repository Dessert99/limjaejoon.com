/** 공용 NavigationMenu — Radix NavigationMenu 위에 내비 바·링크 패널 스타일만 입힌 사이트 내비게이션 */
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui'; // hover 인텐트 지연·열림 상태·링크 active·nav aria를 Radix가 처리
import { forwardRef } from 'react';
import { content, item, link, list, trigger } from './NavigationMenu.css';

/** 묶음 — <nav aria-label="Main"> 래퍼, 열림 값 컨텍스트 제공(스타일은 List가 가짐) */
const Root = NavigationMenuPrimitive.Root;

/** 목록 — 항목을 가로로 늘어놓는 바(ul) */
const List = forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      className={[list, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
List.displayName = 'NavigationMenu.List';

/** 항목 — 한 메뉴(li), 콘텐츠 패널의 위치 기준 */
const Item = forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Item
      ref={ref}
      className={[item, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Item.displayName = 'NavigationMenu.Item';

/** 트리거 — 패널을 여는 버튼(hover·클릭·focus로 토글, aria-expanded를 Radix가 부여) */
const Trigger = forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      className={[trigger, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Trigger.displayName = 'NavigationMenu.Trigger';

/** 패널 — 열렸을 때 항목 아래로 뜨는 링크 묶음 (Portal 없이 인라인, 위치는 CSS) */
const Content = forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={[content, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Content.displayName = 'NavigationMenu.Content';

/** 링크 — active prop으로 현재 페이지를 표시(aria-current="page"·data-active) */
const Link = forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      className={[link, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Link.displayName = 'NavigationMenu.Link';

/** 네임스페이스 — Root·List·Item·Trigger·Content·Link (Viewport·Indicator·Sub는 deferred) */
export const NavigationMenu = { Root, List, Item, Trigger, Content, Link };
