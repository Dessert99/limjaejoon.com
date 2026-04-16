import { expect, test } from '@playwright/test';

test.describe('홈 자기소개 페이지', () => {
  test('hero + 모든 섹션 렌더링', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole('heading', { level: 1, name: /임재준/ })
    ).toBeVisible();

    for (const title of ['경력', '활동', '프로젝트', '보유 기술', '학력']) {
      await expect(
        page.getByRole('heading', { level: 2, name: title })
      ).toBeVisible();
    }
  });

  test('연락처 아이콘 링크 노출', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/Dessert99'
    );
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/jae-joon-lim/'
    );
  });

  test('프로젝트 외부 링크 노출', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Google Play' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'App Store' })).toBeVisible();
  });
});
