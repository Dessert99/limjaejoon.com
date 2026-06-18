import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HoverCard } from './HoverCard';

// 지연 0으로 둔 링크 트리거 + 카드 — 기본 지연(700/300ms)을 피해 hover/focus 동작만 검증
function renderHoverCard() {
  return render(
    <HoverCard.Root
      openDelay={0}
      closeDelay={0}>
      <HoverCard.Trigger href='/users/jane'>@jane</HoverCard.Trigger>
      <HoverCard.Content>제인의 프로필</HoverCard.Content>
    </HoverCard.Root>
  );
}

describe('HoverCard', () => {
  it('트리거에 포인터를 올리면 카드가 열린다', async () => {
    renderHoverCard();
    expect(screen.queryByText('제인의 프로필')).not.toBeInTheDocument();

    await userEvent.hover(screen.getByRole('link', { name: '@jane' }));

    expect(await screen.findByText('제인의 프로필')).toBeInTheDocument();
  });

  it('포인터가 트리거를 벗어나면 카드가 닫힌다', async () => {
    renderHoverCard();
    const trigger = screen.getByRole('link', { name: '@jane' });

    await userEvent.hover(trigger);
    expect(await screen.findByText('제인의 프로필')).toBeInTheDocument();

    await userEvent.unhover(trigger);
    await waitFor(() => {
      expect(screen.queryByText('제인의 프로필')).not.toBeInTheDocument();
    });
  });

  it('트리거에 포커스가 가도 카드가 열린다', async () => {
    renderHoverCard();

    screen.getByRole('link', { name: '@jane' }).focus();

    expect(await screen.findByText('제인의 프로필')).toBeInTheDocument();
  });
});
