import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addSection,
  moveQuestionToSection,
  moveQuestionToTopLevel,
  renameComponent,
  reopenQuestionnaire,
  saveProject,
  sectionBody,
  startQuestionnaire,
} from './helpers/form-builder';

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

test('moves a question from a section to the top level and keeps it after reopening', async ({
  page,
}) => {
  const title = 'Move question out of section';
  await startQuestionnaire(page, title);
  const anchor = await addQuestion(page, 'Single-line Text Field', 'Top-level anchor');
  const section = await addSection(page, 'Section');
  const question = await addQuestion(
    page,
    'Single-line Text Field',
    'Moved to top level',
    sectionBody(section),
  );
  await expect(section.locator('app-input-holder')).toHaveCount(1);
  await expect(page.locator('#sectionDropList > app-input-holder')).toHaveCount(1);

  await moveQuestionToTopLevel(page, question, anchor);
  await expect(section.locator('app-input-holder')).toHaveCount(0);
  const topLevel = page.locator('#sectionDropList > app-input-holder');
  await expect(topLevel).toHaveCount(2);
  await expect(question.locator('input[name="inputQuestion"]')).toHaveValue('Moved to top level');

  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect(section.locator('app-input-holder')).toHaveCount(0);
  await expect(topLevel).toHaveCount(2);
  await expect(question.locator('input[name="inputQuestion"]')).toHaveValue('Moved to top level');
});

for (const hasExistingQuestion of [false, true]) {
  const state = hasExistingQuestion ? 'a non-empty' : 'an empty';
  test(`characterizes moving a top-level question into ${state} locked section`, async ({
    page,
  }) => {
    const title = `Locked ${state} destination`;
    await startQuestionnaire(page, title);
    const question = await addQuestion(page, 'Single-line Text Field', 'Incoming question');
    const section = await addSection(page, 'Section');
    if (hasExistingQuestion) {
      await addQuestion(page, 'Single-line Text Field', 'Existing question', sectionBody(section));
    }
    const lock = section.locator('.section-actions nz-switch button');
    await lock.click();
    await expect(lock).toHaveClass(/ant-switch-checked/);
    await expect(page.locator('#sectionDropList > app-input-holder')).toHaveCount(1);
    await expect(section.locator('app-input-holder')).toHaveCount(hasExistingQuestion ? 1 : 0);

    await moveQuestionToSection(page, question, section);
    await expect(section.locator('app-input-holder')).toHaveCount(hasExistingQuestion ? 2 : 1);
    await expect(question.locator('input[name="inputQuestion"]')).toHaveValue('Incoming question');
    await expect(page.locator('#sectionDropList > app-input-holder')).toHaveCount(0);

    await saveProject(page);
    await reopenQuestionnaire(page, title);
    await expect(section.locator('app-input-holder')).toHaveCount(hasExistingQuestion ? 2 : 1);
    await expect(lock).toHaveClass(/ant-switch-checked/);
    await expect(page.locator('#sectionDropList > app-input-holder')).toHaveCount(0);
    await expect(question.locator('input[name="inputQuestion"]')).toHaveValue('Incoming question');
  });
}
