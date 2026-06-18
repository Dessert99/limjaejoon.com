import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('asChild가 설정되면 자식 엘리먼트에 버튼 스타일과 props를 합성한다', () => {
    render(
      <Button
        asChild
        className='external'
        data-testid='button-as-link'>
        <a href='/about'>소개</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: '소개' });
    expect(link).toHaveAttribute('href', '/about');
    expect(link).toHaveClass('external');
    expect(screen.getByTestId('button-as-link')).toBe(link);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('기본 렌더에서는 ref를 실제 button 노드로 전달한다', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>확인</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
