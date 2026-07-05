import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../../model/presets';
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
  it('@keyframes 원문과 animation 선언을 함께 보여준다', () => {
    render(<CodePanel config={DEFAULT_CONFIG} />);

    const panel = screen.getByRole('region', { name: 'CSS 코드' });
    expect(panel.textContent).toContain('@keyframes slide {');
    expect(panel.textContent).toContain(
      'animation: slide 1200ms ease 0ms infinite alternate none running;'
    );
  });

  it('복사 버튼이 키프레임과 선언 전체를 클립보드에 쓴다', async () => {
    render(<CodePanel config={DEFAULT_CONFIG} />);

    fireEvent.click(screen.getByRole('button', { name: '복사' }));
    expect(writeText).toHaveBeenCalledTimes(1);
    const copied = writeText.mock.calls[0][0] as string;
    expect(copied).toContain('@keyframes slide {');
    expect(copied).toContain(
      'animation: slide 1200ms ease 0ms infinite alternate none running;'
    );
    expect(await screen.findByText('복사됐어요')).toBeInTheDocument();
  });
});
