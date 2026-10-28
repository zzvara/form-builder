import { expect, test } from '@playwright/test';
import {
  addQuestion,
  reopenQuestionnaire,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

test('required text shows its configured error and accepts a corrected answer', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Required answer');
  const holder = await addQuestion(page, 'Single-line Text Field', 'Your name');
  await holder.getByRole('button', { name: 'edit', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog
    .getByRole('checkbox', { name: 'Should it have a default value?', exact: true })
    .uncheck();
  await dialog.getByRole('checkbox', { name: 'Is it required?', exact: true }).check();
  await dialog.locator('input[formcontrolname="requiredMessage"]').fill('Please enter your name');
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  await holder.getByRole('button', { name: 'Draft', exact: true }).click();
  const preview = holder.locator('.input-preview-container input');
  await preview.fill('Temporary');
  await preview.clear();
  await preview.blur();
  await expect(holder.getByText('Please enter your name', { exact: true })).toBeVisible();
  await preview.fill('Ada Lovelace');
  await preview.blur();
  await expect(holder.getByText('Please enter your name', { exact: true })).not.toBeVisible();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Required answer');
  await expect(preview).toHaveValue('Ada Lovelace');
  await expect(preview).toHaveAttribute('required', '');
});

test('text input enforces the configured maximum length and updates its character counter', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Short answer');
  const holder = await addQuestion(page, 'Single-line Text Field', 'Five characters');
  await holder.getByRole('button', { name: 'edit', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('[formcontrolname="maxLength"] input').check();
  await dialog.locator('[formcontrolname="maxLengthNumber"] input').fill('5');
  await dialog.locator('[formcontrolname="showCharacterCounter"] input').check();
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  const preview = holder.locator('.input-preview-container input');
  await preview.pressSequentially('abcdefgh');
  await expect(preview).toHaveValue('abcde');
  await expect(holder.locator('.input-preview-container')).toContainText('5/5');
  await preview.blur();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Short answer');
  await expect(preview).toHaveValue('abcde');
  await expect(preview).toHaveAttribute('maxlength', '5');
  await expect(holder.locator('.input-preview-container')).toContainText('5/5');
});

test('text area retains a multiline answer after saving and reopening', async ({ page }) => {
  await startQuestionnaire(page, 'Multiline answer');
  const holder = await addQuestion(page, 'Text Area (multi-line)', 'Tell us more');
  const preview = holder.locator('.input-preview-container textarea');
  await preview.fill('First line\nSecond line\nThird line');
  await preview.blur();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Multiline answer');
  await expect(preview).toHaveValue('First line\nSecond line\nThird line');
});

test('number preview uses the configured step and upper and lower bounds', async ({ page }) => {
  await startQuestionnaire(page, 'Bounded number');
  const holder = await addQuestion(page, 'Number Field', 'An even number');
  await holder.getByRole('button', { name: 'edit', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('[formcontrolname="min"] input').check();
  await dialog.locator('[formcontrolname="minNumber"] input').fill('2');
  await dialog.locator('[formcontrolname="max"] input').check();
  await dialog.locator('[formcontrolname="maxNumber"] input').fill('6');
  await dialog.locator('[formcontrolname="stepNumber"] input').fill('2');
  await dialog.locator('[formcontrolname="defaultValue"] input').fill('2');
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  const preview = holder.locator('.input-preview-container input');
  await expect(preview).toHaveValue('2');
  await preview.press('ArrowDown');
  await expect(preview).toHaveValue('2');
  await preview.press('ArrowUp');
  await expect(preview).toHaveValue('4');
  await preview.press('ArrowUp');
  await expect(preview).toHaveValue('6');
  await preview.press('ArrowUp');
  await expect(preview).toHaveValue('6');
  await preview.press('ArrowDown');
  await preview.blur();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Bounded number');
  await expect(preview).toHaveValue('4');
  await preview.press('ArrowDown');
  await expect(preview).toHaveValue('2');
});
