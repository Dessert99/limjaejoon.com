/** useTheme 훅 테스트 — 테마 읽기·전환이 :root 속성과 localStorage에 반영되는지 검증 */
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from './themeScript';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  afterEach(() => {
    // 옵저버가 살아있는 채로 전역 상태를 되돌리면 콜백이 터진다 — 언마운트를 먼저
    cleanup();
    delete document.documentElement.dataset.theme;
    localStorage.clear();
  });

  it('data-theme이 없으면 기본값인 dark로 읽는다', () => {
    const { result } = renderHook(() => {
      return useTheme();
    });
    expect(result.current.theme).toBe('dark');
  });

  it(':root에 data-theme이 있으면 그 값을 현재 테마로 읽는다', () => {
    document.documentElement.dataset.theme = 'light';
    const { result } = renderHook(() => {
      return useTheme();
    });
    expect(result.current.theme).toBe('light');
  });

  it('setTheme은 :root 속성·localStorage·훅 상태를 함께 갱신한다', async () => {
    const { result } = renderHook(() => {
      return useTheme();
    });

    // MutationObserver 콜백은 마이크로태스크 — async act로 반영을 기다린다
    await act(async () => {
      result.current.setTheme('light');
    });
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(result.current.theme).toBe('light');
  });
});
