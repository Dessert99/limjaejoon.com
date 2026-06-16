import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('클릭하면 눌림 상태가 토글된다', async () => {
    render(<Toggle aria-label='굵게'>B</Toggle>);

    const btn = screen.getByRole('button', { name: '굵게' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(btn);

    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('onPressedChange로 변경을 알린다', async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle
        aria-label='굵게'
        onPressedChange={onPressedChange}>
        B
      </Toggle>
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('disabled면 토글되지 않는다', async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle
        aria-label='굵게'
        disabled
        onPressedChange={onPressedChange}>
        B
      </Toggle>
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onPressedChange).not.toHaveBeenCalled();
  });
});
