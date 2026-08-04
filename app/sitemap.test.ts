/** sitemap 테스트 — 존재하는 route 만 노출하는지 검증한다 */
import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('루트 URL 하나만 노출한다', () => {
    expect(sitemap()).toEqual([
      expect.objectContaining({ url: 'https://limjaejoon.com' }),
    ]);
  });
});
