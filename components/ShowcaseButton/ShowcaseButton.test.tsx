import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShowcaseButton } from './ShowcaseButton';

describe('ShowcaseButton', () => {
  it('기본은 type 이 button 인 button 엘리먼트다', () => {
    render(<ShowcaseButton>연락하기</ShowcaseButton>);

    const button = screen.getByRole('button', { name: '연락하기' });

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('type 을 undefined 로 넘겨도 button 을 유지한다', () => {
    render(<ShowcaseButton type={undefined}>연락하기</ShowcaseButton>);

    expect(screen.getByRole('button', { name: '연락하기' })).toHaveAttribute(
      'type',
      'button'
    );
  });

  it('href 를 주면 링크로 렌더한다', () => {
    render(
      <ShowcaseButton href='mailto:me@example.com'>연락하기</ShowcaseButton>
    );

    expect(screen.getByRole('link', { name: '연락하기' })).toHaveAttribute(
      'href',
      'mailto:me@example.com'
    );
  });

  it('fill 레이어는 장식이라 스크린리더에서 감춘다', () => {
    const { container } = render(<ShowcaseButton>연락하기</ShowcaseButton>);

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it('소비자 className 을 루트에 덧입힌다', () => {
    render(<ShowcaseButton className='w-full'>연락하기</ShowcaseButton>);

    expect(screen.getByRole('button', { name: '연락하기' })).toHaveClass(
      'w-full'
    );
  });
});
