import { describe, expect, it } from 'vitest';
import { shouldCurtain } from './curtainPolicy';

describe('shouldCurtain', () => {
  it('섹션을 건너뛰는 이동에는 커튼을 친다', () => {
    expect(shouldCurtain('/', '/blog')).toBe(true);
    expect(shouldCurtain('/blog/hello-world', '/')).toBe(true);
  });

  it('같은 섹션 안 이동에는 커튼을 치지 않는다', () => {
    expect(shouldCurtain('/blog', '/blog/hello-world')).toBe(false);
    expect(shouldCurtain('/blog/hello-world', '/blog/next-post')).toBe(false);
  });

  it('쿼리만 다른 이동도 같은 섹션으로 본다', () => {
    expect(shouldCurtain('/blog/hello-world', '/blog?tag=react')).toBe(false);
  });
});
