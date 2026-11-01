import { expect, test } from './helpers/fixtures';
import {
  addTextQuestion,
  importProject,
  questionnaireRow,
  saveProject,
  startQuestionnaire,
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
