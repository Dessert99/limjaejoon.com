import { test, expect } from '@playwright/test';

test.describe('블로그 목록 페이지', () => {
  test('포스트 카드 클릭 시 상세 페이지로 이동', async ({ page }) => {
    await page.goto('/blog');

    const firstCard = page.getByRole('main').getByRole('link').first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/blog\/.+/);
  });
});
