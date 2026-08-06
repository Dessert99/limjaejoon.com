/** extractHeadings 테스트 — 목차 항목과 rehype-slug 호환 슬러그 계약을 검증한다 */
import GithubSlugger from 'github-slugger';
import { describe, expect, it } from 'vitest';
import { extractHeadings } from './extractHeadings';

describe('extractHeadings', () => {
  it('h2·h3 를 문서 순서대로 뽑는다', () => {
    const headings = extractHeadings('## 배경\n\n본문\n\n### 세부\n');

    expect(headings).toEqual([
      { depth: 2, text: '배경', id: '배경' },
      { depth: 3, text: '세부', id: '세부' },
    ]);
  });

  it('h1 과 h4 는 목차에 넣지 않는다', () => {
    const headings = extractHeadings(
      '# 글 제목\n\n## 절\n\n#### 너무 깊은 절\n'
    );

    expect(
      headings.map((heading) => {
        return heading.text;
      })
    ).toEqual(['절']);
  });

  it('코드 펜스 안의 # 는 제목으로 세지 않는다', () => {
    const markdown = [
      '## 설치',
      '',
      '```sh',
      '## 주석이지 제목이 아니다',
      '```',
      '',
      '## 사용',
    ].join('\n');

    expect(
      extractHeadings(markdown).map((heading) => {
        return heading.text;
      })
    ).toEqual(['설치', '사용']);
  });

  it('같은 제목이 두 번 나오면 슬러그가 갈린다', () => {
    const headings = extractHeadings('## 정리\n\n## 정리\n');

    expect(
      headings.map((heading) => {
        return heading.id;
      })
    ).toEqual(['정리', '정리-1']);
  });

  it('슬러그는 rehype-slug 와 같은 구현으로 만든다', () => {
    // 앵커가 맞으려면 목차와 본문이 같은 규칙으로 id 를 지어야 한다
    const text = 'Next.js 16 & Tailwind v4';
    const slugger = new GithubSlugger();

    expect(extractHeadings(`## ${text}\n`)[0].id).toBe(slugger.slug(text));
  });

  it('제목이 없으면 빈 배열이다', () => {
    expect(extractHeadings('본문만 있는 글이다.\n')).toEqual([]);
  });
});
