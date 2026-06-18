import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HoverCard } from './HoverCard';

function renderCard() {
  return render(
    <HoverCard.Root open>
      <HoverCard.Trigger href='https://example.com'>@jane</HoverCard.Trigger>
      <HoverCard.Content className='hover-panel'>제인의 프로필</HoverCard.Content>
    </HoverCard.Root>
  );
}

describe('HoverCard', () => {
  it('Content가 Portal을 내장하고 외부 className을 병합한다', () => {
    renderCard();

    expect(screen.getByText('제인의 프로필')).toHaveClass('hover-panel');
  });
});
