import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OneTimePasswordField } from './OneTimePasswordField';

describe('OneTimePasswordField', () => {
  it('length만큼 입력 칸을 조립하고 Root className을 병합한다', () => {
    const { container } = render(
      <OneTimePasswordField
        length={4}
        className='otp-root'
      />
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
    expect(container.querySelector('.otp-root')).toBeInTheDocument();
  });
});
