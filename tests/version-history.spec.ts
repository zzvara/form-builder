import type { Page } from '@playwright/test';
import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addTextQuestion,
  reopenQuestionnaire,
  saveProject,
  startQuestionnaire,
} from './helpers/form-builder';

function changeSummary(page: Page) {
  const dialog = page.getByRole('dialog');
  // Only the section that actually lists inputs; unchanged properties show "none" entries only.
  const changes = dialog.locator('.cs-details').filter({ has: page.locator('li:not(.cs-none)') });
  const list = (heading: string) =>
    changes
      .locator('.cs-subsection')
      .filter({ has: page.getByRole('heading', { name: heading, exact: true }) })
      .locator('li');
  return { dialog, added: list('Added Inputs'), removed: list('Removed Inputs') };
}

async function openChangeSummary(page: Page, version: number) {
  await page.locator('.version-selector').click();
  await page
    .getByRole('menuitem')
    .filter({ hasText: `VERSION ${version}` })
    .getByRole('button', { name: 'diff', exact: true })
    .click();
}

test('version buttons step through saved versions and the summary lists what changed', async ({
  page,
}) => {
  const title = 'Version walk';
  await startQuestionnaire(page, title);
  const original = await addTextQuestion(page, 'Original question');
  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await original.getByRole('button', { name: 'delete', exact: true }).click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(original).toHaveCount(0);
  const replacement = await addQuestion(page, 'Number Field', 'Replacement question');
  await saveProject(page);
  await reopenQuestionnaire(page, title);

  const selector = page.locator('.version-selector');
  const previous = page.getByRole('button', { name: 'Previous Version', exact: true });
  const next = page.getByRole('button', { name: 'Next Version', exact: true });
  await expect(selector).toContainText('VERSION 3');
  await expect(next).toBeDisabled();
  await previous.click();
  await expect(selector).toContainText('VERSION 2');
  await expect(original.locator('input[name="inputQuestion"]')).toHaveValue('Original question');
  await expect(replacement).toHaveCount(0);
  await expect(next).toBeEnabled();
  await previous.click();
  await expect(selector).toContainText('VERSION 1');
  await expect(page.locator('#sectionDropList app-input-holder')).toHaveCount(0);
  await expect(previous).toBeDisabled();
  await next.click();
  await next.click();
  await expect(selector).toContainText('VERSION 3');
  await expect(replacement.locator('input[name="inputQuestion"]')).toHaveValue(
    'Replacement question',
  );
  await expect(original).toHaveCount(0);

  await selector.click();
  const diffButton = (version: number) =>
    page
      .getByRole('menuitem')
      .filter({ hasText: `VERSION ${version}` })
      .getByRole('button', { name: 'diff', exact: true });
  await expect(page.getByRole('menuitem')).toHaveCount(3);
  await expect(diffButton(1)).toHaveCount(0);
  await expect(diffButton(2)).toHaveCount(1);
  await diffButton(3).click();
  const { dialog, added, removed } = changeSummary(page);
  await expect(dialog).toContainText('Changes made since version 2');
  await expect(added).toHaveCount(1);
  await expect(removed).toHaveCount(1);
});

test('the change summary names added inputs in plain language', async ({ page }) => {
  const title = 'Summary wording';
  await startQuestionnaire(page, title);
  await addQuestion(page, 'Number Field', 'Counted question');
  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await openChangeSummary(page, 2);
  const { added } = changeSummary(page);
  await expect(added).toHaveCount(1);
  // The template prints the component's translation key instead of its translated label.
  test.fail(true, 'The change summary shows COMPONENTS.NUMBER_FIELD.TITLE instead of a label.');
  await expect(added).not.toHaveText(/^\s*[A-Z][A-Z0-9_]*(\.[A-Z0-9_]+)+\s*$/, { timeout: 2000 });
});
