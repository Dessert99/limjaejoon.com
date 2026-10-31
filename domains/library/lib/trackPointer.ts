import { type PointerEvent } from 'react';

/** 책 색 원의 중심을 포인터 자리로 옮긴다. 들어온 자리에서 퍼지고 나간 자리로 오그라든다. */
export const trackPointer = (event: PointerEvent<HTMLAnchorElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();

  event.currentTarget.style.setProperty(
    '--x',
    `${event.clientX - rect.left}px`
  );
  event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`);
};
