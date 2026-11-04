import { test, expect } from '@playwright/test';

test.describe('Questionnaire Creation Flow', () => {
  test.setTimeout(120000);

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

    const dropZone = page.locator('#sectionDropList');
    await expect(dropZone).toBeVisible();

    const componentToDrag = page.locator('app-sidebar .cdk-drag').first();
    await expect(componentToDrag).toBeVisible();
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

    const questionInput = page.locator('app-input-holder input[name="inputQuestion"]').first();
    await questionInput.fill('Test Question');

    await page.locator('button.next-button').click();
    await expect(page.locator('nz-descriptions')).toBeVisible();

    await page.locator('button.saveBtn').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });
  });
});
