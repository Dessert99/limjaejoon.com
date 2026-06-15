import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GsapSmoke } from './GsapSmoke';

describe('GsapSmoke', () => {
  it('GSAP smoke 컴포넌트를 마운트한다', () => {
    render(<GsapSmoke />);

    expect(screen.getByTestId('gsap-smoke')).toBeInTheDocument();
  });
});
