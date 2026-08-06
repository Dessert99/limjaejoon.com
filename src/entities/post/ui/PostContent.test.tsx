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

  it('코드 블록에 하이라이팅을 입힌다', () => {
    // 동기 하이라이터가 아니면 이 렌더에서 터진다
    const { container } = render(
      <PostContent markdown={'```ts\nconst answer = 42;\n```'} />
    );

    const pre = container.querySelector('pre');

    expect(pre).toHaveClass('shiki');
    expect(pre?.querySelectorAll('span').length).toBeGreaterThan(1);
  });
});
