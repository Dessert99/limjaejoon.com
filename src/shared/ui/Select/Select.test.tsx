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

  it('Trigger가 invalid 상태를 접근성 속성과 data 속성으로 노출한다', () => {
    render(
      <Select.Root>
        <Select.Trigger
          aria-label='테마'
          invalid>
          <Select.Value placeholder='테마 선택' />
        </Select.Trigger>
      </Select.Root>
    );

    const trigger = screen.getByRole('combobox', { name: '테마' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAttribute('data-invalid');
  });

  it('Trigger에 직접 전달한 aria-invalid도 data-invalid 상태와 동기화한다', () => {
    render(
      <Select.Root>
        <Select.Trigger
          aria-label='테마'
          aria-invalid>
          <Select.Value placeholder='테마 선택' />
        </Select.Trigger>
      </Select.Root>
    );

    const trigger = screen.getByRole('combobox', { name: '테마' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAttribute('data-invalid');
  });
});
