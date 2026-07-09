import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostFilterForm } from './PostFilterForm';

describe('PostFilterForm', () => {
  it('현재 필터 값을 GET form 컨트롤에 채운다', () => {
    render(
      <PostFilterForm
        categoryOptions={[{ label: 'Frontend', value: 'frontend' }]}
        filters={{
          q: 'cache',
          category: 'frontend',
          series: 'Next.js App Router',
          tag: 'Next.js',
        }}
        seriesOptions={[
          { label: 'Next.js App Router', value: 'Next.js App Router' },
        ]}
      />
    );

    expect(screen.getByRole('form')).toHaveAttribute('method', 'get');
    expect(screen.getByLabelText('검색어')).toHaveValue('cache');
    expect(screen.getByLabelText('카테고리')).toHaveValue('frontend');
    expect(screen.getByLabelText('시리즈')).toHaveValue('Next.js App Router');
    expect(screen.getByLabelText('태그')).toHaveValue('Next.js');
    expect(screen.getByRole('button', { name: '검색' })).toBeInTheDocument();
  });
});
