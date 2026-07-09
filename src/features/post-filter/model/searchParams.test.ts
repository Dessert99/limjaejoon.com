import { describe, expect, it } from 'vitest';
import { parsePostSearchParams } from './searchParams';

describe('parsePostSearchParams', () => {
  it('첫 번째 query 값을 trim 해서 검색 조건으로 변환한다', () => {
    expect(parsePostSearchParams({ q: ' cache ', tag: ['Next.js'] })).toEqual({
      q: 'cache',
      tag: 'Next.js',
    });
  });

  it('빈 query 값은 검색 조건에서 제외한다', () => {
    expect(
      parsePostSearchParams({
        q: '   ',
        series: undefined,
      })
    ).toEqual({});
  });

  it('category query 는 검색 조건으로 변환하지 않는다', () => {
    expect(parsePostSearchParams({ category: 'frontend' })).toEqual({});
  });
});
