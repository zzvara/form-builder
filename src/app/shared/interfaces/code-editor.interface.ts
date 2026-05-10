import { CodeEditorVariableType } from '../enums/code-editor.enum';

export interface CodeEditorData {
  enabled: boolean;
  data?: {
    isValid: boolean;
    code: string;
    variables: CodeEditorVariable[];
  };
}

export interface CodeEditorVariable {
  elementId: string;
  title: string;
  type: CodeEditorVariableType;
}

export interface CodeEditorError {
  from: number;
  to: number;
  code: string;
  reason: string;
  a?: string;
  b?: string;
  c?: string;
  d?: string;
}
