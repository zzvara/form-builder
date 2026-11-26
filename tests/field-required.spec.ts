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

const message = 'Please answer this question';

/**
 * How a respondent fills in and empties a preview. The preview reports a required field only
 * after its value was changed, so the error appears once an answer is removed again.
 */
interface Answering {
  answer: (page: Page, question: Locator) => Promise<void>;
  clear: (page: Page, question: Locator) => Promise<void>;
}

function typing(control: string, text: string): Answering {
  return {
    async answer(_page, question) {
      const input = previewOf(question).locator(control);
      await input.fill(text);
      await input.blur();
    },
    async clear(_page, question) {
      const input = previewOf(question).locator(control);
      await input.clear();
      await input.blur();
    },
  };
}

/** Pickers and lists are answered through their popup and emptied with the clear icon on hover. */
function choosing(
  control: string,
  clearIcon: string,
  answer: (page: Page, question: Locator) => Promise<void>,
): Answering {
  return {
    answer,
    async clear(_page, question) {
      const picker = previewOf(question).locator(control);
      await picker.hover();
      await picker.locator(clearIcon).click();
    },
  };
}

interface RequiredField {
  component: string;
  /** Absent when the preview shows no error for the field. */
  answering?: Answering;
  /** Whether the dialog refuses an empty default value once the field is required. */
  requiresDefault: boolean;
  /** Set for a known bug that is reproduced in the running app. */
  bug?: string;
}

const timeBug =
  'Ticking Is it required? throws: the message input is bound to a translated label, so the dialog has no message field.';
const textAreaBug =
  'The settings dialog has no field for the required message, which is mandatory, so a required text area cannot be saved.';

const fields: RequiredField[] = [
  {
    component: 'Single-line Text Field',
    requiresDefault: true,
    answering: typing('input', 'Ada Lovelace'),
  },
  { component: 'Number Field', requiresDefault: true, answering: typing('input', '5') },
  {
    component: 'Date Picker',
    requiresDefault: true,
    answering: choosing('nz-date-picker', '.ant-picker-clear', async (page, question) => {
      await previewOf(question).locator('input').click();
      await calendarDay(page, '15').click();
    }),
  },
  {
    component: 'Range Picker',
    requiresDefault: true,
    answering: choosing('nz-range-picker', '.ant-picker-clear', async (page, question) => {
      await previewOf(question).locator('input').first().click();
      await calendarDay(page, '10').click();
      await calendarDay(page, '15').click();
    }),
  },
  {
    component: 'Time Picker',
    requiresDefault: true,
    answering: choosing('nz-time-picker', '.ant-picker-clear', async (page, question) => {
      await previewOf(question).locator('input').click();
      await page.getByText('Now', { exact: true }).click();
      await question.locator('input[name="inputQuestion"]').click();
    }),
    bug: timeBug,
  },
  {
    component: 'Text Area (multi-line)',
    requiresDefault: true,
    answering: typing('textarea', 'Some words'),
    bug: textAreaBug,
  },
  {
    component: 'Dropdown List',
    requiresDefault: true,
    answering: choosing('nz-select', '.ant-select-clear', async (page, question) => {
      await previewOf(question).locator('nz-select').click();
      await page.locator('.ant-select-dropdown').getByTitle('Option 1', { exact: true }).click();
    }),
  },
  // The previews of Radio group and Checkbox group show no required error.
  { component: 'Radio group', requiresDefault: false },
  { component: 'Checkbox group', requiresDefault: false },
];

for (const { component, answering, requiresDefault, bug } of fields) {
  const outcome = answering ? 'is reported when emptied' : 'keeps the setting after reopening';
  test(`${component}: a required answer needs its message and ${outcome}`, async ({ page }) => {
    const title = `${component} required`;
    await startQuestionnaire(page, title);
    const holder = await addQuestion(page, component, 'Question that must be answered');
    const error = holder.getByText(message, { exact: true });

    const dialog = await openSettings(page, holder);
    const save = dialog.getByRole('button', { name: 'Save', exact: true });
    const requiredMessage = dialog.locator('input[formcontrolname="requiredMessage"]');
    await dialog.getByRole('checkbox', { name: 'Is it required?', exact: true }).check();
    test.fail(bug !== undefined, bug);
    await expect(requiredMessage).toBeVisible({ timeout: bug ? 2000 : undefined });
    await expect(
      dialog.getByText('If required, the message cannot be empty.', { exact: true }),
    ).toBeVisible();
    await expect(save).toBeDisabled();
    await requiredMessage.fill(message);
    if (requiresDefault) {
      await expect(save).toBeDisabled();
      await dialog
        .getByRole('checkbox', { name: 'Should it have a default value?', exact: true })
        .uncheck();
    }
    await expect(save).toBeEnabled();
    await saveSettings(dialog);

    if (answering) {
      await answering.answer(page, holder);
      await expect(error).toHaveCount(0);
      await answering.clear(page, holder);
      await expect(error).toBeVisible();
      await answering.answer(page, holder);
      await expect(error).toHaveCount(0);
    }

    await saveProject(page);
    await reopenQuestionnaire(page, title);
    if (answering) {
      // Checked through the preview: the settings of a range picker that has an answer cannot be
      // opened without an error, because the default input cannot show a stored range.
      await answering.clear(page, holder);
      await expect(error).toBeVisible();
    } else {
      const reopened = await openSettings(page, holder);
      await expect(
        reopened.getByRole('checkbox', { name: 'Is it required?', exact: true }),
      ).toBeChecked();
      await expect(reopened.locator('input[formcontrolname="requiredMessage"]')).toHaveValue(
        message,
      );
    }
  });
}

test('Checkbox group: a required answer is reported when the last option is cleared', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Required checkbox validation');
  const holder = await addQuestion(page, 'Checkbox group', 'Choose at least one');
  const dialog = await openSettings(page, holder);
  await dialog.getByRole('checkbox', { name: 'Is it required?', exact: true }).check();
  await dialog.locator('input[formcontrolname="requiredMessage"]').fill(message);
  await saveSettings(dialog);

  const option = holder.getByRole('checkbox', { name: 'Option 1', exact: true });
  const error = holder.getByText(message, { exact: true });
  await option.check();
  await expect(option).toBeChecked();
  await expect(error).toHaveCount(0);
  await option.uncheck();
  await expect(option).not.toBeChecked();
  test.fail(true, 'The checkbox preview does not report a missing required selection.');
  await expect(error).toBeVisible({ timeout: 2000 });
});
