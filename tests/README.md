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
| `test01.spec.ts`                 | Questionnaire/test creation, title validation, project editing/deletion, layout persistence                                                                    |
| `component-editor.spec.ts`       | Palette filtering, settings save/cancel, inline editing, delete/reset confirmation, undo/redo, active-question validation                                      |
| `component-naming.spec.ts`       | Variable-name rules (invalid, reserved, empty, duplicate), cancelling a rename, persistence, names inside sections                                             |
| `used-components.spec.ts`        | "Used Components" order, drag-reordering, scroll-to-question, draft and incomplete-question markers                                                            |
| `input-types.spec.ts`            | Settings, descriptions, preview rendering, and save/reopen for number, date, range, time, textarea, image, dropdown, radio, and checkbox inputs                |
| `choice-fields.spec.ts`          | Duplicate option rejection, adding/renaming/removing options, radio exclusivity, dropdown multiple selections, checked/disabled checkbox defaults, persistence |
| `field-validation.spec.ts`       | Required-text error/recovery, maximum length and character counter, multiline answers, numeric step/min/max, persistence                                       |
| `date-time-fields.spec.ts`       | Date, date-range endpoints, and time selected through picker popups and restored after reopening                                                               |
| `image-upload.spec.ts`           | File chooser upload, successful upload state, byte-for-byte download, removal                                                                                  |
| `conditions.spec.ts`             | JavaScript conditions: variable picker, syntax/type/runtime error messages, saved condition icon and tooltip, persistence, section conditions                  |
| `sections-history.spec.ts`       | Named nested sections, section deletion/cancellation/undo, repeated-section count, version snapshot restoration and boundaries                                 |
| `section-editing.spec.ts`        | Vertical/horizontal section layout, moving a question between sections, reorder lock                                                                           |
| `repeated-section-input.spec.ts` | Repeating a section by a named number/checkbox input, which inputs are offered, required-reference validation, invalid reference after reordering              |
| `stepper-navigation.spec.ts`     | Step guards (title, at least one question), data kept when stepping back, last step named after the project type                                               |
| `version-history.spec.ts`        | Previous/Next Version buttons, history boundaries, change-summary dialog                                                                                       |
| `project-info.spec.ts`           | Changing project category, deadline/time-limit controls, results summary, rich-text description formatting, persistence                                        |
| `results-tabs.spec.ts`           | Input statistics by type, read-only Project JSON and Project History tabs                                                                                      |
| `preferences.spec.ts`            | English/Hungarian translation and rendered light/dark theme across reloads, the Hungarian editor flow without leaked translation keys                          |
| `dashboard-projects.spec.ts`     | Delete cancellation/persistence in list and card view, saved card content, reopening projects, title sorting, empty-state creation buttons                     |
| `project-export.spec.ts`         | Results statistics, downloaded JSON contents, import into empty storage, with/without history                                                                  |
| `project-import.spec.ts`         | Rejected files (invalid JSON, no project, wrong type) and recovery, import after visiting the results page, script in an imported description                  |
| `keyboard-access.spec.ts`        | Enter/Space on the layout toggle, opening a project, submitting the form and returning home with the keyboard, delete and language controls                    |
| `responsive.spec.ts`             | Phone dashboard cards, repeated-section settings drawer after narrowing the window, empty form drop area on narrow windows                                     |
| `palette-search.spec.ts`         | Searching by the complete displayed component label (known bug)                                                                                                |

This is workflow coverage, not an instrumented line/branch coverage percentage.
The suite runs desktop Chromium; individual tests resize the viewport for phone and
narrow-window layouts. Remaining gaps include Firefox/WebKit, touch dragging, date,
range and string-array variables in conditions, sorting by the date columns,
pagination beyond one page of projects, and image preview persistence. History stored in
an exported file is not restored by an import (the imported project starts at
VERSION 1); that behavior is observed but not asserted.

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
- `renameComponent`, `openSettings`, `addSection`, and `tooltip` cover the inline
  name editor, settings dialogs, sections, and ng-zorro tooltips.

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
| `palette-search.spec.ts`     | Searching for `Number Field` finds it; palette filtering compares translation keys, so there are no results                                           |
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

Invalid import files are rejected without any message in the UI: the app only throws an
uncaught error. `project-import.spec.ts` therefore accepts either that error or visible
feedback, and asserts that the dashboard stays usable.

## Targeted runs and artifacts

Run one spec by passing its path, for example:

```sh
npm run test:e2e -- tests/component-editor.spec.ts --workers=2
```

Failure screenshots, videos, and downloaded JSON are stored in `test-results/`.
Open the HTML report with `npx playwright show-report` after a normal run.
