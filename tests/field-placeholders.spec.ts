import type { Locator } from '@playwright/test';
import { expect, test } from './helpers/fixtures';
import {
  addQuestion,
  openSettings,
  previewOf,
  reopenQuestionnaire,
  saveProject,
  saveSettings,
  startQuestionnaire,
} from './helpers/form-builder';

/** Where the preview displays the placeholder. */
type Surface = 'input' | 'select' | 'button';

interface PlaceholderField {
  component: string;
  surface: Surface;
  /** What the author types into the settings dialog. */
  typed: string;
  /** What the preview displays for it, one entry per element. */
  shown: string[];
  /** What the preview displays without a placeholder; omitted when ng-zorro supplies its own. */
  blank?: string[];
}

// Radio group and Checkbox group have no placeholder setting. Date and time pickers fall back to
// the ng-zorro labels "Select date" and "Select time", which are not asserted here.
const fields: PlaceholderField[] = [
  {
    component: 'Single-line Text Field',
    surface: 'input',
    typed: 'Your full name',
    shown: ['Your full name'],
    blank: [''],
  },
  {
    component: 'Number Field',
    surface: 'input',
    typed: 'How many?',
    shown: ['How many?'],
    blank: [''],
  },
  { component: 'Date Picker', surface: 'input', typed: 'Pick a day', shown: ['Pick a day'] },
  {
    // The range picker splits the setting at "|" into a start and an end placeholder.
    component: 'Range Picker',
    surface: 'input',
    typed: 'First day|Last day',
    shown: ['First day', 'Last day'],
    blank: ['', ''],
  },
  { component: 'Time Picker', surface: 'input', typed: 'Pick a time', shown: ['Pick a time'] },
  {
    component: 'Text Area (multi-line)',
    surface: 'input',
    typed: 'Tell us more',
    shown: ['Tell us more'],
    blank: [''],
  },
  {
    component: 'Dropdown List',
    surface: 'select',
    typed: 'Choose one',
    shown: ['Choose one'],
    blank: [''],
  },
  {
    // The placeholder replaces the label of the upload button.
    component: 'Image Upload',
    surface: 'button',
    typed: 'Attach a photo',
    shown: ['Attach a photo'],
    blank: ['Click here to upload an image'],
  },
];

async function expectPlaceholders(preview: Locator, surface: Surface, texts: string[]) {
  switch (surface) {
    case 'input': {
      const inputs = preview.locator('input, textarea');
      await expect(inputs).toHaveCount(texts.length);
      for (const [index, text] of texts.entries()) {
        await expect(inputs.nth(index)).toHaveAttribute('placeholder', text);
      }
      break;
    }
    case 'select':
      await expect(preview.locator('.ant-select-selection-placeholder')).toHaveText(texts);
      break;
    case 'button':
      await expect(preview.locator('button')).toHaveText(texts);
      break;
  }
}

for (const { component, surface, typed, shown, blank } of fields) {
  test(`${component}: shows the configured placeholder, keeps it after reopening, and drops it when cleared`, async ({
    page,
  }) => {
    const title = `${component} placeholder`;
    await startQuestionnaire(page, title);
    const holder = await addQuestion(page, component, 'Question with a placeholder');
    const preview = previewOf(holder);
    if (blank) {
      await expectPlaceholders(preview, surface, blank);
    }

    const dialog = await openSettings(page, holder);
    await dialog.locator('input[formcontrolname="placeholderValue"]').fill(typed);
    await saveSettings(dialog);
    await expectPlaceholders(preview, surface, shown);

    await saveProject(page);
    await reopenQuestionnaire(page, title);
    await expectPlaceholders(preview, surface, shown);

    const reopened = await openSettings(page, holder);
    const setting = reopened.locator('input[formcontrolname="placeholderValue"]');
    await expect(setting).toHaveValue(typed);
    await setting.clear();
    await saveSettings(reopened);
    if (blank) {
      await expectPlaceholders(preview, surface, blank);
    } else {
      // ng-zorro shows its own label again, so only the configured text is checked.
      await expect(preview.locator(`[placeholder="${shown[0]}"]`)).toHaveCount(0);
    }
  });
}
