import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Select } from './Select';

function renderSelect() {
  return render(
    <Select.Root open>
      <Select.Trigger
        aria-label='테마'
        className='select-trigger'>
        <Select.Value placeholder='테마 선택' />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Content className='select-panel'>
        <Select.Item
          value='afternoon'
          className='select-item'>
          <Select.ItemText>오후</Select.ItemText>
          <Select.ItemIndicator>✓</Select.ItemIndicator>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
}

describe('Select', () => {
  it('Trigger와 Content와 Item에 외부 className을 병합한다', () => {
    const { baseElement } = renderSelect();

    expect(baseElement.querySelector('.select-trigger')).toBeInTheDocument();
    expect(screen.getByRole('listbox')).toHaveClass('select-panel');
    expect(screen.getByRole('option', { name: '오후' })).toHaveClass(
      'select-item'
    );
  });
});
