import { describe, expect, it } from 'vitest';
import { routeLabel } from './routeLabel';

describe('routeLabel', () => {
  it('루트 경로는 home 으로 읽는다', () => {
    expect(routeLabel('/')).toBe('home');
  });

  it('첫 세그먼트를 라우트 이름으로 쓴다', () => {
    expect(routeLabel('/blog')).toBe('blog');
  });

  it('하위 경로는 첫 세그먼트로 묶는다', () => {
    expect(routeLabel('/blog/hello-world')).toBe('blog');
  });

  it('쿼리와 해시는 이름에서 걷어낸다', () => {
    expect(routeLabel('/blog?tag=react')).toBe('blog');
    expect(routeLabel('/blog/hello-world#intro')).toBe('blog');
  });
});
