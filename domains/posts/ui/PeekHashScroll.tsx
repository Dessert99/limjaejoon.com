'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** 피크가 뜨면 주소의 #소제목을 피크 안 접두사 붙은 제목에서 찾아 그 자리로 스크롤한다. */
export function PeekHashScroll({ idPrefix }: { idPrefix: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));

    if (!hash) {
      return;
    }

    // 칩이 scroll={false}라 Next는 안 움직인다. 피크 패널만 스크롤되고 뒤의 A는 제자리에 남는다
    document.getElementById(`${idPrefix}${hash}`)?.scrollIntoView();
  }, [idPrefix, pathname]);

  return null;
}
