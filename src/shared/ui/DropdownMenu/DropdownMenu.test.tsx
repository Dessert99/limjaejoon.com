import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

// 라벨 + 항목 2개 + 구분선짜리 액션 메뉴 — 동작 검증용 공통 마크업
function renderMenu(onSelect?: (event: Event) => void) {
  return render(
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>메뉴</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>작업</DropdownMenu.Label>
        <DropdownMenu.Item onSelect={onSelect}>편집</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>삭제</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

describe('DropdownMenu', () => {
  it('트리거를 클릭하면 메뉴와 항목이 열린다', async () => {
    renderMenu();

    const trigger = screen.getByRole('button', { name: '메뉴' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '편집' })).toBeInTheDocument();
  });

  it('항목을 선택하면 onSelect가 호출되고 메뉴가 닫힌다', async () => {
    const onSelect = vi.fn();
    renderMenu(onSelect);

    await userEvent.click(screen.getByRole('button', { name: '메뉴' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '편집' }));

    expect(onSelect).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('라벨과 구분선이 메뉴 구조에 포함된다', async () => {
    renderMenu();

    await userEvent.click(screen.getByRole('button', { name: '메뉴' }));

    expect(screen.getByText('작업')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
