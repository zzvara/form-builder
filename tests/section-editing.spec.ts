import type { Locator } from '@playwright/test';
import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addSection,
  moveQuestionToSection,
  renameComponent,
  reopenQuestionnaire,
  saveProject,
  sectionBody,
  startQuestionnaire,
} from './helpers/form-builder';

async function arrangement(first: Locator, second: Locator) {
  const [a, b] = [await first.boundingBox(), await second.boundingBox()];
  if (!a || !b) {
    throw new Error('Both questions must be visible to compare their positions.');
  }
  return Math.abs(a.y - b.y) < Math.abs(a.x - b.x) ? 'side by side' : 'stacked';
}

test('switches a section between vertical and horizontal layouts and keeps the choice', async ({
  page,
}) => {
  const title = 'Section layout';
  await startQuestionnaire(page, title);
  const section = await addSection(page, 'Section');
  const first = await addQuestion(page, 'Single-line Text Field', 'First', sectionBody(section));
  const second = await addQuestion(page, 'Single-line Text Field', 'Second', sectionBody(section));
  await expect(section.locator('app-input-holder')).toHaveCount(2);
  const toggle = section.locator('.section-actions').getByRole('button', {
    name: 'redo',
    exact: true,
  });

  await expect.poll(() => arrangement(first, second)).toBe('stacked');
  await toggle.click();
  await expect.poll(() => arrangement(first, second)).toBe('side by side');

  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect.poll(() => arrangement(first, second)).toBe('side by side');
  await toggle.click();
  await expect.poll(() => arrangement(first, second)).toBe('stacked');
});

test('moves a question between sections unless its section is locked for reordering', async ({
  page,
}) => {
  const title = 'Moving questions';
  await startQuestionnaire(page, title);
  const alpha = await addSection(page, 'Section');
  await renameComponent(alpha, 'alpha');
  const question = await addQuestion(
    page,
    'Single-line Text Field',
    'Traveller',
    sectionBody(alpha),
  );
  await expect(alpha.locator('app-input-holder')).toHaveCount(1);
  const beta = await addSection(page, 'Section', { before: alpha });
  await renameComponent(beta, 'beta');

  const lock = alpha.locator('.section-actions nz-switch button');
  await lock.click();
  await expect(lock).toHaveClass(/ant-switch-checked/);
  await moveQuestionToSection(page, question, beta);
  await expect(alpha.locator('app-input-holder')).toHaveCount(1);
  await expect(beta.locator('app-input-holder')).toHaveCount(0);

  await lock.click();
  await expect(lock).not.toHaveClass(/ant-switch-checked/);
  await moveQuestionToSection(page, question, beta);
  await expect(beta.locator('app-input-holder')).toHaveCount(1);
  await expect(alpha.locator('app-input-holder')).toHaveCount(0);
  await expect(beta.locator('input[name="inputQuestion"]')).toHaveValue('Traveller');

  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect(beta.locator('input[name="inputQuestion"]')).toHaveValue('Traveller');
  await expect(alpha.locator('app-input-holder')).toHaveCount(0);
});
