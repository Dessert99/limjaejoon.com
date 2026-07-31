'use client';

/** 내비게이션 context — 부품이 상태 구현이 아니라 인터페이스에 의존하게 한다 */
import { createContext, use } from 'react';

/** 항목 한 건 — config 의 as const 배열이 이 형태로 좁혀진다 */
export interface NavItem {
  label: string;
  href: string;
}

/** state·actions·meta 3분할 — 어떤 Provider 든 이 계약만 채우면 부품이 그대로 돈다 */
export interface NavigationContextValue {
  state: { items: readonly NavItem[] };
  actions: {
    open: () => void;
    close: () => void;
    navigate: (href: string) => void;
  };
  // RefObject 가 아니라 콜백 ref 다 — context 의 ref 를 렌더 중에 쓰면 react-hooks/refs 가 막는다
  meta: { attachDialog: (element: HTMLDialogElement | null) => void };
}

export const NavigationContext = createContext<NavigationContextValue | null>(
  null
);

/** 부품이 context 를 읽는 유일한 통로 — Provider 밖 사용은 조용히 죽지 않고 즉시 터진다 */
export function useNavigation(): NavigationContextValue {
  const value = use(NavigationContext);

  if (value === null) {
    throw new Error('Navigation 부품은 Navigation.Provider 안에서만 쓴다');
  }

  return value;
}
