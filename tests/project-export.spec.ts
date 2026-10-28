import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import {
  addTextQuestion,
  openResults,
  questionnaireRow,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

for (const withHistory of [false, true]) {
  test(`exports ${withHistory ? 'with history' : 'the project'} and imports the downloaded file into a fresh browser context`, async ({
    page,
    browser,
  }, testInfo) => {
    const title = 'Portable questionnaire';
    const description = 'Description included in the exported file';
    const question = 'What should survive an export?';
    await startQuestionnaire(page, title, description);
    await addTextQuestion(page, question);
    await openResults(page);

    const info = page.getByRole('tabpanel', { name: 'Project Info', exact: true });
    await expect(info.getByRole('cell', { name: title, exact: true })).toBeVisible();
    await expect(info).toContainText(description);
    await page.getByRole('tab', { name: 'Inputs by Section', exact: true }).click();
    await expect(page.locator('.statistics-list')).toHaveText('Single-line Text Field: 1');

    const downloadButton = page.getByRole('button', {
      name: withHistory ? 'Download with History' : 'Download Project',
      exact: true,
    });
    await downloadButton.click();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(
      withHistory ? /^project_.+_history\.json$/ : /^project_.+\.json$/,
    );
    const file = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(file);
    const exported = JSON.parse(await readFile(file, 'utf8'));
    expect(exported.project).toMatchObject({ title, type: 'questionnaire' });
    expect(exported.project.description).toContain(description);
    expect(exported.project.editList).toHaveLength(1);
    expect(exported.project.editList[0].data.data.questionValue).toBe(question);
    if (withHistory) {
      expect(exported.history.length).toBeGreaterThan(0);
    } else {
      expect(exported).not.toHaveProperty('history');
    }

    // Import in an isolated context so existing local storage cannot hide a failed import.
    const importContext = await browser.newContext({ baseURL: testInfo.project.use.baseURL });
    try {
      const importedPage = await importContext.newPage();
      await importedPage.goto('/');
      await importedPage.locator('app-header input[type="file"]').setInputFiles(file);
      await expect(importedPage.locator('#title')).toHaveValue(title);
      await expect(importedPage.locator('app-info-page .ql-editor')).toHaveText(description);
      await importedPage.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(
        importedPage.locator('#sectionDropList input[name="inputQuestion"]'),
      ).toHaveValue(question);
      await saveProject(importedPage);
      await importedPage.reload();
      await expect(questionnaireRow(importedPage, title)).toBeVisible();
    } finally {
      await importContext.close();
    }
  });
}
