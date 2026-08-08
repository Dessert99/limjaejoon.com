/** PostContent 테스트 — Markdown 이 시맨틱 태그와 앵커 가능한 제목으로 나오는지 검증한다 */
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
    // 둘이 어긋나면 목차 링크만 조용히 죽는다
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

  // 글이 실제로 쓰는 언어만 싣는다 — 하나라도 빠지면 그 언어의 코드 블록이 조용히 맨 텍스트로 떨어진다
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
      // 동기 하이라이터가 아니면 이 렌더에서 터진다
      const { container } = render(
        <PostContent markdown={`\`\`\`${lang}\n${code}\n\`\`\``} />
      );

      const pre = container.querySelector('pre');

      expect(pre).toHaveClass('shiki');
      expect(pre?.querySelectorAll('span').length).toBeGreaterThan(1);
    }
  );

  it('언어를 안 적은 코드 블록도 같은 조판을 탄다', () => {
    // 태그 없는 블록이 shiki 를 안 타면 배경·여백이 다른 블록만 혼자 튄다
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
    // 배경은 prose.css 가 소유한다 — shiki 가 인라인으로 박으면 토큰 계층을 우회한다
    const { container } = render(
      <PostContent markdown={'```tsx\nconst answer = 42;\n```'} />
    );

    expect(container.querySelector('pre')).not.toHaveAttribute('style');
  });
});
