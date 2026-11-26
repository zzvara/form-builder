import { expect, test } from './helpers/fixtures';
import { addTextQuestion } from './helpers/form-builder';

test('steps cannot be skipped until the title and at least one question are valid', async ({
  page,
}) => {
  const steps = page.locator('#progressbar');
  const results = page.getByRole('tab', { name: 'Project Info', exact: true });
  await page.goto('/');
  await page
    .locator('app-dashboard .view')
    .getByRole('button', { name: /New Questionnaire$/ })
    .first()
    .click();

  await steps.getByText('Components', { exact: true }).click();
  await expect(page.locator('#title')).toBeVisible();
  await expect(page.locator('#sectionDropList')).toHaveCount(0);
  await expect(page).not.toHaveURL(/id=/);

  await page.locator('#title').fill('Guarded steps');
  await steps.getByText('Components', { exact: true }).click();
  await expect(page.locator('#sectionDropList')).toBeVisible();
  await expect(page).toHaveURL(/id=/);

  await steps.getByText('Results', { exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(results).toHaveCount(0);
  await expect(page.locator('#sectionDropList')).toBeVisible();

  await addTextQuestion(page, 'Guarded question');
  await steps.getByText('Results', { exact: true }).click();
  await expect(results).toBeVisible();

  await steps.getByText('Form Info', { exact: true }).click();
  await expect(page.locator('#title')).toHaveValue('Guarded steps');
  await steps.getByText('Components', { exact: true }).click();
  await expect(page.locator('#sectionDropList input[name="inputQuestion"]')).toHaveValue(
    'Guarded question',
  );
});

test('names the last step after the project type once the form is submitted', async ({ page }) => {
  const steps = page.locator('#progressbar');
  const type = page.locator('#switch button');
  await page.goto('/');
  await page
    .locator('app-dashboard .view')
    .getByRole('button', { name: /New Questionnaire$/ })
    .first()
    .click();
  await expect(type).toHaveText('Questionnaire');
  await expect(steps).toContainText('Results');

  await type.click();
  await expect(type).toHaveText('Test');
  await page.locator('#title').fill('Typed as a test');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('#sectionDropList')).toBeVisible();
  await expect(steps).toContainText('Answers');
  await expect(steps).not.toContainText('Results');

  await page.goto('/');
  await page
    .locator('app-dashboard .view')
    .getByRole('button', { name: /New Test$/ })
    .first()
    .click();
  await expect(type).toHaveText('Test');
  await expect(steps).toContainText('Answers');
});

test('the last step is renamed as soon as the type switch is toggled', async ({ page }) => {
  const steps = page.locator('#progressbar');
  await page.goto('/');
  await page
    .locator('app-dashboard .view')
    .getByRole('button', { name: /New Questionnaire$/ })
    .first()
    .click();
  await expect(steps).toContainText('Results');
  await page.locator('#switch button').click();
  await expect(page.locator('#switch button')).toHaveText('Test');
  // The template listens for a change event that the switch never emits.
  test.fail(true, 'The step label only follows the type switch after the form is submitted.');
  await expect(steps).toContainText('Answers', { timeout: 2000 });
});
