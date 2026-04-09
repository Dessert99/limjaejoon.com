'use client';
import { darkTheme, lightTheme } from '@/styles/theme.css';
import { useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';

function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'dark';
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('theme-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('theme-change', callback);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    () => 'dark' as Theme
  );

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.classList.remove(darkTheme, lightTheme);
    document.documentElement.classList.add(
      next === 'dark' ? darkTheme : lightTheme
    );
    // storage 이벤트는 다른 탭에서만 발생하므로, 같은 탭의 useSyncExternalStore를 갱신하기 위해 커스텀 이벤트를 발행
    window.dispatchEvent(new Event('theme-change'));
  };

  return { theme, toggleTheme } as const;
}
