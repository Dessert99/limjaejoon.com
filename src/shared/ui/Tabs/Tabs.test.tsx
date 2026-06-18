import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';

// 두 탭짜리 묶음 — 동작 검증용 공통 마크업
function renderTabs(onValueChange?: (value: string) => void) {
  return render(
    <Tabs.Root
      defaultValue='a'
      onValueChange={onValueChange}>
      <Tabs.List aria-label='섹션'>
        <Tabs.Trigger value='a'>탭 A</Tabs.Trigger>
        <Tabs.Trigger value='b'>탭 B</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value='a'>내용 A</Tabs.Content>
      <Tabs.Content value='b'>내용 B</Tabs.Content>
    </Tabs.Root>
  );
}

describe('Tabs', () => {
  it('기본값 탭의 패널만 보여준다', () => {
    renderTabs();

    expect(screen.getByRole('tab', { name: '탭 A' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('내용 A');
    expect(screen.queryByText('내용 B')).not.toBeInTheDocument();
  });

  it('탭을 클릭하면 해당 패널로 전환된다', async () => {
    renderTabs();

    await userEvent.click(screen.getByRole('tab', { name: '탭 B' }));

    expect(screen.getByRole('tab', { name: '탭 B' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('내용 B');
    expect(screen.queryByText('내용 A')).not.toBeInTheDocument();
  });

  it('화살표 키로 탭을 이동하면 자동 활성화된다', async () => {
    renderTabs();

    await userEvent.click(screen.getByRole('tab', { name: '탭 A' }));
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: '탭 B' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('내용 B');
  });

  it('선택된 탭 값을 onValueChange로 알린다', async () => {
    const onValueChange = vi.fn();
    renderTabs(onValueChange);

    await userEvent.click(screen.getByRole('tab', { name: '탭 B' }));

    expect(onValueChange).toHaveBeenCalledWith('b');
  });
});
