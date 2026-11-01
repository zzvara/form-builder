import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addTextQuestion,
  moveUsedComponent,
  renameComponent,
  reopenQuestionnaire,
  saveProject,
  startQuestionnaire,
  usedComponent,
  usedComponents,
} from './helpers/form-builder';

test('lists questions in form order and reordering the list reorders the form', async ({
  page,
}) => {
  test.slow();
  const title = 'Used components order';
  await startQuestionnaire(page, title);
  const third = await addTextQuestion(page, 'Third question');
  const second = await addQuestion(page, 'Single-line Text Field', 'Second question', {
    before: third,
  });
  const first = await addQuestion(page, 'Single-line Text Field', 'First question', {
    before: second,
  });
  await renameComponent(first, 'alpha');
  await renameComponent(second, 'beta');
  await renameComponent(third, 'gamma');

  const formOrder = page.locator('#sectionDropList > app-input-holder app-edit-name');
  const listOrder = usedComponents(page).locator('.component-title');
  await expect(formOrder).toHaveText(['alpha', 'beta', 'gamma']);
  await expect(listOrder).toHaveText(['alpha', 'beta', 'gamma']);

  await moveUsedComponent(page, 'alpha', 'beta', 'after');
  await expect(formOrder).toHaveText(['beta', 'alpha', 'gamma']);
  await expect(listOrder).toHaveText(['beta', 'alpha', 'gamma']);
  await moveUsedComponent(page, 'gamma', 'beta', 'before');
  await expect(formOrder).toHaveText(['gamma', 'beta', 'alpha']);
  await expect(listOrder).toHaveText(['gamma', 'beta', 'alpha']);

  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect(formOrder).toHaveText(['gamma', 'beta', 'alpha']);
  await expect(listOrder).toHaveText(['gamma', 'beta', 'alpha']);

  // The last question starts below the fold; its list entry scrolls it into view.
  await expect(first).not.toBeInViewport();
  const entry = usedComponent(page, 'alpha');
  await entry.hover();
  await entry.getByRole('button', { name: 'Scroll to component' }).click();
  await expect(first).toBeInViewport({ ratio: 0.5 });

  await second.getByRole('button', { name: 'delete', exact: true }).click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(listOrder).toHaveText(['gamma', 'alpha']);
});

test('marks drafts and incomplete active questions in the used components list', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Used component states');
  const holder = await addTextQuestion(page, 'Panel question');
  const entry = usedComponents(page).locator('.component-item');
  const question = holder.locator('input[name="inputQuestion"]');
  const warning = entry.getByRole('img', { name: 'warning' });

  await expect(entry).toHaveClass(/draft-component/);
  await question.clear();
  await expect(entry).not.toHaveClass(/invalid-component/);

  await holder.getByRole('button', { name: 'Draft', exact: true }).click();
  await expect(entry).not.toHaveClass(/draft-component/);
  await expect(entry).toHaveClass(/invalid-component/);
  await expect(warning).toBeVisible();

  await question.fill('Now complete');
  await expect(entry).not.toHaveClass(/invalid-component/);
  await expect(warning).toHaveCount(0);
});
