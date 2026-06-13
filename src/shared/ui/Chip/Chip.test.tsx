import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chip } from './Chip';

describe('Chip', () => {
  it('children 을 버튼 안에 렌더한다', () => {
    render(<Chip variant='assist'>태그</Chip>);
    expect(screen.getByRole('button', { name: '태그' })).toBeInTheDocument();
  });

  it('filter 변형은 selected 를 aria-pressed=true 로 노출한다', () => {
    render(
      <Chip
        variant='filter'
        selected>
        선택됨
      </Chip>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('filter 가 아니면 aria-pressed 를 달지 않는다', () => {
    render(<Chip variant='assist'>일반</Chip>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
  });
});
