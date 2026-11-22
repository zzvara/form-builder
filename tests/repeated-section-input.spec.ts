import type { Locator, Page } from '@playwright/test';
import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  addSection,
  moveUsedComponent,
  renameComponent,
  reopenQuestionnaire,
  saveProject,
  sectionBody,
  startQuestionnaire,
  usedComponent,
  usedComponents,
} from './helpers/form-builder';

async function openRepeatSettings(page: Page, section: Locator) {
  await section.locator('.repeated-settings-trigger').click();
  return page.locator('.ant-popover .repeated-settings-panel');
}

async function repeatByAnotherInput(page: Page, section: Locator) {
  const settings = await openRepeatSettings(page, section);
  await settings.locator('nz-select').click();
  await page.locator('.ant-select-dropdown').getByTitle('Another input', { exact: true }).click();
  await expect(settings.locator('nz-select')).toHaveCount(2);
  return settings;
}

async function closeRepeatSettings(page: Page) {
  await page.getByRole('textbox', { name: 'Search components' }).click();
}

const openDropdown = (page: Page) =>
  page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');

async function chooseReference(page: Page, section: Locator, name: string) {
  const settings = await repeatByAnotherInput(page, section);
  await settings.locator('nz-select').nth(1).click();
  await openDropdown(page).getByTitle(name, { exact: true }).click();
  await closeRepeatSettings(page);
}

async function expectNextToBeBlocked(page: Page) {
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Project Info', exact: true })).toHaveCount(0);
  await expect(page.locator('#sectionDropList')).toBeVisible();
}

test('repeats a section by a named number or checkbox input placed before it', async ({ page }) => {
  test.slow();
  const title = 'Repeat by input';
  await startQuestionnaire(page, title);
  // Built bottom-up: each question is dropped in front of the previous one.
  const unnamed = await addQuestion(page, 'Number Field', 'Unnamed number');
  const event = await addQuestion(page, 'Single-line Text Field', 'Event name', {
    before: unnamed,
  });
  const extras = await addQuestion(page, 'Checkbox group', 'Which extras?', { before: event });
  const guests = await addQuestion(page, 'Number Field', 'How many guests?', { before: extras });
  await renameComponent(guests, 'guestCount');
  await renameComponent(extras, 'extras');
  await renameComponent(event, 'eventName');
  // Neither a named text field nor an unnamed number field can drive the repetition.
  const section = await addSection(page, 'Repeated Section');
  await moveUsedComponent(page, 'Section', 'Number Field', 'after');
  await expect(usedComponents(page).locator('.component-title')).toHaveText([
    'guestCount',
    'extras',
    'eventName',
    'Number Field',
    'Section',
  ]);

  const trigger = section.locator('.repeated-settings-trigger');
  const settings = await repeatByAnotherInput(page, section);
  await expect(trigger).toContainText('Unspecified');
  await expect(trigger).toHaveClass(/ant-btn-dangerous/);
  await closeRepeatSettings(page);
  await expectNextToBeBlocked(page);

  await openRepeatSettings(page, section);
  await settings.locator('nz-select').nth(1).click();
  await expect(openDropdown(page).locator('.ant-select-item-option-content')).toHaveText([
    'guestCount',
    'extras',
  ]);
  await openDropdown(page).getByTitle('guestCount', { exact: true }).click();
  await closeRepeatSettings(page);
  await expect(trigger).toContainText('guestCount');
  await expect(trigger).not.toHaveClass(/ant-btn-dangerous/);

  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect(trigger).toContainText('guestCount');
  await expect(trigger).not.toHaveClass(/ant-btn-dangerous/);
});

