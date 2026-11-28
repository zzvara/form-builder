export enum CodeEditorVariableType {
  STRING = 'string',
  STRING_ARRAY = 'string_array',
  NUMBER = 'number',
  DATE = 'date',
  DATE_ARRAY = 'date_array',
  BOOLEAN = 'boolean',
}

export interface CodeEditorVariable {
  elementId: string;
  title: string;
  type: CodeEditorVariableType;
}

export interface ValidationRule {
  id?: string;
  type?: string;
  message?: string;
}

/**
 * Persisted conditional visibility rule using CodeMirror JavaScript expression
 */
export interface VisibilityRule {
  id: string;
  enabled: boolean;
  code: string;
  variables: CodeEditorVariable[];
}
