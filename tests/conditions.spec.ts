import type { Locator, Page } from '@playwright/test';
import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addSection,
  addTextQuestion,
  openSettings,
  renameComponent,
  reopenQuestionnaire,
  saveProject,
  sectionBody,
  startQuestionnaire,
  tooltip,
} from './helpers/form-builder';

/** The settings dialog is the first dialog; the variable picker opens on top of it. */
const settingsDialog = (page: Page) => page.getByRole('dialog').first();

async function enableCondition(dialog: Locator) {
  await dialog.getByRole('checkbox', { name: 'Enable', exact: true }).check();
}

async function selectVariable(page: Page, dialog: Locator, name: string) {
  await dialog.getByText('Add variables', { exact: true }).click();
  const picker = page.getByRole('dialog').last();
  await picker
    .locator('.ant-transfer-list')
    .first()
    .locator('.ant-transfer-list-content-item')
    .filter({ hasText: name })
    .getByRole('checkbox')
    .check();
  await picker.locator('.ant-transfer-operation button:not([disabled])').first().click();
  await picker.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(dialog.locator('nz-tag').filter({ hasText: name })).toBeVisible();
}

async function enterCode(page: Page, dialog: Locator, code: string) {
  await dialog.locator('.cm-content').click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(code);
  // The code is validated when the editor loses focus.
  await dialog.getByText('Code', { exact: true }).click();
}

async function addQuestionAfterAge(page: Page) {
  const licence = await addTextQuestion(page, 'Driving licence number');
  const age = await addQuestion(page, 'Number Field', 'Age', { before: licence });
  await renameComponent(age, 'age');
  return licence;
}

test('saves a condition that reads an earlier answer and restores it after reopening', async ({
  page,
  appErrors,
}) => {
  test.slow();
  const title = 'Conditional question';
  await startQuestionnaire(page, title);
  const licence = await addQuestionAfterAge(page);

  const dialog = await openSettings(page, licence);
  const save = dialog.getByRole('button', { name: 'Save', exact: true });
  const alerts = dialog.locator('nz-alert');
  await enableCondition(dialog);
  await expect(save).toBeDisabled();
  await selectVariable(page, dialog, 'age');

  await enterCode(page, dialog, 'return age >=');
  await expect(alerts).toHaveText(/errors? in the code/);
  await expect(save).toBeDisabled();
  await enterCode(page, dialog, 'return age + 1;');
  await expect(alerts).toHaveText('The code returns with an incorrect type!');
  await expect(save).toBeDisabled();
  await enterCode(page, dialog, 'return unknownThing > 1;');
  await expect(alerts).toHaveText('An error occurred while running the code!');
  await expect(save).toBeDisabled();
  // The worker that runs the code logs its failure; consume it so the fixture does not flag it.
  const workerErrors = appErrors.splice(0);
  expect(workerErrors.length).toBeGreaterThan(0);
  expect(workerErrors.filter((error) => !error.includes('unknownThing is not defined'))).toEqual(
    [],
  );

  await enterCode(page, dialog, 'return age >= 18;');
  await expect(alerts).toHaveCount(0);
  await expect(save).toBeEnabled();
  await save.click();
  await expect(dialog).not.toBeVisible();

  const icon = licence.getByRole('img', { name: 'code', exact: true });
  await icon.hover();
  await expect(tooltip(page)).toHaveText('return age >= 18;');

  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect(icon).toBeVisible();
  const reopened = await openSettings(page, licence);
  await expect(reopened.getByRole('checkbox', { name: 'Enable', exact: true })).toBeChecked();
  await expect(reopened.locator('nz-tag').filter({ hasText: 'age' })).toBeVisible();
  await expect(reopened.locator('.cm-content')).toHaveText('return age >= 18;');
  await expect(reopened.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();
});

test('removing a variable invalidates a condition that still uses it', async ({
  page,
  appErrors,
}) => {
  await startQuestionnaire(page, 'Removed variable');
  const licence = await addQuestionAfterAge(page);
  const dialog = await openSettings(page, licence);
  await enableCondition(dialog);
  await selectVariable(page, dialog, 'age');
  await enterCode(page, dialog, 'return age >= 18;');
  await expect(dialog.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();

  await dialog.locator('nz-tag').filter({ hasText: 'age' }).locator('.ant-tag-close-icon').click();
  await expect(dialog.locator('nz-tag').filter({ hasText: 'age' })).toHaveCount(0);
  // The editor keeps validating against the removed variable, so the code is still accepted.
  test.fail(
    true,
    'Code that uses a removed variable passes validation and can be saved, although it cannot run.',
  );
  await expect(dialog.locator('nz-alert')).toHaveText('An error occurred while running the code!', {
    timeout: 3000,
  });
  appErrors.splice(0);
});

test('a condition can guard a whole section', async ({ page }) => {
  const title = 'Conditional section';
  await startQuestionnaire(page, title);
  const section = await addSection(page, 'Section');
  await addQuestion(page, 'Single-line Text Field', 'Inside the section', sectionBody(section));

  await section
    .locator('.section-actions')
    .getByRole('button', { name: 'edit', exact: true })
    .click();
  const dialog = settingsDialog(page);
  const save = dialog.getByRole('button', { name: 'Save', exact: true });
  await enableCondition(dialog);
  await enterCode(page, dialog, 'return true;');
  await expect(save).toBeEnabled();
  // The dialog cannot find a palette-created section by its id, so Save does nothing.
  test.fail(
    true,
    'Save in the Section Settings dialog does nothing: the dialog stays open and no condition is stored.',
  );
  await save.click();
  await expect(dialog).not.toBeVisible({ timeout: 2000 });

  const icon = section.getByRole('img', { name: 'code', exact: true });
  await icon.hover();
  await expect(tooltip(page)).toHaveText('return true;');
  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect(icon).toBeVisible();
});
