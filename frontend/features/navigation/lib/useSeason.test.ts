import { beforeEach, describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useSeason } from './useSeason';
import { SEASON_ORDER, seasonThemes } from '@/shared/styles/themes/index.css';

describe('useSeason', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('localStorage 가 비어 있으면 기본 계절은 spring 이다', () => {
    const { result } = renderHook(() => {
      return useSeason();
    });
    expect(result.current.season).toBe('spring');
  });

  it('localStorage 의 유효한 계절을 초기값으로 읽는다', () => {
    localStorage.setItem('season', 'winter');
    const { result } = renderHook(() => {
      return useSeason();
    });
    expect(result.current.season).toBe('winter');
  });

  it('localStorage 값이 유효한 계절이 아니면 기본값으로 떨어진다', () => {
    localStorage.setItem('season', 'not-a-season');
    const { result } = renderHook(() => {
      return useSeason();
    });
    expect(result.current.season).toBe('spring');
  });

  it('setSeason 은 상태·localStorage·html 클래스를 모두 갱신한다', () => {
    const { result } = renderHook(() => {
      return useSeason();
    });

    act(() => {
      result.current.setSeason('summer');
    });

    expect(result.current.season).toBe('summer');
    expect(localStorage.getItem('season')).toBe('summer');
    expect(
      document.documentElement.classList.contains(seasonThemes.summer)
    ).toBe(true);
  });

  it('setSeason 은 이전 계절 클래스를 제거해 정확히 하나만 활성화한다', () => {
    const { result } = renderHook(() => {
      return useSeason();
    });

    act(() => {
      result.current.setSeason('summer');
    });
    act(() => {
      result.current.setSeason('winter');
    });

    const active = SEASON_ORDER.filter((s) => {
      return document.documentElement.classList.contains(seasonThemes[s]);
    });
    expect(active).toEqual(['winter']);
  });
});
