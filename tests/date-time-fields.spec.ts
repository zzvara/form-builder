import { expect, test } from '@playwright/test';
import {
  addQuestion,
  reopenQuestionnaire,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

test('date preview selects a calendar day and restores it after saving', async ({ page }) => {
  await startQuestionnaire(page, 'Calendar date');
  const holder = await addQuestion(page, 'Date Picker', 'Select a date');
  const preview = holder.locator('.input-preview-container input');
  await preview.click();
  await page.getByText('Today', { exact: true }).click();
  await expect(preview).not.toBeEmpty();
  const selectedDate = await preview.inputValue();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Calendar date');
  await expect(preview).toHaveValue(selectedDate);
});

test('range preview saves both calendar endpoints', async ({ page }) => {
  await startQuestionnaire(page, 'Calendar range');
  const holder = await addQuestion(page, 'Range Picker', 'Select a range');
  const inputs = holder.locator('.input-preview-container input');
  await inputs.first().click();
  const calendar = page.getByRole('grid').first();
  await calendar.getByRole('gridcell', { name: '10', exact: true }).click();
  await calendar.getByRole('gridcell', { name: '15', exact: true }).click();
  await expect(inputs.first()).not.toBeEmpty();
  await expect(inputs.nth(1)).not.toBeEmpty();
  const start = await inputs.first().inputValue();
  const end = await inputs.nth(1).inputValue();
  expect(start).not.toBe(end);
  await saveProject(page);
  await reopenQuestionnaire(page, 'Calendar range');
  await expect(inputs.first()).toHaveValue(start);
  await expect(inputs.nth(1)).toHaveValue(end);
});

test('time preview selects a time and restores it after saving', async ({ page }) => {
  await startQuestionnaire(page, 'Selected time');
  const holder = await addQuestion(page, 'Time Picker', 'Select a time');
  const preview = holder.locator('.input-preview-container input');
  await preview.click();
  await page.getByText('Now', { exact: true }).click();
  await holder.locator('input[name="inputQuestion"]').click();
  await expect(preview).not.toBeEmpty();
  const selectedTime = await preview.inputValue();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Selected time');
  await expect(preview).toHaveValue(selectedTime);
});
