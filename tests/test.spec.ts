import { expect, test } from '@playwright/test';

test('index page has expected subtitle', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('Taxe freelancing România - PFA 2023');
});
