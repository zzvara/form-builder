import { expect, test } from '@playwright/test';
import {
  addTextQuestion,
  openResults,
  questionnaireRow,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

test('changes a questionnaire to a test and saves it in the correct dashboard category', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Reclassified project', 'Description survives navigation');
  await addTextQuestion(page, 'Retained question');
  await saveProject(page);
  await questionnaireRow(page, 'Reclassified project').locator('.edit-icon').click();
  await expect(page.locator('#title')).toHaveValue('Reclassified project');
  await page.locator('#switch button').click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('#sectionDropList input[name="inputQuestion"]')).toHaveValue(
    'Retained question',
  );
  await openResults(page);
  await expect(page.getByRole('row', { name: 'Type Test', exact: true })).toBeVisible();
  await expect(page.getByRole('tabpanel', { name: 'Project Info', exact: true })).toContainText(
    'Description survives navigation',
  );
  await page.getByRole('button', { name: 'Save Project', exact: true }).click();
  await page.reload();
  await expect(questionnaireRow(page, 'Reclassified project')).toHaveCount(0);
  const testRow = page
    .locator('app-list-view')
    .nth(1)
    .getByRole('row')
    .filter({ hasText: 'Reclassified project' });
  await expect(testRow).toBeVisible();
  await testRow.locator('.edit-icon').click();
  await expect(page.locator('#switch button')).toHaveText('Test');
});

test('saves a deadline and time limit and restores both controls when reopening', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: /New Questionnaire$/ })
    .first()
    .click();
  await page.locator('#title').fill('Scheduled questionnaire');
  await page.locator('[formcontrolname="hasdeadline"] input').check();
  const deadline = page.locator('#deadline input');
  await deadline.click();
  await page.getByText('Today', { exact: true }).click();
  await expect(deadline).toHaveValue(/^\d{4}\.\d{2}\.\d{2}$/);
  const selectedDeadline = await deadline.inputValue();
  await page.locator('[formcontrolname="haslimit"] input').check();
  const limit = page.locator('nz-time-picker input');
  await limit.click();
  await limit.fill('01:30');
  await limit.press('Tab');
  await page.locator('#title').click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await addTextQuestion(page, 'Scheduled question');
  await openResults(page);
  const info = page.getByRole('tabpanel', { name: 'Project Info', exact: true });
  await expect(
    info.getByRole('row', { name: `Deadline ${selectedDeadline}`, exact: true }),
  ).toBeVisible();
  await expect(info).toContainText('01:30');
  await page.getByRole('button', { name: 'Save Project', exact: true }).click();
  await page.reload();
  await questionnaireRow(page, 'Scheduled questionnaire').locator('.edit-icon').click();
  await expect(page.locator('[formcontrolname="hasdeadline"] input')).toBeChecked();
  await expect(page.locator('[formcontrolname="haslimit"] input')).toBeChecked();
  await expect(deadline).toHaveValue(selectedDeadline);
  await expect(limit).toHaveValue('01:30');
});
