/** 커튼 라벨 테스트 — 어떤 경로가 와도 표시할 이름이 나온다는 계약을 검증한다 */
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
});
