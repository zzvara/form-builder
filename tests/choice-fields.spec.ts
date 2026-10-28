import { expect, test } from '@playwright/test';
import {
  addQuestion,
  reopenQuestionnaire,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

for (const component of ['Dropdown List', 'Radio group', 'Checkbox group']) {
  test(`${component}: rejects duplicate options and persists additions, renames, and removal`, async ({
    page,
  }) => {
    const title = `${component} options`;
    await startQuestionnaire(page, title);
    const holder = await addQuestion(page, component, 'Choose an option');
    await holder.getByRole('button', { name: 'edit', exact: true }).click();
    const dialog = page.getByRole('dialog');
    const newOption = dialog.locator('nz-input-group[nzsearch] input');
    const add = dialog.getByRole('button', { name: 'Add new option', exact: true });
    await expect(add).toBeDisabled();
    await newOption.fill('Option 1');
    await newOption.blur();
    await expect(add).toBeDisabled();
    await expect(dialog).toContainText(/already/i);
    await newOption.fill('Other');
    await add.click();
    const other = dialog.getByRole('row').filter({ hasText: 'Other' });
    await expect(other).toBeVisible();
    await other.getByRole('button', { name: 'edit', exact: true }).click();
    const editingRow = dialog.getByRole('row').filter({ has: page.getByRole('textbox') });
    await editingRow.getByRole('textbox').fill('Custom option');
    await editingRow.getByRole('button', { name: 'check', exact: true }).click();
    await expect(dialog.getByRole('row').filter({ hasText: 'Custom option' })).toBeVisible();
    await dialog
      .getByRole('row')
      .filter({ hasText: 'Option 2' })
      .getByRole('button', { name: 'delete', exact: true })
      .click();
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await saveProject(page);
    await reopenQuestionnaire(page, title);
    await holder.getByRole('button', { name: 'edit', exact: true }).click();
    await expect(dialog.getByRole('row').filter({ hasText: 'Custom option' })).toBeVisible();
    await expect(dialog.getByRole('row').filter({ hasText: 'Option 1' })).toBeVisible();
    await expect(dialog.getByRole('row').filter({ hasText: 'Option 2' })).toHaveCount(0);
  });
}

test('radio preview enforces a single selection and saves the selected answer', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Radio answers');
  const holder = await addQuestion(page, 'Radio group', 'Choose one');
  await holder.locator('label[nz-radio]').filter({ hasText: 'Option 1' }).click();
  await expect(holder.getByRole('radio', { name: 'Option 1', exact: true })).toBeChecked();
  await holder.locator('label[nz-radio]').filter({ hasText: 'Option 3' }).click();
  await expect(holder.getByRole('radio', { name: 'Option 1', exact: true })).not.toBeChecked();
  await expect(holder.getByRole('radio', { name: 'Option 3', exact: true })).toBeChecked();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Radio answers');
  await expect(holder.getByRole('radio', { name: 'Option 3', exact: true })).toBeChecked();
  await expect(holder.getByRole('radio', { name: 'Option 1', exact: true })).not.toBeChecked();
});

test('dropdown preview supports multiple selections and retains them after reopening', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Multiple selections');
  const holder = await addQuestion(page, 'Dropdown List', 'Choose several');
  await holder.getByRole('button', { name: 'edit', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('[formcontrolname="isMultipleChoice"] input').check();
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  const preview = holder.locator('.input-preview-container');
  await preview.locator('nz-select').click();
  await page.locator('.ant-select-dropdown').getByTitle('Option 1', { exact: true }).click();
  await page.locator('.ant-select-dropdown').getByTitle('Option 2', { exact: true }).click();
  await holder.locator('input[name="inputQuestion"]').click();
  await expect(preview.locator('.ant-select-selection-item-content')).toHaveText([
    'Option 1',
    'Option 2',
  ]);
  await saveProject(page);
  await reopenQuestionnaire(page, 'Multiple selections');
  await expect(preview.locator('.ant-select-selection-item-content')).toHaveText([
    'Option 1',
    'Option 2',
  ]);
});

test('checkbox settings preserve checked and disabled options', async ({ page }) => {
  await startQuestionnaire(page, 'Checkbox defaults');
  const holder = await addQuestion(page, 'Checkbox group', 'Choose any');
  await holder.getByRole('button', { name: 'edit', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog
    .getByRole('row')
    .filter({ hasText: 'Option 1' })
    .locator('[formcontrolname="checked"] input')
    .check();
  await dialog
    .getByRole('row')
    .filter({ hasText: 'Option 2' })
    .locator('[formcontrolname="disabled"] input')
    .check();
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(holder.getByRole('checkbox', { name: 'Option 1', exact: true })).toBeChecked();
  await expect(holder.getByRole('checkbox', { name: 'Option 2', exact: true })).toBeDisabled();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Checkbox defaults');
  await expect(holder.getByRole('checkbox', { name: 'Option 1', exact: true })).toBeChecked();
  await expect(holder.getByRole('checkbox', { name: 'Option 2', exact: true })).toBeDisabled();
});
