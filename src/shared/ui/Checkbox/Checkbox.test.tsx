import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('클릭하면 체크 상태가 토글된다', async () => {
    render(
      <Checkbox.Root aria-label='동의'>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
    );

    const box = screen.getByRole('checkbox', { name: '동의' });
    expect(box).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(box);

    expect(box).toHaveAttribute('aria-checked', 'true');
  });

  it('indeterminate면 aria-checked를 mixed로 표시한다', () => {
    render(
      <Checkbox.Root
        aria-label='전체'
        checked='indeterminate'>
        <Checkbox.Indicator>−</Checkbox.Indicator>
      </Checkbox.Root>
    );

    expect(screen.getByRole('checkbox', { name: '전체' })).toHaveAttribute(
      'aria-checked',
      'mixed'
    );
  });

  it('disabled면 토글되지 않는다', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox.Root
        aria-label='동의'
        disabled
        onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
    );

    await userEvent.click(screen.getByRole('checkbox'));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
