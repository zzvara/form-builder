import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addSection,
  renameComponent,
  reopenQuestionnaire,
  saveProject,
  sectionBody,
  startQuestionnaire,
} from './helpers/form-builder';

test('saves a named section with a nested question and restores both after reopening', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Nested questionnaire');
  const section = await addSection(page, 'Section');
  await renameComponent(section, 'personalDetails');
  await addQuestion(page, 'Single-line Text Field', 'Your nested name', sectionBody(section));
  await expect(section.locator('app-input-holder')).toHaveCount(1);
  await saveProject(page);
  await reopenQuestionnaire(page, 'Nested questionnaire');
  await expect(section.locator('app-edit-name').first()).toHaveText('personalDetails');
  await expect(section.locator('input[name="inputQuestion"]')).toHaveValue('Your nested name');
});

test('deleting a section removes its children and undo restores the complete section', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Recover a section');
  const section = await addSection(page, 'Section');
  await addQuestion(page, 'Number Field', 'Nested age', sectionBody(section));
  await expect(section.locator('app-input-holder')).toHaveCount(1);
  const remove = section
    .locator('.section-actions')
    .getByRole('button', { name: 'delete', exact: true });
  await remove.click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(section.locator('input[name="inputQuestion"]')).toHaveValue('Nested age');
  await remove.click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(section).toHaveCount(0);
  await expect(page.locator('#sectionDropList app-input-holder')).toHaveCount(0);
  await page.getByRole('button', { name: 'undo', exact: true }).click();
  await expect(section.locator('input[name="inputQuestion"]')).toHaveValue('Nested age');
  await saveProject(page);
  await reopenQuestionnaire(page, 'Recover a section');
  await expect(section.locator('input[name="inputQuestion"]')).toHaveValue('Nested age');
});

test('repeated section saves a fixed repetition count with its nested question', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Repeated questionnaire');
  const section = await addSection(page, 'Repeated Section');
  await section.locator('.repeated-settings-trigger').click();
  const settings = page.locator('.ant-popover .repeated-settings-panel');
  await settings.locator('nz-select').click();
  await page.locator('.ant-select-dropdown').getByTitle('Given number', { exact: true }).click();
  await settings.getByRole('spinbutton').fill('3');
  await page.getByRole('textbox', { name: 'Search components' }).click();
  await expect(section.locator('.repeated-settings-trigger')).toContainText('3x');
  await addQuestion(page, 'Single-line Text Field', 'Repeated name', sectionBody(section));
  await expect(section.locator('app-input-holder')).toHaveCount(1);
  await saveProject(page);
  await reopenQuestionnaire(page, 'Repeated questionnaire');
  await expect(section.locator('.repeated-settings-trigger')).toContainText('3x');
  await expect(section.locator('input[name="inputQuestion"]')).toHaveValue('Repeated name');
});
