import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkillsSection } from './SkillsSection';

describe('SkillsSection', () => {
  it('보유 기술 목록을 렌더한다', () => {
    render(<SkillsSection />);
    expect(
      screen.getByRole('heading', { name: '보유 기술' })
    ).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });
});
