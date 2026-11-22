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
import type { Locator, Page } from '@playwright/test';

async function selectTime(
  page: Page,
  input: Locator,
  hour: string,
  minute: string,
  second: string,
) {
  await input.click();
  const columns = page.locator(
    '.ant-picker-dropdown:not(.ant-picker-dropdown-hidden) .ant-picker-time-panel-column',
  );
  for (const [index, value] of [hour, minute, second].entries()) {
    await columns
      .nth(index)
      .locator('.ant-picker-time-panel-cell')
      .filter({ hasText: new RegExp(`^${value}$`) })
      .click();
  }
  await input.blur();
}

async function selectDate(page: Page, input: Locator, day: string) {
  await input.click();
  await calendarDay(page, day).click();
}

test('date preview selects a calendar day and restores it after saving', async ({ page }) => {
  await startQuestionnaire(page, 'Calendar date');
  const holder = await addQuestion(page, 'Date Picker', 'Select a date');
  const preview = holder.locator('.input-preview-container input');
  await preview.click();
  await page.getByText('Today', { exact: true }).click();
  await expect(preview).not.toBeEmpty();
  const selectedDate = await preview.inputValue();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Calendar date');
  await expect(preview).toHaveValue(selectedDate);
});

test('range preview saves both calendar endpoints', async ({ page }) => {
  await startQuestionnaire(page, 'Calendar range');
  const holder = await addQuestion(page, 'Range Picker', 'Select a range');
  const inputs = holder.locator('.input-preview-container input');
  await inputs.first().click();
  const calendar = page.getByRole('grid').first();
  // The six-week grid also shows days of the neighbouring months, whose numbers can repeat.
  const day = (name: string) =>
    calendar
      .getByRole('gridcell', { name, exact: true })
      .and(page.locator('.ant-picker-cell-in-view'));
  await day('10').click();
  await day('15').click();
  await expect(inputs.first()).not.toBeEmpty();
  await expect(inputs.nth(1)).not.toBeEmpty();
  const start = await inputs.first().inputValue();
  const end = await inputs.nth(1).inputValue();
  expect(start).not.toBe(end);
  await saveProject(page);
  await reopenQuestionnaire(page, 'Calendar range');
  await expect(inputs.first()).toHaveValue(start);
  await expect(inputs.nth(1)).toHaveValue(end);
});

test('time preview selects a time and restores it after saving', async ({ page }) => {
  await startQuestionnaire(page, 'Selected time');
  const holder = await addQuestion(page, 'Time Picker', 'Select a time');
  const preview = holder.locator('.input-preview-container input');
  await preview.click();
  await page.getByText('Now', { exact: true }).click();
  await holder.locator('input[name="inputQuestion"]').click();
  await expect(preview).not.toBeEmpty();
  const selectedTime = await preview.inputValue();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Selected time');
  await expect(preview).toHaveValue(selectedTime);
});

test('week numbers can be shown and hidden on the date calendar', async ({ page }) => {
  await startQuestionnaire(page, 'Calendar week numbers');
  const holder = await addQuestion(page, 'Date Picker', 'Choose a day');
  const preview = previewOf(holder).locator('input');
  await preview.click();
  await expect(page.locator('.ant-picker-cell-week:visible')).toHaveCount(0);
  await preview.press('Escape');

  const dialog = await openSettings(page, holder);
  await dialog.getByRole('checkbox', { name: 'Week numbers', exact: true }).check();
  await saveSettings(dialog);
  await preview.click();
  const weeks = page.locator('.ant-picker-cell-week:visible');
  await expect(weeks).toHaveCount(6);
  await expect(weeks.first()).toHaveText(/^\s*\d{1,2}\s*$/);
  await preview.press('Escape');
  await saveProject(page);
  await reopenQuestionnaire(page, 'Calendar week numbers');
  await preview.click();
  await expect(weeks).toHaveCount(6);
  await preview.press('Escape');
  const reopened = await openSettings(page, holder);
  await reopened.getByRole('checkbox', { name: 'Week numbers', exact: true }).uncheck();
  await saveSettings(reopened);
  await preview.click();
  await expect(weeks).toHaveCount(0);
});

