import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('value와 max 비율로 Indicator transform을 계산한다', () => {
    render(
      <Progress
        value={5}
        max={10}
        aria-label='단계'
      />
    );

    const indicator = screen
      .getByRole('progressbar', { name: '단계' })
      .querySelector('[style]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' });
  });

  it('value가 없으면 막대를 0% 위치로 숨긴다', () => {
    render(<Progress aria-label='대기' />);

    const indicator = screen
      .getByRole('progressbar', { name: '대기' })
      .querySelector('[style]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });
});
