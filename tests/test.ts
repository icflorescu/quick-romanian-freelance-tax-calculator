import { expect, test } from '@playwright/test';

test('index page has expected subtitle', async ({ page }) => {
  await page.goto('/');
  expect(await page.textContent('.subtitle')).toBe('PFA în sistem real, anul 2023.');
});
