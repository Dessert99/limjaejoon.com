/** 공용 HoverCard — Radix HoverCard 위에 floating 패널 스타일만 입힌 hover/focus 보조 카드 */
import { HoverCard as HoverCardPrimitive } from 'radix-ui'; // 열기/닫기 지연·위치계산·Portal·디스미스·hover+focus 트리거를 Radix가 처리
import { forwardRef } from 'react';
import { content } from './HoverCard.css';

/** 묶음 — 열림 상태·지연(openDelay/closeDelay) 컨텍스트만 제공(DOM 없음) */
const Root = HoverCardPrimitive.Root;

/** 트리거 — hover/focus로 카드를 여는 링크(`<a>`), 클릭 의미 없음(aria-haspopup 없음). 스타일은 소비자 몫 */
const Trigger = HoverCardPrimitive.Trigger;

/** 패널 — Portal을 내장해 body에 띄움. 비대화형 보조 정보라 포커스를 가두지 않는다 */
const Content = forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        className={[content, className].filter(Boolean).join(' ')}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
});
Content.displayName = 'HoverCard.Content';

/** 네임스페이스 — <HoverCard.Root><HoverCard.Trigger /><HoverCard.Content /></HoverCard.Root> (Portal은 Content가 내장) */
export const HoverCard = { Root, Trigger, Content };
