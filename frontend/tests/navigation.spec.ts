import { test, expect } from '@playwright/test';

test.describe('테마 토글', () => {
  test('테마 버튼 클릭 시 html 클래스 변경', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const classNameBefore = await html.getAttribute('class');

    // 기본값 dark → light로 전환 (dark일 때 버튼 label은 "라이트 모드로 전환")
    await page.getByRole('button', { name: '라이트 모드로 전환' }).click();

    const classNameAfter = await html.getAttribute('class');
    expect(classNameAfter).not.toBe(classNameBefore);
  });

  test('테마 토글 후 새로고침해도 설정 유지', async ({ page }) => {
    await page.goto('/');

    // dark → light (dark일 때 버튼 label은 "라이트 모드로 전환")
    await page.getByRole('button', { name: '라이트 모드로 전환' }).click();
    await expect(
      page.getByRole('button', { name: '다크 모드로 전환' })
    ).toBeVisible();

    await page.reload();

    // 새로고침 후에도 light 유지
    await expect(
      page.getByRole('button', { name: '다크 모드로 전환' })
    ).toBeVisible();
  });
});