test('switching a time after noon to 12-hour format preserves the time', async ({ page }) => {
  await startQuestionnaire(page, 'Afternoon time format');
  const holder = await addQuestion(page, 'Time Picker', 'Choose a time');
  const preview = previewOf(holder).locator('input');
  await selectTime(page, preview, '15', '30', '00');
  await expect(preview).toHaveValue('15:30:00');
  const dialog = await openSettings(page, holder);
  await dialog.locator('input[formcontrolname="timeFormat"]').fill('hh:mm:ss a');
  await dialog.getByRole('checkbox', { name: '12-hour format', exact: true }).check();
  await saveSettings(dialog);
  test.fail(true, 'Changing the time format clears the existing afternoon value.');
  await expect(preview).toHaveValue('03:30:00 PM');
  await saveProject(page);
  await reopenQuestionnaire(page, 'Afternoon time format');
  await expect(preview).toHaveValue('03:30:00 PM');
});

test('date limits disable dates outside the inclusive bounds', async ({ page }) => {
  await startQuestionnaire(page, 'Bounded dates');
  const holder = await addQuestion(page, 'Date Picker', 'Choose a bounded date');
  const dialog = await openSettings(page, holder);
  await dialog.locator('[formcontrolname="minDate"] input').check();
  await selectDate(page, dialog.locator('[formcontrolname="minDateValue"] input'), '10');
  await dialog.locator('[formcontrolname="maxDate"] input').check();
  await selectDate(page, dialog.locator('[formcontrolname="maxDateValue"] input'), '20');
  await saveSettings(dialog);

  const preview = previewOf(holder).locator('input');
  await preview.click();
  for (const day of ['9', '21']) {
    await expect(calendarDay(page, day)).toHaveClass(/ant-picker-cell-disabled/);
  }
  for (const day of ['10', '20']) {
    await expect(calendarDay(page, day)).not.toHaveClass(/ant-picker-cell-disabled/);
  }
  await calendarDay(page, '9').click({ force: true });
  await expect(preview).toBeEmpty();
  await preview.click();
  await calendarDay(page, '10').click();
  await expect(preview).toHaveValue(/\.\d{2}\.10$/);
  await preview.click();
  await calendarDay(page, '20').click();
  await expect(preview).toHaveValue(/\.\d{2}\.20$/);
  await saveProject(page);
  await reopenQuestionnaire(page, 'Bounded dates');
  await expect(preview).toHaveValue(/\.\d{2}\.20$/);
  test.fail(true, 'Saved date bounds are restored as strings, so opening the calendar throws.');
  await preview.click();
  await expect(calendarDay(page, '21')).toHaveClass(/ant-picker-cell-disabled/);
});

