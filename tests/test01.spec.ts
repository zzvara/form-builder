import { test, expect, type Page } from '@playwright/test';

async function addTextQuestion(page: Page, question: string) {
  const componentToDrag = page.locator('app-sidebar .cdk-drag').first();
  const dropZone = page.locator('#sectionDropList');
  await expect(componentToDrag).toBeVisible();
  await expect(dropZone).toBeVisible();

  const sourceBox = await componentToDrag.boundingBox();
  const targetBox = await dropZone.boundingBox();

  if (sourceBox === null) {
    throw new Error('Could not determine the drag source position.');
  }
  if (targetBox === null) {
    throw new Error('Could not determine the drop target position.');
  }

  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2 + 10,
    sourceBox.y + sourceBox.height / 2 + 10,
  );
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 4, {
    steps: 20,
  });
  await page.mouse.up();

  await expect(page.locator('app-input-holder').first()).toBeVisible({ timeout: 10000 });
  await page.locator('app-input-holder input[name="inputQuestion"]').first().fill(question);
}

test.describe('Questionnaire Creation Flow', () => {
  test.setTimeout(120000);

  test('should require a title before continuing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'New Questionnaire', exact: true }).click();

    await page.locator('#btn').click();

    await expect(page.getByText('Title is required', { exact: true })).toBeVisible();
    await expect(page.locator('#title')).toBeVisible();
  });

  test('should create a new Questionnaire successfully', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', {
        name: 'New Questionnaire',
        exact: true,
      })
      .click();

    const uniqueTitle = 'Playwright test';
    await expect(page.locator('#title')).toBeVisible();
    await page.locator('#title').fill(uniqueTitle);
    await page.locator('.ql-editor').fill('This is an automated test description.');
    await page.locator('#btn').click();

    await addTextQuestion(page, 'Test Question');

    await page.locator('button.next-button').click();
    await expect(page.locator('nz-descriptions')).toBeVisible();

    await page.locator('button.saveBtn').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });
  });

  test('should create, edit, and delete a test project', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'New Test', exact: true }).click();

    const title = `Playwright test project ${Date.now()}`;
    await expect(page.locator('#title')).toBeVisible();
    await page.locator('#title').fill(title);
    await page.locator('#btn').click();

    await expect(page.locator('#sectionDropList')).toBeVisible();
    await addTextQuestion(page, 'Test project question');
    await page.locator('button.next-button').click();
    await expect(page.locator('nz-descriptions')).toBeVisible();
    await page.locator('button.saveBtn').click();

    await expect(page).toHaveURL('/');
    const testTable = page.getByRole('table').nth(1);
    let projectRow = testTable.getByRole('row').filter({ hasText: title });
    await expect(projectRow).toBeVisible();

    await projectRow.locator('.edit-icon').click();
    const updatedTitle = `${title} updated`;
    await expect(page.locator('#title')).toHaveValue(title);
    await page.locator('#title').fill(updatedTitle);
    await page.locator('#btn').click();
    await expect(page.locator('#sectionDropList')).toBeVisible();
    await page.locator('button.next-button').click();
    await expect(page.locator('nz-descriptions')).toBeVisible();
    await page.locator('button.saveBtn').click();

    await expect(page).toHaveURL('/');
    projectRow = testTable.getByRole('row').filter({ hasText: updatedTitle });
    await expect(projectRow).toBeVisible();

    await projectRow.locator('.delete-icon').click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await expect(projectRow).toHaveCount(0);
  });

  test('should persist the selected dashboard layout after reload', async ({ page }) => {
    await page.goto('/');

    const viewToggle = page.locator('.toolbar [role="button"]');
    await viewToggle.click();
    await expect(page.locator('app-card-view')).toHaveCount(2);

    await page.reload();
    await expect(page.locator('app-card-view')).toHaveCount(2);

    await viewToggle.click();
    await expect(page.locator('app-list-view')).toHaveCount(2);
  });
});
