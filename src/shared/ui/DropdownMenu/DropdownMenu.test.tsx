import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

function renderMenu() {
  return render(
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger>메뉴</DropdownMenu.Trigger>
      <DropdownMenu.Content className='menu-panel'>
        <DropdownMenu.Label className='menu-label'>작업</DropdownMenu.Label>
        <DropdownMenu.Item className='menu-item'>편집</DropdownMenu.Item>
        <DropdownMenu.Separator className='menu-separator' />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

describe('DropdownMenu', () => {
  it('Content가 Portal을 내장하고 메뉴 파트 className을 병합한다', () => {
    renderMenu();

    expect(screen.getByRole('menu')).toHaveClass('menu-panel');
    expect(screen.getByText('작업')).toHaveClass('menu-label');
    expect(screen.getByRole('menuitem', { name: '편집' })).toHaveClass(
      'menu-item'
    );
    expect(screen.getByRole('separator')).toHaveClass('menu-separator');
  });
});
