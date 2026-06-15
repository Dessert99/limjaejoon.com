import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('shell 플레이스홀더를 렌더한다', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: 'Shell ready' })
    ).toBeInTheDocument();
  });
});
