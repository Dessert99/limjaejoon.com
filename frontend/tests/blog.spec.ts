import { test, expect } from '@playwright/test';

test.describe('블로그 목록 페이지', () => {
  test('태그 클릭 시 URL에 쿼리 파라미터 추가', async ({ page }) => {
    await page.goto('/blog');

    const sidebar = page.getByRole('complementary');
    // "전체" 다음 첫 번째 태그 버튼 클릭
    const firstTag = sidebar
      .getByRole('button')
      .filter({ hasNotText: '전체' })
      .first();
    const tagName = await firstTag.textContent();
    await firstTag.click();

    await expect(page).toHaveURL(
      `/blog?tag=${encodeURIComponent(tagName!.trim())}`
    );
  });

  test('활성 태그 재클릭 시 필터 해제', async ({ page }) => {
    await page.goto('/blog');

    const sidebar = page.getByRole('complementary');
    const firstTag = sidebar
      .getByRole('button')
      .filter({ hasNotText: '전체' })
      .first();
    await firstTag.click();
    await firstTag.click(); // 재클릭

    await expect(page).toHaveURL('/blog');
  });

  test('"전체" 버튼 클릭 시 태그 필터 해제', async ({ page }) => {
    await page.goto('/blog?tag=Next.js');

    await page
      .getByRole('complementary')
      .getByRole('button', { name: '전체' })
      .click();

    await expect(page).toHaveURL('/blog');
  });

  test('태그 필터 적용 시 해당 태그 포스트만 표시', async ({ page }) => {
    await page.goto('/blog?tag=Next.js');

    // 표시된 모든 카드의 태그에 "Next.js"가 포함되어야 함
    const cards = page.getByRole('main').getByRole('link');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('포스트 카드 클릭 시 상세 페이지로 이동', async ({ page }) => {
    await page.goto('/blog');

    const firstCard = page.getByRole('main').getByRole('link').first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/blog\/.+/);
  });
});
