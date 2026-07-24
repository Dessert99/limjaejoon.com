'use client';

/** 현재 적용 테마를 읽고 전환하는 훅 — :root data-theme을 구독하고 localStorage와 함께 갱신 */
import { useCallback, useSyncExternalStore } from 'react';
import { THEME_STORAGE_KEY } from './themeScript';

/** 실제 적용 가능한 테마 값 */
export type Theme = 'light' | 'dark';

// 명시 선택(data-theme)이 없으면 기본값 dark — OS 스킴은 따르지 않는다(theme.css와 같은 규칙)
const readTheme = (): Theme => {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') {
    return explicit;
  }
  return 'dark';
};

// :root의 data-theme 변경을 구독 — 어디서 바꾸든(다른 토글·부트 스크립트) 훅 상태가 따라온다
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ['data-theme'],
  });
  return () => {
    return observer.disconnect();
  };
};

/** 현재 테마와 setTheme을 제공 — 서버 스냅샷은 기본값 dark로 두고 클라이언트에서 실제 값을 읽는다 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => {
    return 'dark' as Theme;
  });

  const setTheme = useCallback((next: Theme) => {
    // DOM 속성만 바꾸면 MutationObserver 경유로 상태가 갱신된다 — 상태 이중화 없음
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  return { theme, setTheme };
}
