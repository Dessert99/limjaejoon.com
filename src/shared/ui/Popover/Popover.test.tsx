import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from './Popover';

// 트리거 + 패널 한 쌍 — 동작 검증용 공통 마크업
function renderPopover(onOpenChange?: (open: boolean) => void) {
  return render(
    <Popover.Root onOpenChange={onOpenChange}>
      <Popover.Trigger>메뉴 열기</Popover.Trigger>
      <Popover.Content>패널 내용</Popover.Content>
    </Popover.Root>
  );
}

describe('Popover', () => {
  it('트리거를 클릭하면 패널이 열린다', async () => {
    renderPopover();

    const trigger = screen.getByRole('button', { name: '메뉴 열기' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('패널 내용')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('패널 내용')).toBeInTheDocument();
  });

  it('Esc 키를 누르면 패널이 닫힌다', async () => {
    renderPopover();

    await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));
    expect(screen.getByText('패널 내용')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('패널 내용')).not.toBeInTheDocument();
  });

  it('열림 상태가 바뀌면 onOpenChange로 알린다', async () => {
    const onOpenChange = vi.fn();
    renderPopover(onOpenChange);

    await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
