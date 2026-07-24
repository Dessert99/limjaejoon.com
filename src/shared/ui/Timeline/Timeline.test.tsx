import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline } from './Timeline';

describe('Timeline', () => {
  const items = [
    {
      title: '회사 A',
      subtitle: '프론트엔드',
      period: '2024 - 현재',
      description: '설명',
      stack: ['React', 'TypeScript'],
    },
  ];

  it('제목과 항목의 필드를 렌더한다', () => {
    render(
      <Timeline
        title='경력'
        items={items}
      />
    );

    expect(screen.getByRole('heading', { name: '경력' })).toBeInTheDocument();
    expect(screen.getByText('회사 A')).toBeInTheDocument();
    expect(screen.getByText('프론트엔드')).toBeInTheDocument();
    expect(screen.getByText('2024 - 현재')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('옵션 필드가 없으면 해당 요소를 렌더하지 않는다', () => {
    render(
      <Timeline
        title='학력'
        items={[{ title: '학교', period: '2020 - 2024' }]}
      />
    );

    expect(screen.getByText('학교')).toBeInTheDocument();
    expect(screen.queryByText('프론트엔드')).not.toBeInTheDocument();
  });
});
