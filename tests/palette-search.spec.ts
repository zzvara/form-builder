import { expect, test } from '@playwright/test';
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
