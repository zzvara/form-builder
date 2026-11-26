# Browser tests

The Playwright configuration runs the specs in this directory using Chromium.
With the app already running at `http://localhost:4200`, run:

```sh
npm run test:e2e -- --workers=2
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.
Without a running app, build first with `npm run build`; Playwright then starts
the static server automatically. `PLAYWRIGHT_PORT` selects a different port.
CI starts its own server and requires the built app.

`tests/tsconfig.json` gives the browser test runner and helpers Node.js types in
the editor. Type-check the suite with `npx tsc -p tests/tsconfig.json`.

Each test gets isolated browser storage and creates its own projects through the
UI. Export/import tests use the actual downloaded JSON in a second, empty browser
context; tests of hand-made or malformed import files hand an in-memory file to the
import control. They do not seed local storage or mock application services.

## Workflow coverage

| Spec                             | Behaviors checked                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project-creation.spec.ts`       | Questionnaire/test creation, title validation, project editing/deletion, dashboard layout persistence                                                          |
| `component-editor.spec.ts`       | Palette filtering, settings save/cancel, inline editing, delete/reset confirmation, undo/redo, active-question validation                                      |
| `component-naming.spec.ts`       | Variable-name rules (invalid, reserved, empty, duplicate), cancelling a rename, persistence, names inside sections                                             |
| `used-components.spec.ts`        | "Used Components" order, drag-reordering, scroll-to-question, draft and incomplete-question markers                                                            |
| `input-types.spec.ts`            | Settings, descriptions, preview rendering, and save/reopen for number, date, range, time, textarea, image, dropdown, radio, and checkbox inputs                |
| `choice-fields.spec.ts`          | Duplicate option rejection, adding/renaming/removing options, radio exclusivity, dropdown multiple selections, checked/disabled checkbox defaults, persistence |
| `field-validation.spec.ts`       | Required-text error/recovery, maximum length and character counter, multiline answers, numeric step/min/max, persistence                                       |
| `field-tooltips.spec.ts`         | Tooltip text required in the settings, info icon and tooltip on hover in the text, number, date, range, time, and dropdown previews, persistence, removal      |
| `field-required.spec.ts`         | Required-message settings and persistence for required inputs; preview validation on clearing supported answers, including a known checkbox failure            |
| `field-placeholders.spec.ts`     | Placeholder in the text, number, date, range (`start\|end`), time, text area, dropdown, and image upload previews, persistence, removal                        |
| `field-defaults.spec.ts`         | Default value chosen in the settings and shown in the preview (text, number, date, range, time, text area, dropdown, radio), persistence, switching it off     |
| `date-time-fields.spec.ts`       | Date, range and time selection, week numbers, date modes and formats, date/time bounds, existing values, persistence                                           |
| `image-upload.spec.ts`           | File chooser upload, successful upload state, byte-for-byte download, removal                                                                                  |
| `conditions.spec.ts`             | JavaScript conditions: variable picker, syntax/type/runtime error messages, saved condition icon and tooltip, persistence, section conditions                  |
| `sections-history.spec.ts`       | Named nested sections, section deletion/cancellation/undo and repeated-section count                                                                           |
| `section-editing.spec.ts`        | Moving questions between sections or to top level, and locked source/destination behavior                                                                      |
| `repeated-section-input.spec.ts` | Repeating by named number/checkbox inputs, nested references, required-reference validation and invalidation after reordering                                  |
| `stepper-navigation.spec.ts`     | Step guards (title, at least one question), data kept when stepping back, last step named after the project type                                               |
| `version-history.spec.ts`        | Version snapshot selection, Previous/Next Version buttons, history boundaries, change-summary dialog                                                           |
| `project-info.spec.ts`           | Changing project category, deadline/time-limit controls, results summary, bold/italic/underlined description formatting, persistence                           |
| `results-tabs.spec.ts`           | Input statistics by type, read-only Project JSON and Project History tabs                                                                                      |
| `preferences.spec.ts`            | English/Hungarian translation and rendered light/dark theme across reloads, the Hungarian editor flow without leaked translation keys                          |
| `dashboard-projects.spec.ts`     | Delete cancellation/persistence in list and card view, saved card content, reopening projects, title sorting, empty-state creation buttons                     |
| `project-export.spec.ts`         | Results statistics, downloaded JSON contents, import into empty storage, with/without history                                                                  |
| `project-import.spec.ts`         | Structured project export/import, rejected files and recovery, import after visiting results, script in an imported description                                |
| `keyboard-access.spec.ts`        | Enter/Space on the layout toggle, opening a project, submitting the form and returning home with the keyboard, delete and language controls                    |
| `responsive.spec.ts`             | Phone dashboard cards, repeated-section settings drawer after narrowing the window, empty form drop area on narrow windows                                     |
| `palette-search.spec.ts`         | Searching English and Hungarian component labels, including an uppercase accented substring (known bug)                                                        |

This is workflow coverage, not an instrumented line/branch coverage percentage.
Locked destination tests characterize the current behavior: both empty and non-empty
locked sections accept incoming questions. The intended behavior is pending discussion.
The suite runs desktop Chromium; individual tests resize the viewport for phone and
narrow-window layouts. Remaining gaps include Firefox/WebKit, touch dragging, date,
range and string-array variables in conditions, sorting by the date columns,
pagination beyond one page of projects, and image preview persistence. History stored in
an exported file is not restored by an import (the imported project starts at
VERSION 1); that behavior is observed but not asserted.

