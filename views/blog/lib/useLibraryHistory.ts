'use client';

import { useSyncExternalStore } from 'react';

/** 서재가 쌓는 기록 칸. pushed는 우리가 push한 칸이라 back()으로 걷어도 서재를 안 떠난다는 표시다. */
type LibraryState = { pile?: string; pushed?: boolean };

const listeners = new Set<() => void>();
let popstateBound = false;

const notify = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);

  // 뒤로 가기는 push/replace를 안 거치므로 popstate를 따로 받아야 방이 따라온다
  if (!popstateBound) {
    window.addEventListener('popstate', notify);
    popstateBound = true;
  }

  return () => {
    listeners.delete(onStoreChange);
  };
};

const readState = (): LibraryState => {
  return (window.history.state ?? {}) as LibraryState;
};

// 스냅샷은 문자열이어야 매번 새 객체로 무한 렌더가 돌지 않는다. 주소의 책과 기록 칸의 더미를 한 줄로 묶는다
const getSnapshot = () => {
  return `${window.location.search}\n${readState().pile ?? ''}`;
};

// 서버에는 주소창도 기록도 없다. 빈 값으로 맞춰야 하이드레이션이 어긋나지 않는다
const getServerSnapshot = () => {
  return '\n';
};

// Next가 pushState/replaceState를 가로채 자기 상태를 덧붙이므로, 넘긴 객체에 우리 키만 담아도 라우터가 깨지지 않는다
const push = (state: LibraryState, url?: string) => {
  window.history.pushState(state, '', url);
  notify();
};

const replace = (state: LibraryState, url?: string) => {
  window.history.replaceState(state, '', url);
  notify();
};

/** 펼친 더미·연 책을 브라우저 기록에 한 칸씩 쌓아, 뒤로 가기가 책 → 더미 → 서재 순으로 하나씩 닫게 한다. */
export const useLibraryHistory = () => {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [search, pileValue] = snapshot.split('\n');
  const book = new URLSearchParams(search).get('book') ?? '';
  const pile = pileValue || null;

  // 더미끼리 옮겨 다니는 건 덮어써서, 몇 번을 옮겨도 뒤로 한 번에 접힌다. 주소는 안 바꿔 Next 라우터가 돌지 않는다
  const spread = (group: string) => {
    if (group === pile) {
      return;
    }

    const state = readState();

    if (state.pushed) {
      replace({ pile: group, pushed: true });
    } else {
      push({ pile: group, pushed: true });
    }
  };

  const open = (slug: string) => {
    push(
      { pile: pile ?? undefined, pushed: true },
      `?book=${encodeURIComponent(slug)}`
    );
  };

  // 우리가 쌓은 칸이면 back()으로 걷어 기록과 화면을 맞춘다. 공유 링크로 바로 들어온 칸은 back()하면 서재를 떠나므로 덮어써 지운다
  const close = (fallbackPile: string | null) => {
    if (readState().pushed) {
      window.history.back();
    } else {
      replace({ pile: fallbackPile ?? undefined }, window.location.pathname);
    }
  };

  const fold = () => {
    if (!pile) {
      return;
    }

    if (readState().pushed) {
      window.history.back();
    } else {
      replace({});
    }
  };

  return { pile, book, spread, open, close, fold };
};
