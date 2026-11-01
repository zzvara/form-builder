import { expect, test } from './helpers/fixtures';
import {
  addTextQuestion,
  questionnaireRow,
  saveProject,
  startProject,
  startQuestionnaire,
  testRow,
} from './helpers/form-builder';

test.describe('Questionnaire Creation Flow', () => {
  test('should require a title before continuing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'New Questionnaire', exact: true }).click();

    await page.getByRole('button', { name: 'Next', exact: true }).click();

    await expect(page.getByText('Title is required', { exact: true })).toBeVisible();
    await expect(page.locator('#title')).toBeVisible();
    await expect(page.locator('#sectionDropList')).toHaveCount(0);

    await page.locator('#title').fill('A title at last');
    await expect(page.getByText('Title is required', { exact: true })).not.toBeVisible();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.locator('#sectionDropList')).toBeVisible();
  });

  test('should create a new Questionnaire successfully', async ({ page }) => {
    const title = 'Playwright test';
    const description = 'This is an automated test description.';
    await startQuestionnaire(page, title, description);
    await addTextQuestion(page, 'Test Question');
    await saveProject(page);

    const row = questionnaireRow(page, title);
    await expect(row).toBeVisible();
    await expect(row).toContainText(description);
  });

  test('should create, edit, and delete a test project', async ({ page }) => {
    const title = 'Playwright test project';
    await startProject(page, 'Test', title);
    await addTextQuestion(page, 'Test project question');
    await saveProject(page);
    await expect(testRow(page, title)).toBeVisible();
    await expect(questionnaireRow(page, title)).toHaveCount(0);

    await testRow(page, title).locator('.edit-icon').click();
    const updatedTitle = `${title} updated`;
    await expect(page.locator('#title')).toHaveValue(title);
    await page.locator('#title').fill(updatedTitle);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.locator('#sectionDropList')).toBeVisible();
    await saveProject(page);
    await expect(testRow(page, updatedTitle)).toBeVisible();
    await expect(testRow(page, title)).toHaveCount(0);

    await testRow(page, updatedTitle).locator('.delete-icon').click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await expect(testRow(page, updatedTitle)).toHaveCount(0);
  });

  test('should persist the selected dashboard layout after reload', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Card View' }).click();
    await expect(page.locator('app-card-view')).toHaveCount(2);

    await page.reload();
    await expect(page.locator('app-card-view')).toHaveCount(2);

    await page.getByRole('button', { name: 'List View' }).click();
    await expect(page.locator('app-list-view')).toHaveCount(2);
  });
});
