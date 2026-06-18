/** 공용 ScrollArea — Radix ScrollArea를 번들해 커스텀 세로 스크롤바를 입힌 스크롤 영역 */
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'; // 콘텐츠/뷰포트 측정·스크롤바 표시·썸 드래그를 Radix가 처리
import { forwardRef } from 'react';
import { root, scrollbar, thumb, viewport } from './ScrollArea.css';

/** 스크롤 영역 — Viewport·세로 Scrollbar·Thumb를 한 번에 묶는다(소비자는 children만, 높이는 className으로) */
export const ScrollArea = forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}>
      <ScrollAreaPrimitive.Viewport className={viewport}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation='vertical'
        className={scrollbar}>
        <ScrollAreaPrimitive.Thumb className={thumb} />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = 'ScrollArea';
