# Running Playwright UI tests

Run all commands from the repository root (the directory containing this guide and `package.json`).
The examples use Windows PowerShell. On macOS or Linux, use `npm` and `npx` instead of `npm.cmd` and `npx.cmd`.

## Setup

Install the project dependencies:

```powershell
npm.cmd ci
```

For Playwright, install the Chromium browser used by this project's configuration:

```powershell
npx.cmd playwright install chromium
```

## Playwright UI tests

Playwright interacts with the application in a real browser. The configuration in
`playwright.config.ts` runs Chromium tests from `tests/`. Currently, `test01.spec.ts`
checks the questionnaire creation flow.

The generated examples in `e2e/` and `tests-examples/` test Playwright's own websites.
They are outside the configured test directory and are not included in the commands below.

### Prepare the application

Build the application before running Playwright:

```powershell
npm.cmd run build
```

Playwright starts a server for `dist/form-builder/browser` on `http://localhost:4200`.
Rebuild after application changes when testing this built version.

For local runs, Playwright reuses an existing server on port 4200. You can therefore run
`npm.cmd start` in another terminal to test the development version. Make sure any server
already using that port is serving this application.

### Run headlessly (default)

```powershell
npx.cmd playwright test
```

This is still a UI test: the browser runs without a visible window. Results appear in the terminal.

### Watch the browser perform the test

```powershell
npx.cmd playwright test --headed
```

### Pause and step through the test

```powershell
npx.cmd playwright test --debug
```

This opens the browser and Playwright Inspector for stepping through test actions.

### Use the interactive test interface

```powershell
npx.cmd playwright test --ui
```

Use UI mode to select and rerun tests and inspect their actions and results.

### Open the HTML report

After a regular test run:

```powershell
npx.cmd playwright show-report
```

Select a test in the report to inspect its result and attachments. The current configuration
records videos for test runs. Traces are recorded on the first retry; local runs have no
automatic retries by default.
