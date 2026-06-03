'use client';
// 5계절 테마 훅 — React 외부 상태(localStorage)를 useSyncExternalStore로 구독해
// 컴포넌트와 동기화한다. 다크/라이트 토글 대신 봄·여름·가을·겨울·밤 중 하나를 고른다.
import {
  SEASON_ORDER,
  seasonThemes,
  type Season,
} from '@/shared/styles/themes/index.css';
import { useSyncExternalStore } from 'react';

// localStorage 키 상수화 — 다른 곳에서 같은 키를 쓸 때 오타·중복 방지
const STORAGE_KEY = 'season';
const DEFAULT_SEASON: Season = 'spring';

// 문자열이 유효한 계절인지 검사 — localStorage 값 신뢰 금지
const isSeason = (value: string | null): value is Season => {
  return value !== null && SEASON_ORDER.includes(value as Season);
};

// 현재 계절 읽기 — SSR(window 없음)에선 기본값, 클라이언트에선 localStorage 값
const getSeason = (): Season => {
  if (typeof window === 'undefined') {
    return DEFAULT_SEASON;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  return isSeason(stored) ? stored : DEFAULT_SEASON;
};

// useSyncExternalStore 구독 함수 — 외부 변경을 React 에 "다시 읽어"라고 알리는 채널
const subscribe = (callback: () => void) => {
  // 'storage' = 다른 탭에서 변경 시 자동 발생(탭 간 동기화)
  window.addEventListener('storage', callback);
  // 'season-change' = 같은 탭에서 setSeason 시 우리가 직접 쏘는 커스텀 이벤트
  window.addEventListener('season-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('season-change', callback);
  };
};

// lib 계층 규약(func-style: expression)에 맞춰 화살표 표현식으로 정의한 훅.
export const useSeason = () => {
  // 3번째 인자(서버 스냅샷)는 SSR hydration mismatch 방지용 기본값
  const season = useSyncExternalStore(subscribe, getSeason, () => {
    return DEFAULT_SEASON;
  });

  const setSeason = (next: Season) => {
    // 영속화 — 새로고침·다른 탭에도 유지
    localStorage.setItem(STORAGE_KEY, next);
    // <html> 의 계절 클래스 교체 — 5개를 모두 제거한 뒤 하나만 추가(중복 활성 방지).
    // 폰트 변수 클래스는 건드리지 않는다(season 해시만 토글).
    const el = document.documentElement;
    el.classList.remove(
      ...SEASON_ORDER.map((s) => {
        return seasonThemes[s];
      })
    );
    el.classList.add(seasonThemes[next]);
    // 같은 탭의 useSyncExternalStore 갱신을 위해 커스텀 이벤트 발행
    window.dispatchEvent(new Event('season-change'));
  };

  return { season, setSeason } as const;
};
