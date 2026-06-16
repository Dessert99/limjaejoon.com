import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('radiogroup과 radio 항목을 렌더한다', () => {
    render(
      <RadioGroup.Root
        aria-label='요금제'
        defaultValue='free'>
        <RadioGroup.Item value='free'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <RadioGroup.Item value='pro'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </RadioGroup.Root>
    );

    expect(
      screen.getByRole('radiogroup', { name: '요금제' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('항목을 클릭하면 단일 선택된다', async () => {
    render(
      <RadioGroup.Root
        aria-label='요금제'
        defaultValue='free'>
        <RadioGroup.Item value='free'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <RadioGroup.Item value='pro'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </RadioGroup.Root>
    );

    const [free, pro] = screen.getAllByRole('radio');
    expect(free).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(pro);

    expect(pro).toHaveAttribute('aria-checked', 'true');
    expect(free).toHaveAttribute('aria-checked', 'false');
  });

  it('onValueChange로 선택을 알린다', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root
        aria-label='요금제'
        onValueChange={onValueChange}>
        <RadioGroup.Item value='free'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <RadioGroup.Item value='pro'>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </RadioGroup.Root>
    );

    await userEvent.click(screen.getAllByRole('radio')[1]);

    expect(onValueChange).toHaveBeenCalledWith('pro');
  });
});
