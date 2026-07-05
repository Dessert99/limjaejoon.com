/** ThemeToggle 테스트 — 클릭 한 번으로 반대 테마로 전환되는 계약을 검증 */
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '../../model/themeScript';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  afterEach(() => {
    // 옵저버가 살아있는 채로 전역 상태를 되돌리면 콜백이 터진다 — 언마운트를 먼저
    cleanup();
    delete document.documentElement.dataset.theme;
    localStorage.clear();
  });

  it('기본(다크) 상태에서 클릭하면 라이트로 전환하고 저장한다', async () => {
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button'));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('라이트 상태에서 클릭하면 다크로 전환한다', async () => {
    document.documentElement.dataset.theme = 'light';
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button'));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('전환될 테마를 알리는 접근성 레이블을 가진다', () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: '라이트 테마로 전환' })
    ).toBeInTheDocument();
  });
});
