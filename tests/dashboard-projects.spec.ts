import { expect, test } from '@playwright/test';
import {
  addTextQuestion,
  questionnaireRow,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

test('keeps a project when deletion is cancelled and persists confirmed deletion', async ({
  page,
}) => {
  const title = 'Deletion confirmation questionnaire';
  await startQuestionnaire(page, title, 'Description retained after reload');
  await addTextQuestion(page, 'A saved question');
  await saveProject(page);
  const row = questionnaireRow(page, title);
  await expect(row).toContainText('Description retained after reload');
  await row.locator('.delete-icon').click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.reload();
  await expect(row).toBeVisible();

  await row.locator('.delete-icon').click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(row).toHaveCount(0);
  await page.reload();
  await expect(row).toHaveCount(0);
  await expect(page.locator('app-list-view').first()).toContainText(
    "You don't have any questionnaires yet.",
  );
});

test('shows saved data in card view and opens the same project for editing', async ({ page }) => {
  const title = 'Questionnaire in card view';
  await startQuestionnaire(page, title, 'Card view description');
  await addTextQuestion(page, 'Question saved from the editor');
  await saveProject(page);
  await page.getByRole('button', { name: 'Card View' }).click();
  const card = page.locator('app-card-view .project-card').filter({ hasText: title });
  await expect(card).toBeVisible();
  await expect(card).toContainText('Card view description');
  await page.reload();
  await expect(card).toBeVisible();
  await card.locator('.edit-icon').click();
  await expect(page.locator('#title')).toHaveValue(title);
  await expect(page.locator('app-info-page .ql-editor')).toHaveText('Card view description');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('#sectionDropList input[name="inputQuestion"]')).toHaveValue(
    'Question saved from the editor',
  );
});

test('sorts questionnaire titles in both directions', async ({ page }) => {
  for (const title of ['Zebra survey', 'Alpha survey', 'Middle survey']) {
    await startQuestionnaire(page, title);
    await addTextQuestion(page, `Question for ${title}`);
    await saveProject(page);
  }

  const list = page.locator('app-list-view').first();
  const titleColumn = list.getByRole('columnheader', { name: /^Title/ });
  const titles = list.locator('tbody tr td:first-child[title]');
  await titleColumn.click();
  await expect(titles).toHaveText(['Alpha survey', 'Middle survey', 'Zebra survey']);
  await titleColumn.click();
  await expect(titles).toHaveText(['Zebra survey', 'Middle survey', 'Alpha survey']);
});
