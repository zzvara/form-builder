import type { Page } from '@playwright/test';
import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addSection,
  addTextQuestion,
  openResults,
  sectionBody,
  startQuestionnaire,
} from './helpers/form-builder';

async function openStatistics(page: Page) {
  await openResults(page);
  await page.getByRole('tab', { name: 'Inputs by Section', exact: true }).click();
  return page.locator('.statistics-list li');
}

test('input statistics count questions by type', async ({ page }) => {
  await startQuestionnaire(page, 'Statistics');
  const number = await addQuestion(page, 'Number Field', 'A number');
  const first = await addQuestion(page, 'Single-line Text Field', 'Text one', { before: number });
  await addQuestion(page, 'Single-line Text Field', 'Text two', { before: first });

  const statistics = await openStatistics(page);
  await expect(statistics).toHaveCount(2);
  await expect
    .poll(async () => (await statistics.allInnerTexts()).sort())
    .toEqual(['Number Field: 1', 'Single-line Text Field: 2']);
});

test('input statistics include the questions inside sections', async ({ page }) => {
  await startQuestionnaire(page, 'Section statistics');
  const section = await addSection(page, 'Section');
  await addQuestion(page, 'Single-line Text Field', 'Nested one', sectionBody(section));
  await addQuestion(page, 'Single-line Text Field', 'Nested two', sectionBody(section));
  await expect(section.locator('app-input-holder')).toHaveCount(2);

  const statistics = await openStatistics(page);
  await expect(statistics.first()).toBeVisible();
  // Palette-created sections look like inputs, so the section itself is counted and its
  // questions are skipped.
  test.fail(
    true,
    'Statistics report "Section: 1" instead of counting the two questions inside the section.',
  );
  await expect(statistics).toHaveText(['Single-line Text Field: 2'], { timeout: 2000 });
});

test('the JSON tabs show the saved project and its history without allowing edits', async ({
  page,
}) => {
  await startQuestionnaire(page, 'JSON view', 'Shown in the JSON');
  await addTextQuestion(page, 'Question for the JSON');
  await openResults(page);

  for (const [tab, expected] of [
    ['Project JSON', ['"title": "JSON view"', '"type": "questionnaire"']],
    ['Project History', ['"versionNum": 1', '"title": "JSON view"']],
  ] as const) {
    await page.getByRole('tab', { name: tab, exact: true }).click();
    const panel = page.getByRole('tabpanel', { name: tab, exact: true });
    for (const text of expected) {
      await expect(panel).toContainText(text);
    }
    await panel.locator('.cm-content').click();
    await page.keyboard.type('edited');
    await expect(panel).not.toContainText('edited');
  }
});
