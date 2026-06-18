/** 공용 Popover — Radix Popover 위에 floating 패널 스타일만 입힌 비모달 오버레이 */
import { Popover as PopoverPrimitive } from 'radix-ui'; // 위치계산·바깥클릭/Esc 닫기·포커스 관리·aria를 Radix가 처리
import { forwardRef } from 'react';
import { content } from './Popover.css';

/** 묶음 — 열림 상태 컨텍스트만 제공(DOM 없음), props는 Radix Popover.Root 그대로 통과 */
const Root = PopoverPrimitive.Root;

/** 트리거 — 여닫는 버튼(aria-expanded·aria-controls·aria-haspopup을 Radix가 부여), 스타일은 asChild로 소비자 몫 */
const Trigger = PopoverPrimitive.Trigger;

/** 패널 — Portal을 내장해 소비자는 Content 하나만 두면 body로 띄워져 잘림(clipping) 걱정 없음 */
const Content = forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        className={[content, className].filter(Boolean).join(' ')}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
Content.displayName = 'Popover.Content';

/** 네임스페이스 — <Popover.Root><Popover.Trigger /><Popover.Content /></Popover.Root> (Portal은 Content가 내장) */
export const Popover = { Root, Trigger, Content };
