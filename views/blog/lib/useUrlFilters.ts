'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** 지금 걸린 목록 조건. 검색어 하나, 책 하나다. */
export type UrlFilters = {
  q: string;
  book: string;
};

const listeners = new Set<() => void>();
let popstateBound = false;

const notify = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);

  // 뒤로 가기는 replaceState를 안 거치므로 popstate를 따로 받아야 목록이 따라온다
  if (!popstateBound) {
    window.addEventListener('popstate', notify);
    popstateBound = true;
  }

  return () => {
    listeners.delete(onStoreChange);
  };
};

const getSnapshot = () => {
  return window.location.search;
};

// 서버에는 주소창이 없다. 빈 값으로 맞춰야 하이드레이션이 어긋나지 않는다
const getServerSnapshot = () => {
  return '';
};

/** 검색어·책 필터를 주소창에 담아 공유·새로고침에도 살아남게 한다. */
export const useUrlFilters = (): [UrlFilters, (next: UrlFilters) => void] => {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const params = new URLSearchParams(search);
  const filters: UrlFilters = {
    q: params.get('q') ?? '',
    book: params.get('book') ?? '',
  };

  const setFilters = useCallback((next: UrlFilters) => {
    const nextParams = new URLSearchParams();

    // 빈 조건까지 적으면 주소에 ?q= 찌꺼기가 남는다
    if (next.q) {
      nextParams.set('q', next.q);
    }
    if (next.book) {
      nextParams.set('book', next.book);
    }
    const nextSearch = nextParams.toString();

    // push가 아니라 replace라 타이핑 한 글자마다 뒤로 가기 기록이 쌓이지 않는다
    window.history.replaceState(
      null,
      '',
      nextSearch ? `?${nextSearch}` : window.location.pathname
    );
    notify();
  }, []);

  return [filters, setFilters];
};
