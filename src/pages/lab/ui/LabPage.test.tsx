import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LabPage } from './LabPage';

describe('LabPage', () => {
  it('transition 실험으로 가는 링크를 노출한다', () => {
    render(<LabPage />);

    expect(screen.getByRole('link', { name: 'transition' })).toHaveAttribute(
      'href',
      '/lab/transition'
    );
  });

  it('animation 실험으로 가는 링크를 노출한다', () => {
    render(<LabPage />);

    expect(screen.getByRole('link', { name: 'animation' })).toHaveAttribute(
      'href',
      '/lab/animation'
    );
  });
});
