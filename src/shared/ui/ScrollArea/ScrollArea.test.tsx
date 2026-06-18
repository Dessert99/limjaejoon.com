import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('Root className을 병합하고 children을 내장 Viewport 안에 렌더한다', () => {
    const { container } = render(
      <ScrollArea className='custom-scope'>긴 내용</ScrollArea>
    );

    const root = container.querySelector('.custom-scope');
    expect(root).toBeInTheDocument();
    expect(root).toContainElement(screen.getByText('긴 내용'));
  });
});
