import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('포트폴리오 섹션들을 렌더한다', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '안녕하세요'
    );
    expect(
      screen.getByRole('heading', { name: '보유 기술' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '경력' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '프로젝트' })
    ).toBeInTheDocument();
  });
});
