import type { MouseEvent } from 'react';

/** 수정 키 없이 왼쪽 클릭으로 같은 탭에서 사이트 안을 옮기는지. 이때만 커튼을 내린다. */
export const isPlainNavigation = (
  event: MouseEvent<HTMLAnchorElement>,
  href: string
): boolean => {
  return (
    href.startsWith('/') &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.currentTarget.target
  );
};
