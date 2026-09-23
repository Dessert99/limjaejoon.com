'use client';

import { useCallback, useSyncExternalStore } from 'react';

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

/** 방에서 연 책을 주소창 ?book=에 담아 공유·새로고침에도 그 책이 열린 채로 뜨게 한다. */
export const useBookParam = (): [string, (next: string) => void] => {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const book = new URLSearchParams(search).get('book') ?? '';

  const setBook = useCallback((next: string) => {
    // push가 아니라 replace라 책을 여닫을 때마다 뒤로 가기 기록이 쌓이지 않는다
    window.history.replaceState(
      null,
      '',
      next ? `?book=${encodeURIComponent(next)}` : window.location.pathname
    );
    notify();
  }, []);

  return [book, setBook];
};
