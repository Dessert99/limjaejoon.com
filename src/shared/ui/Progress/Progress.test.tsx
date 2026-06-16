import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('progressbar 역할과 현재값을 노출한다', () => {
    render(
      <Progress
        value={40}
        aria-label='업로드'
      />
    );

    const bar = screen.getByRole('progressbar', { name: '업로드' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('value 미지정이면 indeterminate 상태로 둔다', () => {
    render(<Progress aria-label='대기' />);

    expect(screen.getByRole('progressbar', { name: '대기' })).toHaveAttribute(
      'data-state',
      'indeterminate'
    );
  });

  it('max 기준으로 현재값을 반영한다', () => {
    render(
      <Progress
        value={5}
        max={10}
        aria-label='단계'
      />
    );

    expect(screen.getByRole('progressbar', { name: '단계' })).toHaveAttribute(
      'aria-valuenow',
      '5'
    );
  });
});