The shared field settings (tooltip, required, placeholder, default value) are covered for
inputs that offer them, with the validation limitations noted below. Text Area, Image Upload,
Radio group, and Checkbox group have no tooltip setting. Checkbox group defaults are its
checked options, covered by `choice-fields.spec.ts`. Radio group required settings are checked,
but required preview validation is not: there is no UI to clear a selected radio answer, and
the app provides no established validation trigger for an untouched group.

## Helpers and fixtures

Every spec imports `test` and `expect` from `helpers/fixtures.ts`. Its automatic
`appErrors` fixture fails a test when the app throws an uncaught exception or logs a
console error (failed network requests are ignored). A test that provokes one on
purpose consumes it, for example `appErrors.splice(0)`.

Shared UI actions live in `helpers/form-builder.ts`. The drag helpers use mouse
movements to exercise Angular CDK dragging and wait for CDK to finish its drop
animation:

- `dragFromPalette` and `addQuestion` drop into the whole form by default. Pass a
  section body (`sectionBody(section)`) to drop into that section, or
  `{ before: question }` for a deterministic position. Do not use a section as the
  `before` anchor: a question dropped near its top is captured by the section.
- `moveUsedComponent` reorders the form through the "Used Components" panel and
  `moveQuestionToSection` drags a question header into another section.
- `renameComponent`, `openSettings`, `saveSettings`, `addSection`, `previewOf`,
  `calendarDay`, and `tooltip` cover the inline name editor, settings dialogs (save and
  wait for them to close), sections, the live preview of a question, calendar popups, and
  ng-zorro tooltips.

Prefer role/text locators where the app provides useful accessible names; scope DOM
selectors for unnamed controls. Calendar pickers also show days of neighbouring
months, so select only in-view cells to stay independent of today's date.

## Known bugs

Regressions reproduced against the running app are marked with `test.fail`. Each test
asserts the desired behavior after its setup assertions; both still execute, and an
unexpected pass signals that the annotation can be removed. Product code has not been
changed to resolve these bugs.

| Spec                         | Desired behavior and what the app does today                                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `component-editor.spec.ts`   | After turning inline editing off and on, the question is editable again; it stays read-only and the preview stays disabled                            |
| `palette-search.spec.ts`     | Searching English or Hungarian displayed labels finds the corresponding component; filtering compares translation keys instead                        |
| `component-naming.spec.ts`   | A name already used inside a section is rejected; only top-level names are compared, so duplicates are accepted                                       |
| `conditions.spec.ts`         | Removing a variable invalidates code that still uses it; the stale variable keeps validating the code                                                 |
| `conditions.spec.ts`         | Saving a section condition closes the dialog; Save does nothing because palette-created sections have no `sectionId` to look up                       |
| `stepper-navigation.spec.ts` | The last step follows the Type switch immediately; it only changes after "Next" because `nz-switch` never emits the bound `change` event              |
| `version-history.spec.ts`    | The change summary shows readable input names; it prints keys such as `COMPONENTS.NUMBER_FIELD.TITLE`                                                 |
| `results-tabs.spec.ts`       | Input statistics count the questions inside sections; palette-created sections look like inputs, so `Section: 1` is shown instead                     |
| `project-import.spec.ts`     | An import after the results page was visited fills the new form; it opens an empty form (the results page teardown completes the shared JSON service) |
| `project-import.spec.ts`     | An imported description cannot run script; it is stored verbatim and rendered through `bypassSecurityTrustHtml`, so an `onerror` handler runs         |
| `keyboard-access.spec.ts`    | Projects can be deleted with the keyboard; the delete icon has no tab stop and focus moves on to "New Test"                                           |
| `keyboard-access.spec.ts`    | The language menu opens with Enter or Space; the dropdown reacts to hover only                                                                        |
| `preferences.spec.ts`        | The version label is translated in Hungarian; the `VERSION` key is missing from both translation files, so the key is shown                           |
| `responsive.spec.ts`         | The first component can be added on windows up to 1200px wide; the stacked layout gives the empty form a zero-height drop area                        |
| `field-tooltips.spec.ts`     | The Range Picker and Time Picker previews show an info icon with the tooltip; they render an empty span because the components lack the icon module   |
| `field-required.spec.ts`     | A Time Picker can be marked required with a message; ticking "Is it required?" throws because the message input is bound to a translated label        |
| `field-required.spec.ts`     | A Text Area can be marked required and saved; its dialog has no field for the mandatory required message, so Save stays disabled                      |
| `field-required.spec.ts`     | Clearing the last choice in a required Checkbox group shows the configured message; the preview shows no error                                        |
| `field-defaults.spec.ts`     | A default chosen for a Range Picker appears in the preview; the dialog offers a single-date picker, so the range picker throws and stays empty        |
| `date-time-fields.spec.ts`   | Changing a time format to 12-hour format preserves an afternoon value; changing the format clears it                                                  |
| `date-time-fields.spec.ts`   | Date and time pickers with saved bounds open after reopening; the restored bounds are strings and date/time comparisons throw                         |

Invalid import files are rejected without any message in the UI: the app only throws an
uncaught error. `project-import.spec.ts` therefore accepts either that error or visible
feedback, and asserts that the dashboard stays usable.

The same Range Picker default input logs "The input date type is not supported" when the
settings of a range picker that already has an answer are opened. `field-required.spec.ts`
therefore checks a range picker's persisted required setting through its preview instead.

## Targeted runs and artifacts

Run one spec by passing its path, for example:

```sh
npm run test:e2e -- tests/component-editor.spec.ts --workers=2
```

Failure screenshots, videos, and downloaded JSON are stored in `test-results/`.
Open the HTML report with `npx playwright show-report` after a normal run.
