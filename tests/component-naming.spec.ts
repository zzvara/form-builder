import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addSection,
  renameComponent,
  reopenQuestionnaire,
  saveProject,
  sectionBody,
  startQuestionnaire,
  tooltip,
  usedComponents,
} from './helpers/form-builder';

const invalidName = 'The provided name is not a valid JavaScript variable name!';
const duplicateName = 'This name is already taken! Please choose another.';

test('rejects invalid, empty, and duplicate names and keeps the accepted ones after reopening', async ({
  page,
}) => {
  const title = 'Naming rules';
  await startQuestionnaire(page, title);
  const guests = await addQuestion(page, 'Number Field', 'How many guests?');
  const guestsTitle = guests.locator('app-edit-name');
  const name = guestsTitle.getByRole('textbox');
  const error = guestsTitle.getByRole('img', { name: 'exclamation-circle' });
  const save = guestsTitle.getByRole('img', { name: 'save', exact: true });

  async function expectError(message: string) {
    await error.hover();
    await expect(tooltip(page)).toHaveText(message);
    await page.mouse.move(0, 0);
    await expect(tooltip(page)).toHaveCount(0);
  }

  await guestsTitle.getByRole('img', { name: 'edit', exact: true }).click();
  for (const rejected of ['1abc', 'my var', 'class']) {
    await name.fill(rejected);
    await expectError(invalidName);
  }
  await name.fill('ok_name$1');
  await expect(error).toHaveCount(0);

  await name.fill('');
  await save.click();
  await expect(name).toBeVisible();
  await expectError('Providing a unique name is required!');

  await name.fill('guestCount');
  await save.click();
  await expect(name).toHaveCount(0);
  await expect(guestsTitle).toHaveText('guestCount');

  const total = await addQuestion(page, 'Number Field', 'How many in total?');
  const totalTitle = total.locator('app-edit-name');
  await totalTitle.getByRole('img', { name: 'edit', exact: true }).click();
  await totalTitle.getByRole('textbox').fill('guestCount');
  await totalTitle.getByRole('img', { name: 'exclamation-circle' }).hover();
  await expect(tooltip(page)).toHaveText(duplicateName);
  await totalTitle.getByRole('img', { name: 'save', exact: true }).click();
  await expect(totalTitle.getByRole('textbox')).toBeVisible();
  await totalTitle.getByRole('img', { name: 'close', exact: true }).click();
  await expect(totalTitle.getByRole('textbox')).toHaveCount(0);
  await expect(totalTitle).toHaveText('Number Field');
  await renameComponent(total, 'guestTotal');

  await expect(usedComponents(page)).toContainText('guestCount');
  await expect(usedComponents(page)).toContainText('guestTotal');
  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect(guestsTitle).toHaveText('guestCount');
  await expect(totalTitle).toHaveText('guestTotal');
});

test('rejects a name that is already used by a question inside a section', async ({ page }) => {
  await startQuestionnaire(page, 'Names in sections');
  const section = await addSection(page, 'Section');
  const first = await addQuestion(page, 'Number Field', 'First nested', sectionBody(section));
  const second = await addQuestion(page, 'Number Field', 'Second nested', sectionBody(section));
  await expect(section.locator('app-input-holder')).toHaveCount(2);
  await renameComponent(first, 'duplicate');

  const title = second.locator('app-edit-name');
  await title.getByRole('img', { name: 'edit', exact: true }).click();
  await title.getByRole('textbox').fill('duplicate');
  // Only names of top-level components are compared, so the clash inside the section is missed.
  test.fail(
    true,
    'Name uniqueness ignores questions inside sections, so duplicate variable names are accepted.',
  );
  await expect(title.getByRole('img', { name: 'exclamation-circle' })).toBeVisible({
    timeout: 2000,
  });
});
