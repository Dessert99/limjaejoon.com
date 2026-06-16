import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToggleGroup } from './ToggleGroup';

describe('ToggleGroup', () => {
  it('single 타입은 한 번에 한 항목만 선택한다', async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup.Root
        type='single'
        aria-label='정렬'
        onValueChange={onValueChange}>
        <ToggleGroup.Item value='left'>왼쪽</ToggleGroup.Item>
        <ToggleGroup.Item value='center'>가운데</ToggleGroup.Item>
      </ToggleGroup.Root>
    );

    await userEvent.click(screen.getByText('왼쪽'));
    expect(onValueChange).toHaveBeenLastCalledWith('left');

    await userEvent.click(screen.getByText('가운데'));
    expect(onValueChange).toHaveBeenLastCalledWith('center');
  });

  it('multiple 타입은 여러 항목을 선택한다', async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup.Root
        type='multiple'
        aria-label='스타일'
        onValueChange={onValueChange}>
        <ToggleGroup.Item value='bold'>B</ToggleGroup.Item>
        <ToggleGroup.Item value='italic'>I</ToggleGroup.Item>
      </ToggleGroup.Root>
    );

    await userEvent.click(screen.getByText('B'));
    await userEvent.click(screen.getByText('I'));

    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
  });
});
