import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator';

describe('Separator', () => {
  it('기본은 의미 있는 separator 역할로 렌더한다', () => {
    render(<Separator />);

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('decorative면 스크린리더에서 역할을 숨긴다', () => {
    render(<Separator decorative />);

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('orientation을 data-orientation으로 반영한다', () => {
    render(
      <Separator
        orientation='vertical'
        data-testid='sep'
      />
    );

    expect(screen.getByTestId('sep')).toHaveAttribute(
      'data-orientation',
      'vertical'
    );
  });
});
