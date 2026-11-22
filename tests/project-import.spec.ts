import { readFile } from 'node:fs/promises';
import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addSection,
  addTextQuestion,
  importProject,
  openResults,
  openSettings,
  questionnaireRow,
  renameComponent,
  reopenQuestionnaire,
  saveProject,
  saveSettings,
  sectionBody,
  startQuestionnaire,
  usedComponents,
} from './helpers/form-builder';

function jsonFile(name: string, content: string) {
  return { name, mimeType: 'application/json', buffer: Buffer.from(content) };
}

function projectFile(title: string, description = '<p>Imported description</p>') {
  const project = {
    id: '',
    title,
    description,
    type: 'questionnaire',
    time_checkbox: false,
    deadline_checkbox: false,
    time_limit: 0,
    deadline: '',
    created: '2024-01-01',
    modified: '2024-01-01',
    editList: [],
  };
  return jsonFile('project_handmade.json', JSON.stringify({ project }));
}

const rejectedFiles = [
  { name: 'text that is not valid JSON', file: jsonFile('broken.json', '{ this is not json') },
  { name: 'JSON without a project', file: jsonFile('other.json', '{"hello":"world"}') },
  {
    name: 'a file that is not JSON at all',
    file: { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
  },
];

for (const rejected of rejectedFiles) {
  test(`rejects ${rejected.name} and still accepts a valid import afterwards`, async ({
    page,
    appErrors,
  }) => {
    await page.goto('/');
    await importProject(page, rejected.file);
    // The rejection is reported as an uncaught error today; accept visible feedback as well.
    await expect
      .poll(
        async () =>
          appErrors.length > 0 ||
          (await page.locator('.ant-message, .ant-notification, .ant-alert').count()) > 0,
      )
      .toBe(true);
    appErrors.splice(0);
    await expect(page).toHaveURL('/');
    await expect(page.locator('#title')).toHaveCount(0);
    await expect(page.locator('app-list-view').first()).toContainText(
      "You don't have any questionnaires yet.",
    );

    await importProject(page, projectFile('Imported after an error'));
    await expect(page).toHaveURL(/\/new/);
    await expect(page.locator('#title')).toHaveValue('Imported after an error');
    await expect(page.locator('app-info-page .ql-editor')).toHaveText('Imported description');
  });
}

test('importing after visiting the results page fills the new form', async ({ page }) => {
  await startQuestionnaire(page, 'First project');
  await addTextQuestion(page, 'A question');
  await saveProject(page);

  await importProject(page, projectFile('Imported in the same session'));
  await expect(page).toHaveURL(/\/new/);
  await expect(page.locator('#title')).toBeVisible();
  // Reaching the results page seems to break later imports: its teardown completes the JSON
  // service that hands imported files to the info page.
  test.fail(
    true,
    'After the results page was visited, an import opens an empty form instead of the file.',
  );
  await expect(page.locator('#title')).toHaveValue('Imported in the same session', {
    timeout: 2000,
  });
});

test('round-trips sections, repetition, a condition and field settings through an exported file', async ({
  page,
  browser,
}, testInfo) => {
  test.slow();
  const title = 'Portable structured questionnaire';
  await startQuestionnaire(page, title);
  const repeated = await addSection(page, 'Repeated Section');
  await renameComponent(repeated, 'guestRepeats');
  await repeated.locator('.repeated-settings-trigger').click();
  const repeatSettings = page.locator('.ant-popover .repeated-settings-panel');
  await repeatSettings.locator('nz-select').click();
  await page.locator('.ant-select-dropdown').getByTitle('Given number', { exact: true }).click();
  await repeatSettings.getByRole('spinbutton').fill('3');
  await page.getByRole('textbox', { name: 'Search components' }).click();
  await expect(repeated.locator('.repeated-settings-trigger')).toContainText('3x');

  const question = await addQuestion(
    page,
    'Single-line Text Field',
    'Guest name',
    sectionBody(repeated),
  );
  await renameComponent(question, 'guestName');
  await expect(repeated.locator('app-input-holder')).toHaveCount(1);
  const source = await addSection(page, 'Section', { before: repeated });
  await renameComponent(source, 'guestDetails');
  const count = await addQuestion(page, 'Number Field', 'How many guests?', sectionBody(source));
  await renameComponent(count, 'guestCount');
  await expect(source.locator('app-input-holder')).toHaveCount(1);
  await expect(repeated.locator('app-input-holder')).toHaveCount(1);
  await expect(usedComponents(page).locator('.component-title')).toHaveText([
    'guestDetails',
    'guestRepeats',
  ]);
  const dialog = await openSettings(page, question);
  await dialog.locator('input[formcontrolname="placeholderValue"]').fill('Enter a guest name');
  await dialog.locator('[formcontrolname="maxLength"] input').check();
  await dialog.locator('[formcontrolname="maxLengthNumber"] input').fill('12');
  await dialog.locator('[formcontrolname="showCharacterCounter"] input').check();
  await dialog.getByRole('checkbox', { name: 'Enable', exact: true }).check();
  await dialog.getByText('Add variables', { exact: true }).click();
  const picker = page.getByRole('dialog').last();
  await picker
    .locator('.ant-transfer-list')
    .first()
    .locator('.ant-transfer-list-content-item')
    .filter({ hasText: 'guestCount' })
    .getByRole('checkbox')
    .check();
  await picker.locator('.ant-transfer-operation button:not([disabled])').first().click();
  await picker.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(dialog.locator('nz-tag').filter({ hasText: 'guestCount' })).toBeVisible();
  await dialog.locator('.cm-content').click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('return guestCount >= 1;');
  await dialog.getByText('Code', { exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();
  await saveSettings(dialog);
  await expect(question.locator('.input-preview-container input')).toHaveAttribute(
    'placeholder',
    'Enter a guest name',
  );
  await expect(question.locator('.input-preview-container input')).toHaveAttribute(
    'maxlength',
    '12',
  );
  await expect(question.getByRole('img', { name: 'code', exact: true })).toBeVisible();

  await openResults(page);
  await page.getByRole('button', { name: 'Download Project', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  const download = await downloadPromise;
  const file = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(file);
  const exported = JSON.parse(await readFile(file, 'utf8'));
  expect(exported.project.editList).toHaveLength(2);
  expect(exported.project.editList[0].data).toMatchObject({
    type: 'SectionComponent',
    customTitle: 'guestDetails',
    sectionInputs: [{ customTitle: 'guestCount', data: { questionValue: 'How many guests?' } }],
  });
  expect(exported.project.editList[1].data).toMatchObject({
    type: 'RepeatedSectionComponent',
    customTitle: 'guestRepeats',
    repeatByOther: false,
    repeatTimes: 3,
    sectionInputs: [
      {
        customTitle: 'guestName',
        data: {
          questionValue: 'Guest name',
          placeholderValue: 'Enter a guest name',
          maxLength: true,
          maxLengthNumber: 12,
          showCharacterCounter: true,
        },
        codeEditor: {
          enabled: true,
          data: { code: 'return guestCount >= 1;', variables: [{ title: 'guestCount' }] },
        },
      },
    ],
  });
  expect(
    exported.project.editList[1].data.sectionInputs[0].codeEditor.data.variables[0].elementId,
  ).toBe(exported.project.editList[0].data.sectionInputs[0].data.id);

  const importContext = await browser.newContext({ baseURL: testInfo.project.use.baseURL });
  try {
    const importedPage = await importContext.newPage();
    const importErrors: string[] = [];
    importedPage.on('pageerror', (error) => importErrors.push(error.message));
    importedPage.on('console', (message) => {
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
        importErrors.push(message.text());
      }
    });
    await importedPage.goto('/');
    await importProject(importedPage, file);
    await expect(importedPage.locator('#title')).toHaveValue(title);
    await importedPage.getByRole('button', { name: 'Next', exact: true }).click();
    const importedSource = importedPage.locator('#sectionDropList .section-card').filter({
      has: importedPage.locator('app-edit-name').filter({ hasText: 'guestDetails' }),
    });
    const importedRepeat = importedPage.locator('#sectionDropList .section-card').filter({
      has: importedPage.locator('app-edit-name').filter({ hasText: 'guestRepeats' }),
    });
    await expect(importedSource.locator('input[name="inputQuestion"]')).toHaveValue(
      'How many guests?',
    );
    await expect(importedSource.locator('app-input-holder app-edit-name')).toHaveText('guestCount');
    await expect(importedRepeat.locator('.repeated-settings-trigger')).toContainText('3x');
    const importedQuestion = importedRepeat.locator('app-input-holder');
    await expect(importedQuestion.locator('input[name="inputQuestion"]')).toHaveValue('Guest name');
    await expect(importedQuestion.locator('.input-preview-container input')).toHaveAttribute(
      'placeholder',
      'Enter a guest name',
    );
    await expect(importedQuestion.locator('.input-preview-container input')).toHaveAttribute(
      'maxlength',
      '12',
    );
    await expect(importedQuestion.locator('.input-preview-container')).toContainText('0/12');
    const importedSettings = await openSettings(importedPage, importedQuestion);
    await expect(importedSettings.getByRole('checkbox', { name: 'Enable' })).toBeChecked();
    await expect(
      importedSettings.locator('nz-tag').filter({ hasText: 'guestCount' }),
    ).toBeVisible();
    await expect(importedSettings.locator('.cm-content')).toHaveText('return guestCount >= 1;');
    await importedSettings.getByRole('button', { name: 'Cancel', exact: true }).click();
    await saveProject(importedPage);
    await reopenQuestionnaire(importedPage, title);
    await expect(importedRepeat.locator('.repeated-settings-trigger')).toContainText('3x');
    await expect(importedQuestion.locator('.input-preview-container input')).toHaveAttribute(
      'placeholder',
      'Enter a guest name',
    );
    await expect(importedQuestion.locator('.input-preview-container input')).toHaveAttribute(
      'maxlength',
      '12',
    );
    await expect(importedQuestion.getByRole('img', { name: 'code', exact: true })).toBeVisible();
    const reopenedSettings = await openSettings(importedPage, importedQuestion);
    await expect(reopenedSettings.getByRole('checkbox', { name: 'Enable' })).toBeChecked();
    await expect(
      reopenedSettings.locator('nz-tag').filter({ hasText: 'guestCount' }),
    ).toBeVisible();
    await expect(reopenedSettings.locator('.cm-content')).toHaveText('return guestCount >= 1;');
    expect(importErrors, 'The imported project reported unexpected errors').toEqual([]);
  } finally {
    await importContext.close();
  }
});

test('an imported description cannot run script on the dashboard', async ({ page }) => {
  const title = 'Imported with markup';
  const markup = '<p>Hello</p><img src="missing.png" onerror="window.__scriptRan = true">';
  await page.goto('/');
  await importProject(page, projectFile(title, markup));
  await expect(page.locator('#title')).toHaveValue(title);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('#sectionDropList')).toBeVisible();
  await page.getByRole('button', { name: 'home', exact: true }).click();
  const row = questionnaireRow(page, title);
  await expect(row).toBeVisible();
  // A broken image has finished (and reported its error) once it counts as complete.
  await expect
    .poll(() =>
      row.evaluate((element) => [...element.querySelectorAll('img')].every((img) => img.complete)),
    )
    .toBe(true);

  // The description is stored as imported and rendered through bypassSecurityTrustHtml.
  test.fail(
    true,
    'An imported description keeps its onerror handler and runs it on the dashboard (stored XSS).',
  );
  expect(await page.evaluate(() => (window as { __scriptRan?: boolean }).__scriptRan)).toBe(
    undefined,
  );
});
