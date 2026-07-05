import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../model/presets';
import { CodePanel } from './CodePanel';

const writeText = vi.fn();

beforeEach(() => {
  writeText.mockClear().mockResolvedValue(undefined);
  // jsdom엔 clipboard가 없다 — 복사 API만 목으로 대체
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
});

describe('CodePanel', () => {
  it('현재 조작값을 transition 선언으로 보여준다', () => {
    render(<CodePanel config={DEFAULT_CONFIG} />);

    expect(
      screen.getByText('transition: transform 600ms ease 0ms;')
    ).toBeInTheDocument();
  });

  it('복사 버튼이 선언 전체를 클립보드에 쓴다', async () => {
    render(<CodePanel config={DEFAULT_CONFIG} />);

    fireEvent.click(screen.getByRole('button', { name: '복사' }));
    expect(writeText).toHaveBeenCalledWith(
      'transition: transform 600ms ease 0ms;'
    );
    expect(await screen.findByText('복사됐어요')).toBeInTheDocument();
  });
});
