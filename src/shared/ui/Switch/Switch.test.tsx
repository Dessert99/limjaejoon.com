import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('switch 역할로 렌더하고 클릭하면 on/off가 토글된다', async () => {
    render(
      <Switch.Root aria-label='알림'>
        <Switch.Thumb />
      </Switch.Root>
    );

    const sw = screen.getByRole('switch', { name: '알림' });
    expect(sw).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(sw);

    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('Space 키로도 토글된다', async () => {
    render(
      <Switch.Root aria-label='알림'>
        <Switch.Thumb />
      </Switch.Root>
    );

    const sw = screen.getByRole('switch', { name: '알림' });
    sw.focus();
    await userEvent.keyboard(' ');

    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('disabled면 onCheckedChange가 호출되지 않는다', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch.Root
        aria-label='알림'
        disabled
        onCheckedChange={onCheckedChange}>
        <Switch.Thumb />
      </Switch.Root>
    );

    await userEvent.click(screen.getByRole('switch'));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
