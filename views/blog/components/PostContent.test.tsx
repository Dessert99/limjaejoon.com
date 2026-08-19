import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { extractHeadings } from '../lib/extractHeadings';
import { PostContent } from './PostContent';

describe('PostContent', () => {
  it('Markdown 제목을 시맨틱 태그로 그린다', () => {
    render(<PostContent markdown={'## 배경\n\n본문 한 줄.'} />);

    expect(
      screen.getByRole('heading', { level: 2, name: '배경' })
    ).toBeInTheDocument();
    expect(screen.getByText('본문 한 줄.')).toBeInTheDocument();
  });

  it('제목 id 가 목차 슬러그와 맞는다', () => {
    const markdown = '## Next.js 16 & Tailwind v4\n';
    const { container } = render(<PostContent markdown={markdown} />);

    expect(container.querySelector('h2')).toHaveAttribute(
      'id',
      extractHeadings(markdown)[0].id
    );
  });

  it('GFM 표를 table 로 그린다', () => {
    const markdown = '| 열 |\n| --- |\n| 값 |\n';

    render(<PostContent markdown={markdown} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  const SNIPPETS = {
    tsx: 'const answer = 42;',
    jsx: 'const element = <div />;',
    bash: 'echo "hello"',
    yaml: 'key: value',
    docker: 'FROM node:22',
    html: '<p>hi</p>',
    css: 'a { color: red; }',
  };

  it.each(Object.entries(SNIPPETS))(
    '%s 코드 블록에 색을 입힌다',
    (lang, code) => {
      const { container } = render(
        <PostContent markdown={`\`\`\`${lang}\n${code}\n\`\`\``} />
      );

      const pre = container.querySelector('pre');

      expect(pre).toHaveClass('shiki');
      expect(pre?.querySelectorAll('span').length).toBeGreaterThan(1);
    }
  );

  it('언어를 안 적은 코드 블록도 같은 조판을 탄다', () => {
    const { container } = render(
      <PostContent markdown={'```\n그냥 글자\n```'} />
    );

    expect(container.querySelector('pre')).toHaveClass('shiki');
  });

  it('안 실은 언어를 만나도 터지지 않고 같은 조판으로 떨어진다', () => {
    const { container } = render(
      <PostContent markdown={'```brainfuck\n+++++\n```'} />
    );

    expect(container.querySelector('pre')).toHaveClass('shiki');
  });

  it('pre 에 인라인 style 을 남기지 않는다', () => {
    const { container } = render(
      <PostContent markdown={'```tsx\nconst answer = 42;\n```'} />
    );

    expect(container.querySelector('pre')).not.toHaveAttribute('style');
  });
});
