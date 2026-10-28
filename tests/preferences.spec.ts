import { expect, test } from '@playwright/test';

test('switches language, persists it across reload, and switches back', async ({ page }) => {
  await page.goto('/');
  const language = page.locator('.language-selector-button');
  await language.hover();
  await page.getByRole('menuitem', { name: 'Hungarian', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Űrlapkészítő', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kérdőívek', exact: true })).toBeVisible();
  await expect(language).toHaveText('Magyar');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Űrlapkészítő', exact: true })).toBeVisible();
  await expect(language).toHaveText('Magyar');
  await language.hover();
  await page.getByRole('menuitem', { name: 'Angol', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Form Builder', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Questionnaires', exact: true })).toBeVisible();
  await page.reload();
  await expect(language).toHaveText('English');
});

test('changes the rendered theme and preserves the selection after reload', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.theme-selector-button');
  const table = page.locator('.ant-table').first();
  await expect(table).toBeVisible();
  await expect(toggle.getByRole('img', { name: 'moon' })).toBeVisible();
  const darkBackground = await table.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await toggle.click();
  await expect(toggle.getByRole('img', { name: 'sun' })).toBeVisible();
  await expect(table).not.toHaveCSS('background-color', darkBackground);
  const lightBackground = await table.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.reload();
  await expect(toggle.getByRole('img', { name: 'sun' })).toBeVisible();
  await expect(table).toHaveCSS('background-color', lightBackground);
  await toggle.click();
  await expect(toggle.getByRole('img', { name: 'moon' })).toBeVisible();
  await expect(table).toHaveCSS('background-color', darkBackground);
  await page.reload();
  await expect(toggle.getByRole('img', { name: 'moon' })).toBeVisible();
  await expect(table).toHaveCSS('background-color', darkBackground);
});
