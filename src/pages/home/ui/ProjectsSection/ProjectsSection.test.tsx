import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectsSection } from './ProjectsSection';

describe('ProjectsSection', () => {
  it('프로젝트 카드를 렌더한다', () => {
    render(<ProjectsSection />);
    expect(
      screen.getByRole('heading', { name: '프로젝트' })
    ).toBeInTheDocument();
  });
});