test('flags a repeated section when its referenced input is moved below it', async ({ page }) => {
  test.slow();
  await startQuestionnaire(page, 'Reference order');
  const guests = await addQuestion(page, 'Number Field', 'How many guests?');
  await renameComponent(guests, 'guestCount');
  const section = await addSection(page, 'Repeated Section');
  await moveUsedComponent(page, 'guestCount', 'Section', 'before');
  await expect(usedComponents(page).locator('.component-title')).toHaveText([
    'guestCount',
    'Section',
  ]);
  await chooseReference(page, section, 'guestCount');

  const trigger = section.locator('.repeated-settings-trigger');
  const warning = usedComponent(page, 'Section').getByRole('img', { name: 'warning' });
  await expect(trigger).not.toHaveClass(/ant-btn-dangerous/);
  await expect(warning).toHaveCount(0);

  await moveUsedComponent(page, 'guestCount', 'Section', 'after');
  await expect(trigger).toHaveClass(/ant-btn-dangerous/);
  await expect(warning).toBeVisible();
  await expectNextToBeBlocked(page);

  await moveUsedComponent(page, 'guestCount', 'Section', 'before');
  await expect(trigger).not.toHaveClass(/ant-btn-dangerous/);
  await expect(warning).toHaveCount(0);
  await saveProject(page);
});

async function setupNestedReference(page: Page, title: string) {
  await startQuestionnaire(page, title);
  const source = await addSection(page, 'Section');
  await renameComponent(source, 'guestDetails');
  const guests = await addQuestion(page, 'Number Field', 'How many guests?', sectionBody(source));
  await renameComponent(guests, 'guestCount');
  await expect(source.locator('app-input-holder')).toHaveCount(1);

  const repeated = await addSection(page, 'Repeated Section');
  await renameComponent(repeated, 'guestRepeats');
  await moveUsedComponent(page, 'guestDetails', 'guestRepeats', 'before');
  await expect(usedComponents(page).locator('.component-title')).toHaveText([
    'guestDetails',
    'guestRepeats',
  ]);
  return { source, repeated };
}

test('references a named input inside an earlier section and restores it after saving', async ({
  page,
}) => {
  test.slow();
  const title = 'Nested repeat reference';
  const { source, repeated } = await setupNestedReference(page, title);
  const settings = await repeatByAnotherInput(page, repeated);
  await settings.locator('nz-select').nth(1).click();
  await expect(openDropdown(page).locator('.ant-select-item-option-content')).toHaveText([
    'guestCount',
  ]);
  await openDropdown(page).getByTitle('guestCount', { exact: true }).click();
  await closeRepeatSettings(page);
  const trigger = repeated.locator('.repeated-settings-trigger');
  await expect(trigger).toContainText('guestCount');
  await expect(trigger).not.toHaveClass(/ant-btn-dangerous/);
  await expect(
    usedComponent(page, 'guestRepeats').getByRole('img', { name: 'warning' }),
  ).toHaveCount(0);

  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect(source.locator('app-input-holder')).toHaveCount(1);
  await expect(trigger).toContainText('guestCount');
  await expect(trigger).not.toHaveClass(/ant-btn-dangerous/);
});

test('flags a nested reference when its containing section moves after the repeated section', async ({
  page,
}) => {
  test.slow();
  const { source, repeated } = await setupNestedReference(page, 'Nested reference order');
  await chooseReference(page, repeated, 'guestCount');
  const trigger = repeated.locator('.repeated-settings-trigger');
  const warning = usedComponent(page, 'guestRepeats').getByRole('img', { name: 'warning' });
  await expect(trigger).not.toHaveClass(/ant-btn-dangerous/);
  await expect(warning).toHaveCount(0);

  await moveUsedComponent(page, 'guestDetails', 'guestRepeats', 'after');
  await expect(usedComponents(page).locator('.component-title')).toHaveText([
    'guestRepeats',
    'guestDetails',
  ]);
  await expect(source.locator('app-input-holder')).toHaveCount(1);
  await expect(trigger).toHaveClass(/ant-btn-dangerous/);
  await expect(warning).toBeVisible();
  const settings = await openRepeatSettings(page, repeated);
  await settings.locator('nz-select').nth(1).click();
  await expect(openDropdown(page)).toBeVisible();
  await expect(openDropdown(page).getByTitle('guestCount', { exact: true })).toHaveCount(0);
  await closeRepeatSettings(page);
  await expectNextToBeBlocked(page);

  await moveUsedComponent(page, 'guestDetails', 'guestRepeats', 'before');
  await expect(trigger).not.toHaveClass(/ant-btn-dangerous/);
  await expect(warning).toHaveCount(0);
  await saveProject(page);
});
