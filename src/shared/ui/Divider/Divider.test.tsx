import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('기본값은 의미 있는 hr 구분선으로 렌더링한다', () => {
    render(<Divider />);

    expect(screen.getByRole('separator')).toHaveProperty('tagName', 'HR');
  });

  it('as와 orientation으로 렌더 요소와 방향을 조정한다', () => {
    render(
      <Divider
        as='div'
        role='separator'
        orientation='vertical'
      />
    );

    const divider = screen.getByRole('separator');
    expect(divider).toHaveProperty('tagName', 'DIV');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });
});
