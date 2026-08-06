'use client';

/** URL 쿼리를 필터 상태의 출처로 삼는다 — 새로고침·공유·뒤로가기가 모두 같은 규칙을 탄다 */
import { useCallback, useSyncExternalStore } from 'react';

/** 목록을 좁히는 세 조건 */
export type UrlFilters = {
  q: string;
  tag: string;
  series: string;
};

export const EMPTY_FILTERS: UrlFilters = { q: '', tag: '', series: '' };

const listeners = new Set<() => void>();
let popstateBound = false;

const notify = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);

  // 뒤로가기로 URL 이 바뀌어도 목록이 따라오게 한 번만 건다
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

// 서버 스냅샷은 빈 조건이다 — 정적 HTML 에 전체 글이 남아야 크롤러가 목록을 본다
const getServerSnapshot = () => {
  return '';
};

/** 현재 URL 의 조건과, 그 조건을 갈아 끼우는 함수를 돌려준다 */
export const useUrlFilters = (): [UrlFilters, (next: UrlFilters) => void] => {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const params = new URLSearchParams(search);
  const filters: UrlFilters = {
    q: params.get('q') ?? '',
    tag: params.get('tag') ?? '',
    series: params.get('series') ?? '',
  };

  const setFilters = useCallback((next: UrlFilters) => {
    const nextParams = new URLSearchParams();

    if (next.q) {
      nextParams.set('q', next.q);
    }
    if (next.tag) {
      nextParams.set('tag', next.tag);
    }
    if (next.series) {
      nextParams.set('series', next.series);
    }

    const nextSearch = nextParams.toString();

    // history API 를 직접 쓴다 — router 로 갈면 키 입력마다 정적 페이지를 다시 받아온다
    window.history.replaceState(
      null,
      '',
      nextSearch ? `?${nextSearch}` : window.location.pathname
    );
    notify();
  }, []);

  return [filters, setFilters];
};
