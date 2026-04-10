import { test, expect } from '@playwright/test';

test.describe('검색 페이지', () => {
  test('검색어 입력 시 결과 표시', async ({ page }) => {
    await page.goto('/search');

    await page.getByRole('searchbox', { name: '블로그 검색' }).fill('Next');

    await expect(
      page.getByRole('main').getByRole('link').first()
    ).toBeVisible();
  });

  test('존재하지 않는 검색어 입력 시 "검색 결과가 없습니다." 메시지 표시', async ({
    page,
  }) => {
    await page.goto('/search');

    await page
      .getByRole('searchbox', { name: '블로그 검색' })
      .fill('존재하지않는검색어xyz123');

    await expect(page.getByText('검색 결과가 없습니다.')).toBeVisible();
  });

  test('검색 결과 클릭 시 해당 포스트로 이동', async ({ page }) => {
    await page.goto('/search');

    await page.getByRole('searchbox', { name: '블로그 검색' }).fill('Next');

    const firstResult = page.getByRole('main').getByRole('link').first();
    await firstResult.click();

    await expect(page).toHaveURL(/\/(blog|stories)\/.+/);
  });
});
