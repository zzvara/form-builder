// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Enforces directive naming convention:
      // - Must be used as an attribute (e.g. <div appHighlight>)
      // - Must start with "app" prefix to avoid collisions with native/3rd-party attributes
      // - camelCase keeps it readable in templates
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],

      // Enforces component selector naming:
      // - Must be used as a custom HTML element (e.g. <app-user-card>)
      // - Prefix ensures uniqueness across the app
      // - kebab-case aligns with HTML standards for custom elements
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      // Warns about unused variables (common source of bugs / leftover code)
      // Ignores variables starting with "_" → useful for intentionally unused params
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],

      // Ensures type-only imports are explicitly marked with "import type"
      // Helps with tree-shaking and avoids accidental runtime imports
      '@typescript-eslint/consistent-type-imports': 'warn',

      // Discourages use of "any" since it disables type safety
      // Kept as warning because sometimes unavoidable (e.g. external libs)
      '@typescript-eslint/no-explicit-any': 'warn',

      // Disabled because TypeScript can infer return types well
      // Enforcing this everywhere would add noise without much benefit
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Warns if lifecycle hooks (e.g. ngOnInit) are declared but empty
      // Helps remove boilerplate / unused code
      '@angular-eslint/no-empty-lifecycle-method': 'warn',

      // Enforces implementing lifecycle interfaces (e.g. OnInit)
      // Improves type safety and prevents typos in lifecycle method names
      '@angular-eslint/use-lifecycle-interface': 'warn',

      // Enforces usage of standalone components/directives/pipes
      // Ensures modern Angular architecture and avoids mixing NgModules unintentionally
      '@angular-eslint/prefer-standalone': 'error'
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // Prevents negating async pipe results directly (e.g. !(obs$ | async))
      // Can lead to multiple subscriptions and confusing template behavior
      '@angular-eslint/template/no-negated-async': 'error'
    },
  },
]);
