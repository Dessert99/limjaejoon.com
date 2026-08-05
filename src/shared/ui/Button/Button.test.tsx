/** Button 테스트 — 엘리먼트 선택(button/a)과 props 전달 계약만 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('기본은 type 이 button 인 button 엘리먼트다', () => {
    render(<Button>보내기</Button>);

    const button = screen.getByRole('button', { name: '보내기' });

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('소비자가 준 type 이 기본값을 이긴다', () => {
    render(<Button type='submit'>보내기</Button>);

    expect(screen.getByRole('button', { name: '보내기' })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('type 을 undefined 로 넘겨도 button 을 유지한다', () => {
    // 감싸는 컴포넌트가 옵셔널 type 을 그대로 흘리는 흔한 경우 — 속성이 지워지면 form 안에서 submit 로 되살아난다
    render(<Button type={undefined}>보내기</Button>);

    expect(screen.getByRole('button', { name: '보내기' })).toHaveAttribute(
      'type',
      'button'
    );
  });

  it('href 를 주면 링크로 렌더한다', () => {
    render(<Button href='/blog'>블로그</Button>);

    const link = screen.getByRole('link', { name: '블로그' });

    expect(link).toHaveAttribute('href', '/blog');
    expect(link).not.toHaveAttribute('type');
  });

  it('소비자 className 이 variant 색을 덮는다', () => {
    render(<Button className='bg-surface'>보내기</Button>);

    const button = screen.getByRole('button', { name: '보내기' });

    expect(button).toHaveClass('bg-surface');
    expect(button).not.toHaveClass('bg-accent');
  });
});
