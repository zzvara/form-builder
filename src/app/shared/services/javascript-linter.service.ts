import { Injectable } from '@angular/core';
import type { LintError, LintOptions } from 'jshint';
import type * as JSHintBrowser from 'jshint/dist/jshint.js';

/**
 * Loads the JavaScript editor's linter on demand and isolates its mutable API.
 *
 * JSHint was already used to validate user-authored JavaScript in the editor.
 * We retain it to preserve the existing lint options and diagnostic codes
 * (including the editor's distinction between errors and warnings). Replacing
 * the lint engine would require a separate review of those validation rules.
 * JSHint checks code; execution remains the code-runner worker's responsibility.
 *
 * The editor's original `import { JSHINT } from 'jshint'` pulled in the Node.js
 * entry point. Running `npm run build` failed in console-browserify/index.js:
 *   Could not resolve "util"   (require("util"), line 2)
 *   Could not resolve "assert" (require("assert"), line 3)
 * These are Node built-ins that the browser build could not resolve. Importing
 * `jshint/dist/jshint.js` selects the standalone browser bundle and fixes those
 * errors without adding global scripts to angular.json.
 *
 * Lazy loading is a separate optimization: it defers downloading JSHint until
 * JavaScript validation is requested; it is not required to fix the build errors.
 */
@Injectable({ providedIn: 'root' })
export class JavaScriptLinterService {
  // The root service shares one in-flight import across all editor instances.
  private module?: Promise<typeof JSHintBrowser>;

  async lint(code: string, options: LintOptions): Promise<LintError[]> {
    const { default: bundle } = await (this.module ??= import('jshint/dist/jshint.js').catch((error) => {
      // Let a later validation attempt retry loading instead of caching a rejection.
      this.module = undefined;
      throw error;
    }));
    // The standalone browser bundle exposes JSHINT through a CommonJS default export.
    const { JSHINT } = bundle;
    JSHINT(code, options);
    // Copy results before yielding: another editor's call replaces JSHINT.errors.
    return JSHINT.errors.filter(Boolean).map((error) => ({ ...error }));
  }
}
