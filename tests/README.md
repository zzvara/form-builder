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
context. They do not seed local storage or mock application services.

## Workflow coverage

| Spec                         | Behaviors checked                                                                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test01.spec.ts`             | Questionnaire/test creation, title validation, project editing/deletion, layout persistence                                                                    |
| `component-editor.spec.ts`   | Palette filtering, settings save/cancel, inline editing, delete/reset confirmation, undo/redo, active-question validation                                      |
| `input-types.spec.ts`        | Settings, descriptions, preview rendering, and save/reopen for number, date, range, time, textarea, image, dropdown, radio, and checkbox inputs                |
| `choice-fields.spec.ts`      | Duplicate option rejection, adding/renaming/removing options, radio exclusivity, dropdown multiple selections, checked/disabled checkbox defaults, persistence |
| `field-validation.spec.ts`   | Required-text error/recovery, maximum length and character counter, multiline answers, numeric step/min/max, persistence                                       |
| `date-time-fields.spec.ts`   | Date, date-range endpoints, and time selected through picker popups and restored after reopening                                                               |
| `image-upload.spec.ts`       | File chooser upload, successful upload state, byte-for-byte download, removal                                                                                  |
| `sections-history.spec.ts`   | Named nested sections, section deletion/cancellation/undo, repeated-section count, version snapshot restoration and boundaries                                 |
| `project-info.spec.ts`       | Changing project category, deadline/time-limit controls, results summary and persistence                                                                       |
| `preferences.spec.ts`        | English/Hungarian translation and rendered light/dark theme, both across reloads                                                                               |
| `dashboard-projects.spec.ts` | Delete cancellation/persistence, saved card content, reopening projects, title sorting                                                                         |
| `project-export.spec.ts`     | Results statistics, downloaded JSON contents, import into empty storage, with/without history                                                                  |
| `palette-search.spec.ts`     | Searching by the complete displayed component label (known bug)                                                                                                |

This is workflow coverage, not an instrumented line/branch coverage percentage.
The suite currently runs desktop Chromium. Remaining gaps include mobile layouts,
Firefox/WebKit, keyboard-only flows, conditional JavaScript/variable selection,
cross-section reordering, repeated sections driven by another input, and malformed
import/error recovery. Image preview persistence and imported history restoration
are not asserted by the upload/import tests.

Shared UI actions live in `helpers/form-builder.ts`. The drag helper uses mouse
movements to exercise Angular CDK dragging. Prefer role/text locators where the
app provides useful accessible names; scope DOM selectors for unnamed controls.

## Known bugs

Two regressions reproduced against the running app are marked with `test.fail`:

- After entering a preview value, turning inline editing off and back on checks
  the toggle but leaves the question read-only and the preview disabled.
- Searching for the displayed label `Number Field` returns no results because
  palette filtering compares translation keys instead of translated labels.

Setup assertions run before each expected-failure annotation. Both tests still
execute; an unexpected pass signals that the annotation can be removed. Product
code has not been changed to resolve these bugs.

## Targeted runs and artifacts

Run one spec by passing its path, for example:

```sh
npm run test:e2e -- tests/component-editor.spec.ts --workers=2
```

Failure screenshots, videos, and downloaded JSON are stored in `test-results/`.
Open the HTML report with `npx playwright show-report` after a normal run.
