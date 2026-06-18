import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

// 테마 2개짜리 셀렉트 — 동작 검증용 공통 마크업
function renderSelect(onValueChange?: (value: string) => void) {
  return render(
    <Select.Root onValueChange={onValueChange}>
      <Select.Trigger aria-label='테마'>
        <Select.Value placeholder='테마 선택' />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value='afternoon'>
          <Select.ItemText>오후</Select.ItemText>
          <Select.ItemIndicator>✓</Select.ItemIndicator>
        </Select.Item>
        <Select.Item value='night'>
          <Select.ItemText>밤</Select.ItemText>
          <Select.ItemIndicator>✓</Select.ItemIndicator>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
}

describe('Select', () => {
  it('선택 전에는 placeholder를 보이고 클릭하면 옵션이 열린다', async () => {
    renderSelect();

    const trigger = screen.getByRole('combobox', { name: '테마' });
    expect(trigger).toHaveTextContent('테마 선택');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '오후' })).toBeInTheDocument();
  });

  it('옵션을 선택하면 onValueChange가 불리고 트리거에 선택값이 표시된다', async () => {
    const onValueChange = vi.fn();
    renderSelect(onValueChange);

    await userEvent.click(screen.getByRole('combobox', { name: '테마' }));
    await userEvent.click(screen.getByRole('option', { name: '밤' }));

    expect(onValueChange).toHaveBeenCalledWith('night');
    expect(screen.getByRole('combobox', { name: '테마' })).toHaveTextContent(
      '밤'
    );
  });
});
