import { expect, test } from './helpers/fixtures';
import {
  addTextQuestion,
  questionnaireRow,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

test('the dashboard layout toggle responds to Enter and Space', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.toolbar').getByRole('button');

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('app-card-view')).toHaveCount(2);
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('app-list-view')).toHaveCount(2);
});

test('opens a project, submits the form, and returns home using only the keyboard', async ({
  page,
}) => {
  const title = 'Keyboard project';
  await startQuestionnaire(page, title);
  await addTextQuestion(page, 'Keyboard question');
  await saveProject(page);

  await questionnaireRow(page, title).getByRole('button', { name: 'edit', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#title')).toHaveValue(title);
  await page.locator('#title').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#sectionDropList input[name="inputQuestion"]')).toHaveValue(
    'Keyboard question',
  );

  await page.getByRole('button', { name: 'home', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page).toHaveURL(/\/(dashboard)?$/);
  await expect(questionnaireRow(page, title)).toBeVisible();
});

test('a project can be deleted with the keyboard', async ({ page }) => {
  const title = 'Keyboard delete';
  await startQuestionnaire(page, title);
  await addTextQuestion(page, 'Keyboard question');
  await saveProject(page);

  const row = questionnaireRow(page, title);
  await row.getByRole('button', { name: 'edit', exact: true }).focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  // The delete icon has no tab stop: focus skips to the next button on the page.
  test.fail(
    true,
    'The delete icon is not keyboard focusable, so projects cannot be deleted without a mouse.',
  );
  await expect(page.getByText('Delete this project?')).toBeVisible({ timeout: 2000 });
});

test('the language menu can be opened with the keyboard', async ({ page }) => {
  await page.goto('/');
  const language = page.locator('.language-selector-button');
  await language.focus();
  await expect(language).toBeFocused();
  await page.keyboard.press('Enter');
  // The dropdown only listens for hover, so keyboard users cannot change the language.
  test.fail(true, 'The language dropdown opens on hover only and ignores Enter, Space and arrows.');
  await expect(page.getByRole('menuitem', { name: 'Hungarian', exact: true })).toBeVisible({
    timeout: 2000,
  });
});
