import type { Locator, Page } from '@playwright/test';
import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  calendarDay,
  openSettings,
  previewOf,
  reopenQuestionnaire,
  saveProject,
  saveSettings,
  startQuestionnaire,
} from './helpers/form-builder';

interface DefaultField {
  component: string;
  /** Finds what displays the default in the preview. */
  shown: (preview: Locator) => Locator;
  /** Whether the default is the value of the control or the text of the selected items. */
  reads: 'value' | 'text';
  /** Picks a default in the open settings dialog and returns what the preview must then show. */
  choose: (page: Page, dialog: Locator) => Promise<string[]>;
  /** The checkbox that switches the default value on and off. */
  toggle?: string;
  /** Set for a known bug that is reproduced in the running app. */
  bug?: string;
}

const defaultInput = (dialog: Locator) => dialog.locator('[formcontrolname="defaultValue"] input');

/** Picks the 15th of the displayed month in the dialog's date picker. */
async function chooseDay(page: Page, dialog: Locator) {
  const input = defaultInput(dialog);
  await input.click();
  await calendarDay(page, '15').click();
  await expect(input).not.toBeEmpty();
  return [await input.inputValue()];
}

async function chooseOptions(page: Page, dialog: Locator, options: string[]) {
  await dialog.locator('nz-select[formcontrolname="defaultValue"]').click();
  for (const option of options) {
    await page.locator('.ant-select-dropdown').getByTitle(option, { exact: true }).click();
  }
  // A multiple-choice list stays open after each pick; clicking the header closes it.
  await dialog.locator('.ant-modal-header').click();
  return options;
}

// Checkbox group defaults are the checked options, which choice-fields.spec.ts covers.
const fields: DefaultField[] = [
  {
    component: 'Single-line Text Field',
    shown: (preview) => preview.locator('input'),
    reads: 'value',
    async choose(_page, dialog) {
      await dialog.locator('input[formcontrolname="defaultValue"]').fill('Ada Lovelace');
      return ['Ada Lovelace'];
    },
  },
  {
    component: 'Number Field',
    shown: (preview) => preview.locator('input'),
    reads: 'value',
    async choose(_page, dialog) {
      await defaultInput(dialog).fill('42');
      return ['42'];
    },
  },
  {
    component: 'Date Picker',
    shown: (preview) => preview.locator('input'),
    reads: 'value',
    choose: chooseDay,
  },
  {
    component: 'Range Picker',
    shown: (preview) => preview.locator('input').first(),
    reads: 'value',
    choose: chooseDay,
    bug: 'The dialog offers a single-date picker as the default of a range, and the stored date makes the range picker throw, so the preview stays empty.',
  },
  {
    component: 'Time Picker',
    shown: (preview) => preview.locator('input'),
    reads: 'value',
    async choose(page, dialog) {
      const input = defaultInput(dialog);
      await input.click();
      await page.getByText('Now', { exact: true }).click();
      await expect(input).not.toBeEmpty();
      return [await input.inputValue()];
    },
  },
  {
    component: 'Text Area (multi-line)',
    shown: (preview) => preview.locator('textarea'),
    reads: 'value',
    async choose(_page, dialog) {
      await dialog
        .locator('textarea[formcontrolname="defaultValue"]')
        .fill('First line\nSecond line');
      return ['First line\nSecond line'];
    },
  },
  {
    component: 'Dropdown List',
    shown: (preview) => preview.locator('.ant-select-selection-item'),
    reads: 'text',
    choose: (page, dialog) => chooseOptions(page, dialog, ['Option 2']),
  },
  {
    component: 'Radio group',
    shown: (preview) => preview.locator('label[nz-radio].ant-radio-wrapper-checked'),
    reads: 'text',
    toggle: 'Set default value',
    async choose(_page, dialog) {
      await dialog
        .getByRole('row')
        .filter({ hasText: 'Option 2' })
        .locator('label[nz-radio]')
        .click();
      return ['Option 2'];
    },
  },
];

async function expectShown(
  field: DefaultField,
  preview: Locator,
  values: string[],
  timeout?: number,
) {
  const shown = field.shown(preview);
  if (field.reads === 'value') {
    await expect(shown).toHaveValue(values[0] ?? '', { timeout });
  } else {
    await expect(shown).toHaveText(values, { timeout });
  }
}

for (const field of fields) {
  test(`${field.component}: shows the configured default value and drops it when switched off`, async ({
    page,
  }) => {
    const title = `${field.component} default`;
    await startQuestionnaire(page, title);
    const holder = await addQuestion(page, field.component, 'Question with a default');
    const preview = previewOf(holder);

    const dialog = await openSettings(page, holder);
    const values = await field.choose(page, dialog);
    await saveSettings(dialog);
    test.fail(field.bug !== undefined, field.bug);
    await expectShown(field, preview, values, field.bug ? 2000 : undefined);

    await saveProject(page);
    await reopenQuestionnaire(page, title);
    await expectShown(field, preview, values);

    const reopened = await openSettings(page, holder);
    await reopened
      .getByRole('checkbox', {
        name: field.toggle ?? 'Should it have a default value?',
        exact: true,
      })
      .uncheck();
    await saveSettings(reopened);
    await expectShown(field, preview, []);
  });
}

test('Dropdown List: shows several default selections when multiple answers are allowed', async ({
  page,
}) => {
  const title = 'Dropdown multiple defaults';
  await startQuestionnaire(page, title);
  const holder = await addQuestion(page, 'Dropdown List', 'Choose several');
  const preview = previewOf(holder);
  const selected = preview.locator('.ant-select-selection-item-content');

  const dialog = await openSettings(page, holder);
  await dialog.getByRole('checkbox', { name: 'Multiple answers allowed', exact: true }).check();
  await chooseOptions(page, dialog, ['Option 1', 'Option 2']);
  await saveSettings(dialog);
  await expect(selected).toHaveText(['Option 1', 'Option 2']);

  await saveProject(page);
  await reopenQuestionnaire(page, title);
  await expect(selected).toHaveText(['Option 1', 'Option 2']);

  const reopened = await openSettings(page, holder);
  await reopened
    .getByRole('checkbox', { name: 'Should it have a default value?', exact: true })
    .uncheck();
  await saveSettings(reopened);
  await expect(selected).toHaveCount(0);
});
