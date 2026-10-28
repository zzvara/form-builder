import { expect, test } from '@playwright/test';
import {
  addTextQuestion,
  openResults,
  questionnaireRow,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

test.describe('Component editor', () => {
  test.beforeEach(async ({ page }) => {
    await startQuestionnaire(page, 'Component editor questionnaire');
  });

  test('filters the palette case-insensitively and restores it after clearing an empty search', async ({
    page,
  }) => {
    const sidebar = page.locator('app-sidebar');
    const components = sidebar.locator('.cdk-drag');
    const search = sidebar.getByRole('textbox', { name: 'Search components' });
    await expect(components).toHaveCount(12);

    await search.fill('pIcKeR');
    await expect(components).toHaveText(['Date Picker', 'Range Picker', 'Time Picker']);

    await search.fill('no matching component');
    await expect(components).toHaveCount(0);
    await sidebar.locator('.clear-icon').click();
    await expect(search).toBeEmpty();
    await expect(components).toHaveCount(12);
    await addTextQuestion(page, 'Question after clearing the search');
    await expect(page.locator('#sectionDropList input[name="inputQuestion"]')).toHaveValue(
      'Question after clearing the search',
    );
  });

  test('cancels settings changes, then saves question and placeholder changes across a reload', async ({
    page,
  }) => {
    const holder = await addTextQuestion(page, 'Original question');
    await holder.getByRole('button', { name: 'edit', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.locator('input[formcontrolname="questionValue"]').fill('Discarded question');
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue('Original question');

    await holder.getByRole('button', { name: 'edit', exact: true }).click();
    await dialog.locator('input[formcontrolname="questionValue"]').fill('Your preferred name');
    await dialog.locator('input[formcontrolname="placeholderValue"]').fill('Enter your name');
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue('Your preferred name');
    await expect(holder.getByPlaceholder('Enter your name', { exact: true })).toBeVisible();

    await saveProject(page);
    await page.reload();
    await questionnaireRow(page, 'Component editor questionnaire').locator('.edit-icon').click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue('Your preferred name');
    await expect(holder.getByPlaceholder('Enter your name', { exact: true })).toBeVisible();
  });

  test('switches inline editing off and on without losing question or preview values', async ({
    page,
  }) => {
    const holder = await addTextQuestion(page, 'Name shown in read-only mode');
    const preview = holder.locator('.input-preview-container input');
    await preview.fill('Ada');
    await page.getByRole('checkbox', { name: 'Inline edit', exact: true }).uncheck();
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveCount(0);
    await expect(holder.getByText('Name shown in read-only mode', { exact: true })).toBeVisible();
    await expect(preview).toBeDisabled();
    await expect(preview).toHaveValue('Ada');

    await page.getByRole('checkbox', { name: 'Inline edit', exact: true }).check();
    await expect(page.getByRole('checkbox', { name: 'Inline edit', exact: true })).toBeChecked();
    // Reproduced in the running app: the toggle updates but the question stays read-only.
    // Keep the desired behavior executable; remove this annotation when the product is fixed.
    test.fail(
      true,
      'Re-enabling inline edit leaves the question read-only and its preview disabled.',
    );
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue(
      'Name shown in read-only mode',
    );
    await expect(preview).toBeEnabled();
    await expect(preview).toHaveValue('Ada');
  });

  test('cancels question deletion, then confirms it and restores it with undo and redo', async ({
    page,
  }) => {
    const holder = await addTextQuestion(page, 'Recoverable question');
    await holder.getByRole('button', { name: 'delete', exact: true }).click();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue('Recoverable question');

    await holder.getByRole('button', { name: 'delete', exact: true }).click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await expect(holder).toHaveCount(0);
    await page.getByRole('button', { name: 'undo', exact: true }).click();
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue('Recoverable question');
    await page.getByRole('button', { name: 'redo', exact: true }).click();
    await expect(holder).toHaveCount(0);
  });

  test('requires confirmation before resetting question and preview values', async ({ page }) => {
    const holder = await addTextQuestion(page, 'Question to reset');
    await holder.locator('.input-preview-container input').fill('Preview to reset');
    await holder.getByRole('button', { name: 'Reset', exact: true }).click();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue('Question to reset');
    await expect(holder.locator('.input-preview-container input')).toHaveValue('Preview to reset');

    await holder.getByRole('button', { name: 'Reset', exact: true }).click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await expect(holder.locator('input[name="inputQuestion"]')).toBeEmpty();
    await expect(holder.locator('.input-preview-container input')).toBeEmpty();
    await expect(page.locator('#sectionDropList app-input-holder')).toHaveCount(1);
  });

  test('blocks an active question without a title and allows progression after correction', async ({
    page,
  }) => {
    const holder = await addTextQuestion(page, 'Temporary question');
    await holder.getByRole('button', { name: 'Draft', exact: true }).click();
    await expect(holder.getByRole('button', { name: 'Active', exact: true })).toBeVisible();
    await holder.locator('input[name="inputQuestion"]').clear();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(holder.locator('input[name="inputQuestion"]')).toBeVisible();
    await expect(holder.locator('nz-input-group .error-icon')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Project Info', exact: true })).toHaveCount(0);

    await holder.locator('input[name="inputQuestion"]').fill('Corrected question');
    await openResults(page);
    await expect(page.getByRole('tabpanel', { name: 'Project Info', exact: true })).toContainText(
      'Component editor questionnaire',
    );
  });
});