test('time limits disable times outside the inclusive bounds', async ({ page }) => {
  await startQuestionnaire(page, 'Bounded times');
  const holder = await addQuestion(page, 'Time Picker', 'Choose a bounded time');
  const dialog = await openSettings(page, holder);
  await dialog.locator('[formcontrolname="minTime"] input').check();
  await selectTime(
    page,
    dialog.locator('[formcontrolname="minTimeValue"] input'),
    '09',
    '30',
    '10',
  );
  await dialog.locator('[formcontrolname="maxTime"] input').check();
  await selectTime(
    page,
    dialog.locator('[formcontrolname="maxTimeValue"] input'),
    '17',
    '15',
    '20',
  );
  await saveSettings(dialog);

  const preview = previewOf(holder).locator('input');
  await preview.click();
  const columns = page.locator(
    '.ant-picker-dropdown:not(.ant-picker-dropdown-hidden) .ant-picker-time-panel-column',
  );
  const cell = (column: number, value: string) =>
    columns
      .nth(column)
      .locator('.ant-picker-time-panel-cell')
      .filter({ hasText: new RegExp(`^${value}$`) });
  await expect(cell(0, '08')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await expect(cell(0, '09')).not.toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await expect(cell(0, '17')).not.toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await expect(cell(0, '18')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await cell(0, '09').click();
  await expect(cell(1, '29')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await expect(cell(1, '30')).not.toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await cell(1, '30').click();
  await expect(cell(2, '09')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await expect(cell(2, '10')).not.toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await cell(2, '10').click();
  await preview.blur();
  await expect(preview).toHaveValue('09:30:10');
  await preview.click();
  await cell(0, '17').click();
  await expect(cell(1, '15')).not.toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await expect(cell(1, '16')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await cell(1, '15').click();
  await expect(cell(2, '20')).not.toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await expect(cell(2, '21')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await cell(2, '20').click();
  await preview.blur();
  await expect(preview).toHaveValue('17:15:20');
  await saveProject(page);
  await reopenQuestionnaire(page, 'Bounded times');
  await expect(preview).toHaveValue('17:15:20');
  test.fail(true, 'Saved time bounds are restored as strings, so opening the picker throws.');
  await preview.click();
  await expect(cell(0, '18')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
});

test('range picker shows week numbers and enforces date bounds on both endpoints', async ({
  page,
}) => {
  await startQuestionnaire(page, 'Bounded range');
  const holder = await addQuestion(page, 'Range Picker', 'Choose a range');
  const dialog = await openSettings(page, holder);
  await dialog.locator('[formcontrolname="showWeekNumber"] input').check();
  await dialog.locator('[formcontrolname="minDate"] input').check();
  await selectDate(page, dialog.locator('[formcontrolname="minDateValue"] input'), '10');
  await dialog.locator('[formcontrolname="maxDate"] input').check();
  await selectDate(page, dialog.locator('[formcontrolname="maxDateValue"] input'), '20');
  await saveSettings(dialog);

  const inputs = previewOf(holder).locator('input');
  await inputs.first().click();
  await expect(page.locator('.ant-picker-cell-week:visible')).toHaveCount(12);
  await expect(calendarDay(page, '9')).toHaveClass(/ant-picker-cell-disabled/);
  await expect(calendarDay(page, '21')).toHaveClass(/ant-picker-cell-disabled/);
  await calendarDay(page, '10').click();
  await calendarDay(page, '20').click();
  await expect(inputs.first()).toHaveValue(/\.\d{2}\.10$/);
  await expect(inputs.nth(1)).toHaveValue(/\.\d{2}\.20$/);
});

for (const mode of ['Full date', 'Year', 'Week']) {
  test(`date picker ${mode} mode selects and persists a value`, async ({ page }) => {
    const title = `Date mode ${mode}`;
    await startQuestionnaire(page, title);
    const holder = await addQuestion(page, 'Date Picker', 'Select a value');
    const dialog = await openSettings(page, holder);
    await dialog.locator('nz-select[formcontrolname="mode"]').click();
    await page.locator('.ant-select-dropdown:visible').getByTitle(mode, { exact: true }).click();
    await saveSettings(dialog);
    const preview = previewOf(holder).locator('input');
    await preview.click();
    if (mode === 'Year') {
      await page.locator('.ant-picker-year-panel .ant-picker-cell-in-view').first().click();
      await expect(preview).toHaveValue(/^\d{4}$/);
    } else {
      await calendarDay(page, '15').click();
      await expect(preview).toHaveValue(mode === 'Week' ? /^\d{4}\.\d{2}$/ : /^\d{4}\.\d{2}\.15$/);
    }
    const value = await preview.inputValue();
    await saveProject(page);
    await reopenQuestionnaire(page, title);
    await expect(preview).toHaveValue(value);
  });
}

test('a date field can include a time and use custom date and time formats', async ({ page }) => {
  await startQuestionnaire(page, 'Formatted date and time');
  const holder = await addQuestion(page, 'Date Picker', 'Choose a date and time');
  const dialog = await openSettings(page, holder);
  await dialog.locator('input[formcontrolname="dateFormat"]').fill('dd/MM/yyyy');
  await dialog.locator('[formcontrolname="showTime"] input').check();
  await dialog.locator('input[formcontrolname="timeFormat"]').fill(' HH:mm');
  await saveSettings(dialog);
  const preview = previewOf(holder).locator('input');
  await preview.click();
  await calendarDay(page, '15').click();
  const columns = page.locator(
    '.ant-picker-dropdown:not(.ant-picker-dropdown-hidden) .ant-picker-time-panel-column',
  );
  await columns.nth(0).locator('.ant-picker-time-panel-cell').filter({ hasText: /^14$/ }).click();
  await columns.nth(1).locator('.ant-picker-time-panel-cell').filter({ hasText: /^25$/ }).click();
  await page.getByRole('button', { name: 'Ok', exact: true }).click();
  await expect(preview).toHaveValue(/^15\/\d{2}\/\d{4} 14:25$/);
  const value = await preview.inputValue();
  await saveProject(page);
  await reopenQuestionnaire(page, 'Formatted date and time');
  await expect(preview).toHaveValue(value);
});

for (const field of ['date', 'time'] as const) {
  for (const bound of ['min', 'max'] as const) {
    test(`${field} value outside a newly applied ${bound}imum is cleared`, async ({ page }) => {
      await startQuestionnaire(page, `Existing ${field} ${bound}`);
      const holder = await addQuestion(
        page,
        field === 'date' ? 'Date Picker' : 'Time Picker',
        'Choose a value',
      );
      const preview = previewOf(holder).locator('input');
      if (field === 'date') {
        await selectDate(page, preview, bound === 'min' ? '5' : '25');
      } else {
        await selectTime(page, preview, bound === 'min' ? '08' : '18', '00', '00');
        await expect(preview).toHaveValue(bound === 'min' ? '08:00:00' : '18:00:00');
      }
      await expect(preview).not.toBeEmpty();
      const selected = await preview.inputValue();
      const dialog = await openSettings(page, holder);
      await expect(dialog.locator('[formcontrolname="defaultValue"] input')).toHaveValue(selected);
      const suffix = field === 'date' ? 'Date' : 'Time';
      await dialog.locator(`[formcontrolname="${bound}${suffix}"] input`).check();
      const limit = dialog.locator(`[formcontrolname="${bound}${suffix}Value"] input`);
      if (field === 'date') {
        await selectDate(page, limit, bound === 'min' ? '10' : '20');
      } else {
        await selectTime(page, limit, bound === 'min' ? '09' : '17', '00', '00');
      }
      await saveSettings(dialog);
      await expect(preview).toBeEmpty();
    });
  }
}

test('date and time bounds restrict both the day and time at each boundary', async ({ page }) => {
  await startQuestionnaire(page, 'Bounded date and time');
  const holder = await addQuestion(page, 'Date Picker', 'Choose a date and time');
  const dialog = await openSettings(page, holder);
  await dialog.locator('[formcontrolname="showTime"] input').check();

  const columns = page.locator(
    '.ant-picker-dropdown:not(.ant-picker-dropdown-hidden) .ant-picker-time-panel-column',
  );
  const cell = (column: number, value: string) =>
    columns
      .nth(column)
      .locator('.ant-picker-time-panel-cell')
      .filter({ hasText: new RegExp(`^${value}$`) });
  for (const [bound, hour, minute] of [
    ['min', '09', '30'],
    ['max', '17', '15'],
  ]) {
    await dialog.locator(`[formcontrolname="${bound}Date"] input`).check();
    await dialog.locator(`[formcontrolname="${bound}DateValue"] input`).click();
    await calendarDay(page, '15').click();
    await cell(0, hour).click();
    await cell(1, minute).click();
    await cell(2, '00').click();
    await page.getByRole('button', { name: 'Ok', exact: true }).click();
  }
  await saveSettings(dialog);

  const preview = previewOf(holder).locator('input');
  await preview.click();
  await expect(calendarDay(page, '14')).toHaveClass(/ant-picker-cell-disabled/);
  await expect(calendarDay(page, '16')).toHaveClass(/ant-picker-cell-disabled/);
  await calendarDay(page, '15').click();
  await expect(cell(0, '08')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await expect(cell(0, '18')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await cell(0, '09').click();
  await expect(cell(1, '29')).toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await expect(cell(1, '30')).not.toHaveClass(/ant-picker-time-panel-cell-disabled/);
  await cell(1, '30').click();
  await cell(2, '00').click();
  await page.getByRole('button', { name: 'Ok', exact: true }).click();
  await expect(preview).toHaveValue(/\.15 09:30:00$/);
});
