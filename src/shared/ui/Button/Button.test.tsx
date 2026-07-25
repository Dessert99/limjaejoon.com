import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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

  it('기본 button type을 button으로 설정하고 명시 type은 유지한다', () => {
    render(
      <>
        <Button>저장</Button>
        <Button type='submit'>제출</Button>
      </>
    );

    expect(screen.getByRole('button', { name: '저장' })).toHaveAttribute(
      'type',
      'button'
    );
    expect(screen.getByRole('button', { name: '제출' })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('loading 상태에서는 접근성 이름을 유지하고 busy 상태만 노출한다', () => {
    render(<Button loading>저장하기</Button>);

    const button = screen.getByRole('button', { name: '저장하기' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading');
    expect(button).not.toBeDisabled();
  });

  it('loading과 disabled는 분리한다', () => {
    render(
      <Button
        loading
        disabled>
        저장하기
      </Button>
    );

    const button = screen.getByRole('button', { name: '저장하기' });
    expect(button).toHaveAttribute('data-loading');
    expect(button).toHaveAttribute('data-disabled');
    expect(button).toBeDisabled();
  });

  it('secondary variant에서 block prop이 className을 변경한다', () => {
    const { rerender } = render(
      <Button variant='secondary'>저장</Button>
    );
    const plain = screen.getByRole('button', { name: '저장' }).className;

    rerender(
      <Button
        variant='secondary'
        block>
        저장
      </Button>
    );
    const blocked = screen.getByRole('button', { name: '저장' }).className;

    expect(blocked).not.toBe(plain);
  });

  it('compound icon slot을 렌더링하고 iconOnly 접근성 이름 누락을 개발 경고로 알려준다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <Button layout='iconOnly'>
        <Button.Icon>
          <span aria-hidden>+</span>
        </Button.Icon>
      </Button>
    );

    expect(screen.getByText('+')).toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('iconOnly'));

    warn.mockRestore();
  });
});
