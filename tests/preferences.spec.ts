import type { Page } from '@playwright/test';
import { expect, test } from './helpers/fixtures';
import { addQuestion } from './helpers/form-builder';

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

async function startHungarianQuestionnaire(page: Page, title: string) {
  await page.goto('/');
  await page.locator('.language-selector-button').hover();
  await page.getByRole('menuitem', { name: 'Hungarian', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Kérdőívek', exact: true })).toBeVisible();
  await page
    .locator('app-dashboard .view')
    .getByRole('button', { name: /Új kérdőív létrehozása$/ })
    .first()
    .click();
  await page.locator('#title').fill(title);
  await page.getByRole('button', { name: 'Következő', exact: true }).click();
  await expect(page.locator('#sectionDropList')).toBeVisible();
}

test('shows the whole editor flow in Hungarian without leaking translation keys', async ({
  page,
}) => {
  const rawKey = /\b[A-Z][A-Z0-9_]{2,}(?:\.[A-Z0-9_?]+)+\b/;
  const expectNoRawKeys = async () =>
    expect(await page.locator('body').innerText()).not.toMatch(rawKey);

  await page.goto('/');
  await page.locator('.language-selector-button').hover();
  await page.getByRole('menuitem', { name: 'Hungarian', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Kérdőívek', exact: true })).toBeVisible();
  await expectNoRawKeys();

  await page
    .locator('app-dashboard .view')
    .getByRole('button', { name: /Új kérdőív létrehozása$/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Cím', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Következő', exact: true }).click();
  await expect(page.getByText('A cím kötelező', { exact: true })).toBeVisible();
  await expectNoRawKeys();
  await page.locator('#title').fill('Magyar űrlap');
  await page.getByRole('button', { name: 'Következő', exact: true }).click();

  const steps = page.locator('#progressbar');
  await expect(steps).toContainText('Űrlap információ');
  await expect(steps).toContainText('Komponensek');
  await expect(steps).toContainText('Eredmény');
  const palette = page.locator('app-sidebar');
  await expect(palette).toContainText('Alap bemenetek');
  await expect(palette).toContainText('Szekciók');
  await expect(palette).toContainText('Egysoros szövegmező');
  await expect(page.getByRole('button', { name: 'Előző verzió', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Következő verzió', exact: true })).toBeVisible();
  await expect(page.getByText('Beágyazott szerkesztés', { exact: true })).toBeVisible();

  const holder = await addQuestion(page, 'Egysoros szövegmező', 'Hogy hívnak?');
  await expect(holder.getByRole('button', { name: 'Vázlat', exact: true })).toBeVisible();
  await expect(holder.getByRole('button', { name: 'Visszaállítás', exact: true })).toBeVisible();
  await expectNoRawKeys();
  await page.getByRole('button', { name: 'Következő', exact: true }).first().click();
  await expect(page.getByRole('tab', { name: 'Projektinformáció', exact: true })).toBeVisible();
  await expectNoRawKeys();
  await page.getByRole('button', { name: 'Mentés', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Kérdőívek', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Magyar űrlap', exact: true })).toBeVisible();
});

test('the version label is translated in Hungarian', async ({ page }) => {
  await startHungarianQuestionnaire(page, 'Verzió');
  const selector = page.locator('.version-selector');
  await expect(selector).toContainText('1');
  // The VERSION key is missing from both translation files, so the key itself is displayed.
  test.fail(true, 'The version selector shows the untranslated key VERSION in Hungarian.');
  await expect(selector).not.toContainText('VERSION', { timeout: 2000 });
});
