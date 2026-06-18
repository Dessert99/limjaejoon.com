import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Popover } from './Popover';

function renderPopover() {
  return render(
    <Popover.Root open>
      <Popover.Trigger>메뉴 열기</Popover.Trigger>
      <Popover.Content className='popover-panel'>패널 내용</Popover.Content>
    </Popover.Root>
  );
}

describe('Popover', () => {
  it('Content가 Portal을 내장하고 외부 className을 병합한다', () => {
    renderPopover();

    expect(screen.getByText('패널 내용')).toHaveClass('popover-panel');
  });
});
