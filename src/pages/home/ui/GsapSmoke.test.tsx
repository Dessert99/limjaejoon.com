import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GsapSmoke } from './GsapSmoke';

describe('GsapSmoke', () => {
  it('mounts the GSAP smoke component', () => {
    render(<GsapSmoke />);

    expect(screen.getByTestId('gsap-smoke')).toBeInTheDocument();
  });
});
