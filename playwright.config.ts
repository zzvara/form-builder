/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env['PLAYWRIGHT_PORT'] ?? 4200);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI']
    ? [
        ['github'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'playwright-report/results.json' }],
      ]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL,
    video: 'on',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  webServer: {
    command: `npm run serve:e2e -- --listen ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
