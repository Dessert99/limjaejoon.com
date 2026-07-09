import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostMarkdown } from './PostMarkdown';

describe('PostMarkdown', () => {
  it('Markdown heading, link, and code block을 렌더한다', () => {
    render(
      <PostMarkdown
        source={
          '## 제목\n\n[링크](https://limjaejoon.com)\n\n```ts\nconst value = 1;\n```'
        }
      />
    );

    expect(screen.getByRole('heading', { name: '제목' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '링크' })).toHaveAttribute(
      'href',
      'https://limjaejoon.com'
    );
    expect(screen.getByText('const value = 1;')).toBeInTheDocument();
  });
});
