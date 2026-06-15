import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('children을 가진 native button을 렌더한다', () => {
    render(<Button>저장</Button>);

    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
  });

  it('asChild가 설정되면 button 대신 자식 엘리먼트로 렌더한다', () => {
    render(
      <Button asChild>
        <a href='/about'>소개</a>
      </Button>
    );

    expect(screen.getByRole('link', { name: '소개' })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('내부 button 노드로 ref를 전달한다', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>확인</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('native button 속성을 그대로 전달한다', async () => {
    const onClick = vi.fn();
    render(
      <Button
        disabled
        onClick={onClick}>
        비활성
      </Button>
    );

    const btn = screen.getByRole('button', { name: '비활성' });
    expect(btn).toBeDisabled();

    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
