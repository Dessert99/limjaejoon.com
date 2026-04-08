import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const blogDir = path.join(process.cwd(), 'content/blog');
const slugs = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => f.replace(/\.mdx$/, ''));

test.describe('블로그 상세 페이지', () => {
  for (const slug of slugs) {
    test(`포스트 렌더링: ${slug}`, async ({ page }) => {
      const response = await page.goto(`/blog/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading').first()).toBeVisible();
    });
  }

  test('존재하지 않는 slug 접근 시 404 페이지', async ({ page }) => {
    const response = await page.goto('/blog/this-post-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

test.describe('스토리 상세 페이지', () => {
  test('스토리 포스트 렌더링', async ({ page }) => {
    await page.goto('/stories/hero-animation');

    await expect(
      page.getByRole('heading', { name: 'Hero 등장 애니메이션 구현 방법' })
    ).toBeVisible();
  });

  test('존재하지 않는 스토리 slug 접근 시 404 페이지', async ({ page }) => {
    const response = await page.goto('/stories/this-story-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});
