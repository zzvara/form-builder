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

## Unit tests

Unit tests use Jasmine and Karma and are located in `src/` files ending in `.spec.ts`.
Run the tests once in headless Chrome:

```powershell
npm.cmd test -- --watch=false --browsers=ChromeHeadless
```

To keep the test runner open and rerun tests when files change, use:

```powershell
npm.cmd test
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

## GitHub Actions

The **CI Pipeline** workflow in `.github/workflows/CI.yml` runs on pull requests targeting
`main`, pushes to `main`, and manual runs from GitHub's **Actions** tab.

The build job installs dependencies with `npm ci`, builds the application, and uploads it.
The **Playwright UI tests** job downloads that build, installs Chromium and its Linux
dependencies, and runs `npm run test:e2e`. Playwright starts the locked local server with
`npm run serve:e2e -- --listen 4200`; no separate running development server is needed.

CI uses one browser worker, retries failures up to twice, and starts a fresh server on port
4200 by default. Set the `PLAYWRIGHT_PORT` environment variable to use another port when
reproducing CI locally alongside a running development server. The questionnaire test
allows two minutes per attempt, including its deliberate waits.

After a run, open **Actions → CI Pipeline → the workflow run → Artifacts** to download:

- `playwright-report`: the HTML report, including test attachments.
- `playwright-test-results`: videos, failure screenshots, and traces from the first retry.

Reports and test artifacts are retained for 30 days and uploaded even when tests fail,
provided the run was not cancelled and the files were produced.

Lint and formatting run in a separate job, so existing lint failures do not prevent the
browser tests from running. They still make the overall workflow fail and block the
existing automatic version-bump job, which requires both quality checks and UI tests to pass.
