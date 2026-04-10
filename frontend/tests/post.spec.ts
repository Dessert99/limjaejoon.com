import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// content/blog 디렉토리의 모든 .mdx 파일을 읽어 슬러그 목록 생성
// → 새 포스트가 추가되면 자동으로 테스트 대상에 포함됨
const blogDir = path.join(process.cwd(), 'content/blog');
const slugs = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => f.replace(/\.mdx$/, ''));

test.describe('블로그 상세 페이지', () => {
  // 모든 블로그 포스트에 대해 렌더링 테스트를 동적으로 생성
  for (const slug of slugs) {
    test(`포스트 렌더링: ${slug}`, async ({ page }) => {
      const response = await page.goto(`/blog/${slug}`);
      // 200 응답 + heading 노출 → 포스트가 정상 렌더링되었는지 확인
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading').first()).toBeVisible(); // mdx본문에는 ## 가 있지만, 페이지 컴포넌트에서는 title을 <h1>로 렌더링 중이다. 이것들 확인하는 것.
    });
  }

  // 잘못된 URL 접근 시 404 처리 검증 (예외 상황)
  test('존재하지 않는 slug 접근 시 404 페이지', async ({ page }) => {
    const response = await page.goto('/blog/this-post-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

// content/stories 디렉토리의 모든 .mdx 파일을 읽어 슬러그 목록 생성
const storiesDir = path.join(process.cwd(), 'content/stories');
const storySlugs = fs
  .readdirSync(storiesDir)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => f.replace(/\.mdx$/, ''));

test.describe('스토리 상세 페이지', () => {
  // 모든 스토리 포스트에 대해 렌더링 테스트를 동적으로 생성
  for (const slug of storySlugs) {
    test(`스토리 포스트 렌더링: ${slug}`, async ({ page }) => {
      const response = await page.goto(`/stories/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading').first()).toBeVisible();
    });
  }

  test('존재하지 않는 스토리 slug 접근 시 404 페이지', async ({ page }) => {
    const response = await page.goto('/stories/this-story-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});
