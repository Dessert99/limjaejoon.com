/** 공용 Accordion — Radix Accordion 위에 카드 테두리·헤더·패널 스타일만 입힌 디스클로저 */
import { Accordion as AccordionPrimitive } from 'radix-ui'; // single/multiple·collapsible 상태·region aria·키보드를 Radix가 처리
import { forwardRef } from 'react';
import { content, header, item, root, trigger } from './Accordion.css';

/** 묶음 — Radix Accordion.Root props(type='single'|'multiple', collapsible 등) + 외부 className */
const Root = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Root.displayName = 'Accordion.Root';

/** 항목 — 한 섹션(value 필수), 펼침 상태를 data-state로 보유 */
const Item = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={[item, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Item.displayName = 'Accordion.Item';

/** 헤더 — Radix가 heading(h3)으로 렌더해 트리거를 제목 의미로 감싼다 */
const Header = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Header>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Header
      ref={ref}
      className={[header, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Header.displayName = 'Accordion.Header';

/** 트리거 — 열고닫는 버튼(aria-expanded·aria-controls를 Radix가 부여) */
const Trigger = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Trigger
      ref={ref}
      className={[trigger, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Trigger.displayName = 'Accordion.Trigger';

/** 패널 — 열렸을 때만 마운트되는 region 본문 */
const Content = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={[content, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Content.displayName = 'Accordion.Content';

/** 네임스페이스 — <Accordion.Root><Accordion.Item><Accordion.Header><Accordion.Trigger /></Accordion.Header><Accordion.Content /></Accordion.Item></Accordion.Root> */
export const Accordion = { Root, Item, Header, Trigger, Content };
