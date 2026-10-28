import { expect, test } from '@playwright/test';
import {
  addQuestion,
  reopenQuestionnaire,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

const inputTypes = [
  { name: 'Number Field', preview: 'nz-input-number' },
  { name: 'Date Picker', preview: 'nz-date-picker' },
  { name: 'Range Picker', preview: 'nz-range-picker' },
  { name: 'Time Picker', preview: 'nz-time-picker' },
  { name: 'Text Area (multi-line)', preview: 'textarea' },
  { name: 'Image Upload', preview: 'nz-upload' },
  { name: 'Dropdown List', preview: 'nz-select' },
  { name: 'Radio group', preview: 'nz-radio-group' },
  { name: 'Checkbox group', preview: 'nz-checkbox-group' },
];

for (const input of inputTypes) {
  test(`${input.name}: saves settings and restores the correct preview after reopening`, async ({
    page,
  }) => {
    const title = `${input.name} questionnaire`;
    await startQuestionnaire(page, title);
    const holder = await addQuestion(page, input.name, 'Original question');
    await expect(
      holder.locator('.input-preview-container').locator(input.preview).first(),
    ).toBeVisible();
    await holder.getByRole('button', { name: 'edit', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.locator('input[formcontrolname="questionValue"]').fill(`Configured ${input.name}`);
    await dialog.locator('.ql-editor').fill(`Instructions for ${input.name}`);
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue(
      `Configured ${input.name}`,
    );
    await saveProject(page);
    await reopenQuestionnaire(page, title);
    await expect(page.locator('#sectionDropList app-input-holder')).toHaveCount(1);
    await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue(
      `Configured ${input.name}`,
    );
    await expect(holder.locator('.ql-editor')).toHaveText(`Instructions for ${input.name}`);
    await expect(
      holder.locator('.input-preview-container').locator(input.preview).first(),
    ).toBeVisible();
  });
}
