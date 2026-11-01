import { expect, test as base } from '@playwright/test';

export { expect };

interface Fixtures {
  /**
   * Uncaught exceptions and console errors raised by the app during the test. A test fails when
   * any remain at the end, so a test that deliberately provokes one must consume it first,
   * for example `expect(appErrors.splice(0)).toEqual([...])`.
   */
  appErrors: string[];
}

export const test = base.extend<Fixtures>({
  appErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        // Failed requests (for example the flag-icons CDN) say nothing about the app itself.
        if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
          errors.push(message.text());
        }
      });
      await use(errors);
      expect(errors, 'The app reported unexpected errors').toEqual([]);
    },
    { auto: true },
  ],
});
