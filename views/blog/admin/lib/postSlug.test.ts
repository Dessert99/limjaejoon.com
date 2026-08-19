import { describe, expect, it } from 'vitest';
import { composeSlug, parseSlug, toPublishedAt } from './postSlug';

describe('composeSlug', () => {
  it('날짜와 주제를 이어 붙인다', () => {
    expect(composeSlug('2026-08-29', 'react')).toBe('2026-08-29-react');
  });

  it('주제의 공백과 대문자를 URL 에 쓰는 꼴로 눕힌다', () => {
    expect(composeSlug('2026-08-29', 'React Hook Form')).toBe(
      '2026-08-29-react-hook-form'
    );
  });

  it('주제가 비면 날짜만 남긴다', () => {
    expect(composeSlug('2026-08-29', '')).toBe('2026-08-29');
  });

  it('날짜가 비면 주제만 남긴다', () => {
    expect(composeSlug('', 'react')).toBe('react');
  });
});

describe('parseSlug', () => {
  it('앞머리 날짜와 나머지 주제로 가른다', () => {
    expect(parseSlug('2026-05-21-zod')).toEqual({
      date: '2026-05-21',
      topic: 'zod',
    });
  });

  it('주제에 하이픈이 여러 개여도 날짜만 떼어낸다', () => {
    expect(parseSlug('2026-04-08-next-middleware')).toEqual({
      date: '2026-04-08',
      topic: 'next-middleware',
    });
  });

  it('날짜로 시작하지 않으면 전부 주제로 본다', () => {
    expect(parseSlug('hello-world')).toEqual({
      date: '',
      topic: 'hello-world',
    });
  });

  it('빈 slug 는 빈 값 두 개로 편다', () => {
    expect(parseSlug('')).toEqual({ date: '', topic: '' });
  });
});

describe('toPublishedAt', () => {
  it('고른 날짜를 그 날 자정(UTC)의 ISO 로 바꾼다', () => {
    expect(toPublishedAt('2026-08-29')).toBe('2026-08-29T00:00:00.000Z');
  });

  it('날짜가 비면 빈 문자열을 돌려준다', () => {
    expect(toPublishedAt('')).toBe('');
  });
});
