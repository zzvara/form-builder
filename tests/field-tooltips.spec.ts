import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  openSettings,
  previewOf,
  reopenQuestionnaire,
  saveProject,
  saveSettings,
  startQuestionnaire,
  tooltip,
} from './helpers/form-builder';

const hint = 'Use the name on your passport';
const iconMissing =
  'The preview renders an empty span instead of the info icon, so the tooltip cannot be reached.';

interface TooltipField {
  component: string;
  /** Set for a known bug that is reproduced in the running app. */
  bug?: string;
}

// Text Area, Image Upload, Radio group, and Checkbox group have no tooltip settings.
const fields: TooltipField[] = [
  { component: 'Single-line Text Field' },
  { component: 'Number Field' },
  { component: 'Date Picker' },
  { component: 'Range Picker', bug: iconMissing },
  { component: 'Time Picker', bug: iconMissing },
  { component: 'Dropdown List' },
];

for (const { component, bug } of fields) {
  test(`${component}: shows the configured tooltip on an info icon, keeps it after reopening, and drops it when switched off`, async ({
    page,
  }) => {
    const title = `${component} tooltip`;
    await startQuestionnaire(page, title);
    const holder = await addQuestion(page, component, 'Question with a hint');
    const icon = previewOf(holder).getByRole('img', { name: 'info-circle', exact: true });
    await expect(icon).toHaveCount(0);

    const dialog = await openSettings(page, holder);
    const save = dialog.getByRole('button', { name: 'Save', exact: true });
    await dialog.getByRole('checkbox', { name: 'Show tooltip?', exact: true }).check();
    await expect(dialog.getByText('Please provide a tooltip text!', { exact: true })).toBeVisible();
    await expect(save).toBeDisabled();
    await dialog.locator('input[formcontrolname="tooltipText"]').fill(hint);
    await expect(save).toBeEnabled();
    await saveSettings(dialog);

    test.fail(bug !== undefined, bug);
    await expect(icon).toBeVisible({ timeout: bug ? 2000 : undefined });
    await icon.hover();
    await expect(tooltip(page)).toHaveText(hint);

    await saveProject(page);
    await reopenQuestionnaire(page, title);
    await icon.hover();
    await expect(tooltip(page)).toHaveText(hint);

    const reopened = await openSettings(page, holder);
    await reopened.getByRole('checkbox', { name: 'Show tooltip?', exact: true }).uncheck();
    await saveSettings(reopened);
    await expect(icon).toHaveCount(0);
  });
}
