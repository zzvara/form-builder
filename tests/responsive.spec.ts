import { expect, test } from './helpers/fixtures';
import { addSection, startQuestionnaire } from './helpers/form-builder';

test.describe('phone dashboard', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('card view uses one full-width column and creates both kinds of project', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Card View' }).click();
    const createCards = page.locator('app-card-view .create-card');
    await expect(createCards).toHaveCount(2);
    for (const card of await createCards.all()) {
      expect((await card.boundingBox())?.width).toBeGreaterThan(300);
    }
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);

    await createCards.first().click();
    await expect(page).toHaveURL(/\/new\?type=questionnaire/);
    await expect(page.locator('#switch button')).toHaveText('Questionnaire');
    await page.goBack();
    await expect(createCards).toHaveCount(2);
    await createCards.nth(1).click();
    await expect(page).toHaveURL(/\/new\?type=test/);
    await expect(page.locator('#switch button')).toHaveText('Test');
  });
});

test('repeated section settings open in a drawer once the window is narrow', async ({ page }) => {
  await startQuestionnaire(page, 'Narrow window');
  const section = await addSection(page, 'Repeated Section');
  const trigger = section.locator('.repeated-settings-trigger');
  await expect(trigger).toContainText('1x');

  await page.setViewportSize({ width: 1100, height: 800 });
  await trigger.click();
  const drawer = page.locator('.ant-drawer');
  await expect(drawer).toHaveClass(/ant-drawer-open/);
  await expect(page.locator('.ant-popover')).toHaveCount(0);
  const count = drawer.getByRole('spinbutton');
  await count.fill('5');
  await count.press('Tab');
  await drawer.getByRole('button', { name: 'Close' }).click();
  await expect(drawer).not.toHaveClass(/ant-drawer-open/);
  await expect(trigger).toContainText('5x');

  await trigger.click();
  await expect(drawer).toHaveClass(/ant-drawer-open/);
  await page.setViewportSize({ width: 1400, height: 800 });
  await expect(drawer).not.toHaveClass(/ant-drawer-open/);
});

test.describe('narrow editor', () => {
  test.use({ viewport: { width: 1100, height: 800 } });

  test('an empty form offers a drop area that is big enough to use', async ({ page }) => {
    await page.goto('/');
    await page
      .locator('app-dashboard .view')
      .getByRole('button', { name: /New Questionnaire$/ })
      .first()
      .click();
    await page.locator('#title').fill('Narrow editor');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Search components' })).toBeVisible();

    // Up to 1200px the stacked layout gives the empty list no height, so nothing can be dropped.
    test.fail(
      true,
      'On windows up to 1200px wide the empty form has a zero-height drop area, so the first component cannot be added.',
    );
    await expect
      .poll(async () => (await page.locator('#sectionDropList').boundingBox())?.height ?? 0, {
        timeout: 2000,
      })
      .toBeGreaterThan(100);
  });
});
