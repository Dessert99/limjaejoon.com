'use client';
// 다크/라이트 테마 토글 훅 — React 외부 상태(localStorage)를 useSyncExternalStore로 구독해 컴포넌트와 동기화
import { darkTheme, lightTheme } from '@/styles/theme.css';
import { useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

// localStorage 키 상수화 — 다른 곳에서 같은 키를 쓸 때 오타·중복 방지
const STORAGE_KEY = 'theme';

// 현재 테마 읽기 — SSR(window 없음) 환경에선 'dark' 디폴트, 클라이언트에선 localStorage 값 사용
function getTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'dark';
}

// useSyncExternalStore에 넘길 구독 함수 — 외부 변경(테마 변경)을 React에 "다시 읽어"라고 알리는 채널
function subscribe(callback: () => void) {
  // 'storage' 이벤트는 다른 탭에서 localStorage 변경 시 자동 발생 — 탭 간 동기화 담당
  window.addEventListener('storage', callback);
  // 'theme-change'는 우리가 직접 쏘는 커스텀 이벤트 — 같은 탭에서 토글 시 갱신 담당 (toggleTheme 참조)
  window.addEventListener('theme-change', callback);
  // useSyncExternalStore는 컴포넌트 unmount 시 이 cleanup 함수를 호출해 리스너 해제
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('theme-change', callback);
  };
}

export function useTheme() {
  // useSyncExternalStore(구독, 클라이언트 스냅샷, 서버 스냅샷) — 3번째 인자는 SSR hydration mismatch 방지용 서버 기본값
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    () => {
return 'dark' as Theme
}
  );

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    // 영속화 — 새로고침·다른 탭에도 유지
    localStorage.setItem(STORAGE_KEY, next);
    // <html>의 테마 클래스 교체 — vanilla-extract가 빌드 시 생성한 해시 클래스명(darkTheme/lightTheme)을 토글
    // 두 클래스를 모두 제거한 뒤 하나만 추가해 "동시에 둘 다 켜져 있는" 상태 방지
    document.documentElement.classList.remove(darkTheme, lightTheme);
    document.documentElement.classList.add(
      next === 'dark' ? darkTheme : lightTheme
    );
    // storage 이벤트는 다른 탭에서만 발생하므로, 같은 탭의 useSyncExternalStore를 갱신하기 위해 커스텀 이벤트를 발행
    window.dispatchEvent(new Event('theme-change'));
  };

  // as const로 리터럴 타입 보존 — 호출 측에서 theme이 'dark'|'light' 유니온으로 정확히 추론됨
  return { theme, toggleTheme } as const;
}
