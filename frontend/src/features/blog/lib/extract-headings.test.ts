import { describe, it, expect } from 'vitest';
import { extractHeadings } from './extract-headings';

describe('extractHeadings', () => {
  it('h1~h3 만 추출하고 h4 이상은 무시한다', () => {
    const content = ['# 제목1', '## 제목2', '### 제목3', '#### 제목4'].join(
      '\n'
    );
    const result = extractHeadings(content);
    expect(
      result.map((h) => {
        return h.text;
      })
    ).toEqual(['제목1', '제목2', '제목3']);
  });

  it('코드펜스 안의 # 은 헤딩으로 잡지 않는다', () => {
    const content = ['# 진짜 헤딩', '```bash', '# 이건 주석', '```'].join('\n');
    const result = extractHeadings(content);
    expect(
      result.map((h) => {
        return h.text;
      })
    ).toEqual(['진짜 헤딩']);
  });

  it('인라인 마크다운(굵게·코드 등)을 제거하고 순수 텍스트만 남긴다', () => {
    const result = extractHeadings('## **굵게** 와 `코드`');
    expect(result[0].text).toBe('굵게 와 코드');
  });

  it('rehype-slug 와 동일하게 슬러그를 생성한다', () => {
    const result = extractHeadings('# Hello World');
    expect(result[0].slug).toBe('hello-world');
  });

  it('같은 텍스트의 헤딩은 슬러그를 중복 없이 구분한다', () => {
    const result = extractHeadings(['## 설치', '## 설치'].join('\n'));
    expect(
      result.map((h) => {
        return h.slug;
      })
    ).toEqual(['설치', '설치-1']);
  });

  it('헤딩이 없으면 빈 배열을 반환한다', () => {
    expect(extractHeadings('헤딩 없는 본문입니다.')).toEqual([]);
  });
});
