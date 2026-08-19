'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type UrlFilters = {
  q: string;
  tags: string[];
};

export const EMPTY_FILTERS: UrlFilters = { q: '', tags: [] };

const listeners = new Set<() => void>();
let popstateBound = false;

const notify = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);

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

const getServerSnapshot = () => {
  return '';
};

export const useUrlFilters = (): [UrlFilters, (next: UrlFilters) => void] => {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const params = new URLSearchParams(search);
  const filters: UrlFilters = {
    q: params.get('q') ?? '',
    tags: params.getAll('tag'),
  };

  const setFilters = useCallback((next: UrlFilters) => {
    const nextParams = new URLSearchParams();

    if (next.q) {
      nextParams.set('q', next.q);
    }
    next.tags.forEach((tag) => {
      nextParams.append('tag', tag);
    });
    const nextSearch = nextParams.toString();

    window.history.replaceState(
      null,
      '',
      nextSearch ? `?${nextSearch}` : window.location.pathname
    );
    notify();
  }, []);

  return [filters, setFilters];
};
