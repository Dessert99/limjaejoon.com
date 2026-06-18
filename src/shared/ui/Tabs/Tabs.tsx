/** 공용 Tabs — Radix Tabs 위에 탭 줄·활성 밑줄 스타일만 입힌 콘텐츠 전환 */
import { Tabs as TabsPrimitive } from 'radix-ui'; // roving focus·자동/수동 활성화·tab/tabpanel aria를 Radix가 처리
import { forwardRef } from 'react';
import { content, list, root, trigger } from './Tabs.css';

/** 묶음 — Radix Tabs.Root props(value·defaultValue·activationMode 등) + 외부 className */
const Root = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Root.displayName = 'Tabs.Root';

/** 탭 줄 — role=tablist + roving focus 컨테이너 */
const List = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={[list, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
List.displayName = 'Tabs.List';

/** 트리거 — role=tab 버튼(value로 패널 연결), 활성 상태는 data-state */
const Trigger = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={[trigger, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Trigger.displayName = 'Tabs.Trigger';

/** 패널 — role=tabpanel(선택된 value만 마운트) */
const Content = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={[content, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Content.displayName = 'Tabs.Content';

/** 네임스페이스 — <Tabs.Root><Tabs.List><Tabs.Trigger /></Tabs.List><Tabs.Content /></Tabs.Root> */
export const Tabs = { Root, List, Trigger, Content };
