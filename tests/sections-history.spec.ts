import { expect, test, type Page } from '@playwright/test';
import {
  addQuestion,
  addTextQuestion,
  dragFromPalette,
  reopenQuestionnaire,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

async function addSection(page: Page, type: 'Section' | 'Repeated Section') {
  const search = page.getByRole('textbox', { name: 'Search components' });
  await search.fill('section');
  await dragFromPalette(page, type);
  await search.clear();
  const section = page.locator('#sectionDropList .section-card');
  await expect(section).toHaveCount(1);
  return section;
}

test('saves a named section with a nested question and restores both after reopening', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Nested questionnaire');
  const section = await addSection(page, 'Section');
  const name = section.locator('app-edit-name').first();
  await name.locator('[nztype="edit"]').click();
  await name.getByRole('textbox').fill('personalDetails');
  await name.locator('[nztype="save"]').click();
  await expect(name).toHaveText('personalDetails');
  await addQuestion(
    page,
    'Single-line Text Field',
    'Your nested name',
    section.locator(':scope > .ant-card-body'),
  );
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
  await addQuestion(page, 'Number Field', 'Nested age', section.locator(':scope > .ant-card-body'));
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

test('version selection restores saved question snapshots and respects history boundaries', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Versioned questionnaire');
  const holder = await addTextQuestion(page, 'Original wording');
  await saveProject(page);
  await reopenQuestionnaire(page, 'Versioned questionnaire');
  const selector = page.locator('.version-selector');
  const originalVersion = (await selector.innerText()).match(/VERSION\s+\d+/)?.[0];
  expect(originalVersion).toBeTruthy();
  await holder.locator('input[name="inputQuestion"]').fill('Revised wording');
  await saveProject(page);
  await reopenQuestionnaire(page, 'Versioned questionnaire');
  const latestVersion = (await selector.innerText()).match(/VERSION\s+\d+/)?.[0];
  expect(latestVersion).toBeTruthy();
  expect(latestVersion).not.toBe(originalVersion);
  await expect(page.getByRole('button', { name: 'Next Version', exact: true })).toBeDisabled();

  await selector.click();
  await page
    .getByRole('menuitem')
    .filter({ has: page.getByText(originalVersion!, { exact: true }) })
    .click();
  await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue('Original wording');
  await expect(page.getByRole('menuitem')).toHaveCount(0);
  await selector.click();
  await page
    .getByRole('menuitem')
    .filter({ has: page.getByText('VERSION 1', { exact: true }) })
    .click();
  await expect(page.locator('#sectionDropList app-input-holder')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Previous Version', exact: true })).toBeDisabled();
  await expect(page.getByRole('menuitem')).toHaveCount(0);
  await selector.click();
  await page
    .getByRole('menuitem')
    .filter({ has: page.getByText(latestVersion!, { exact: true }) })
    .click();
  await expect(holder.locator('input[name="inputQuestion"]')).toHaveValue('Revised wording');
  await expect(page.getByRole('button', { name: 'Next Version', exact: true })).toBeDisabled();
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
  await addQuestion(
    page,
    'Single-line Text Field',
    'Repeated name',
    section.locator(':scope > .ant-card-body'),
  );
  await expect(section.locator('app-input-holder')).toHaveCount(1);
  await saveProject(page);
  await reopenQuestionnaire(page, 'Repeated questionnaire');
  await expect(section.locator('.repeated-settings-trigger')).toContainText('3x');
  await expect(section.locator('input[name="inputQuestion"]')).toHaveValue('Repeated name');
});
