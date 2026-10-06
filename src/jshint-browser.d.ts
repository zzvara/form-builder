declare module 'jshint/dist/jshint.js' {
  import type { JSHINT } from 'jshint';
  const bundle: { JSHINT: typeof JSHINT };
  export default bundle;
}
