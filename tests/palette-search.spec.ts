import { expect, test } from './helpers/fixtures';
import { startQuestionnaire } from './helpers/form-builder';

test('finds a component by its complete displayed name', async ({ page }) => {
  await startQuestionnaire(page, 'Search by label');
  const palette = page.locator('app-sidebar .cdk-drag');
  await expect(palette.filter({ hasText: 'Number Field' })).toHaveCount(1);
  await page.getByRole('textbox', { name: 'Search components' }).fill('Number Field');
  test.fail(
    true,
    'Palette search matches translation keys, so the displayed label Number Field produces no results.',
  );
  await expect(palette).toHaveText(['Number Field']);
});

for (const { query, label, description } of [
  { query: 'Számmező', label: 'Számmező', description: 'complete translated name' },
  { query: 'DÁTUM', label: 'Dátumválasztó', description: 'uppercase accented substring' },
]) {
  test(`finds a Hungarian component by its ${description}`, async ({ page }) => {
    await startQuestionnaire(page, 'Hungarian palette search');
    await page.locator('.language-selector-button').hover();
    await page.getByRole('menuitem', { name: 'Hungarian', exact: true }).click();
    const sidebar = page.locator('app-sidebar');
    const palette = sidebar.locator('.cdk-drag');
    const search = sidebar.getByRole('textbox', { name: 'Keresés' });
    await expect(search).toBeVisible();
    await expect(palette.filter({ hasText: label })).toHaveCount(1);
    await search.fill(query);
    test.fail(true, 'Palette search matches translation keys rather than Hungarian labels.');
    await expect(palette).toHaveText([label]);
  });
}
