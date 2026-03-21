import { test, expect } from '@playwright/test';

test.describe('Questionnaire Creation Flow', () => {

  test.setTimeout(100000);

  test('should create a new Questionnaire successfully', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /New Questionnaire/i }).click();
    await page.waitForTimeout(10000);

    const uniqueTitle = 'Playwright test';
    await page.locator('#title').fill(uniqueTitle);
    await page.locator('.ql-editor').fill('This is an automated test description.');
    await page.waitForTimeout(10000);
    await page.locator('#btn').click();

    const dropZone = page.locator('#sectionDropList');
    await expect(dropZone).toBeVisible();

    await page.waitForTimeout(10000);

    const componentToDrag = page.locator('app-sidebar .cdk-drag').first();
    const sourceBox = await componentToDrag.boundingBox();
    const targetBox = await dropZone.boundingBox();

    if (sourceBox && targetBox) {
      await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(sourceBox.x + sourceBox.width / 2 + 10, sourceBox.y + sourceBox.height / 2 + 10);
      await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + (targetBox.height / 4), { steps: 20 });
      await page.mouse.up();
    }

    await expect(page.locator('app-input-holder').first()).toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(10000);

    const questionInput = page.locator('app-input-holder input[name="inputQuestion"]').first();
    await questionInput.fill('Test Question');

    await page.waitForTimeout(10000);

    await page.locator('button.next-button').click();
    await expect(page.locator('nz-descriptions')).toBeVisible();

    await page.waitForTimeout(20000);

    await page.locator('button.saveBtn').click();

    await expect(page).toHaveURL('http://localhost:4200/');
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(10000);
  });
});
