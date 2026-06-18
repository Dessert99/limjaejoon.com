import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('children를 스크롤 뷰포트 안에 렌더한다', () => {
    render(<ScrollArea>긴 내용이 여기에 들어간다</ScrollArea>);

    expect(screen.getByText('긴 내용이 여기에 들어간다')).toBeInTheDocument();
  });

  it('Root에 외부 className을 병합한다', () => {
    const { container } = render(
      <ScrollArea className='custom-scope'>내용</ScrollArea>
    );

    expect(container.querySelector('.custom-scope')).toBeInTheDocument();
  });
});
