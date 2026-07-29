/** sitemap 테스트 — 존재하는 route 만 노출하는지 검증한다 */
import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('루트 URL 하나만 노출한다', () => {
    expect(sitemap()).toEqual([
      expect.objectContaining({ url: 'https://limjaejoon.com' }),
    ]);
  });

  it('철거한 blog route 를 노출하지 않는다', () => {
    const urls = sitemap().map((entry) => {
      return entry.url;
    });
    const hasBlogUrl = urls.some((url) => {
      return url.includes('/blog');
    });

    expect(hasBlogUrl).toBe(false);
  });
});
