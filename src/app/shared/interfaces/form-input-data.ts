import type { translateComponentType } from '@pages/edit/config/edit-data-config';
import type { InputData } from '@interfaces/input-data';
import type { CodeEditorData } from './code-editor.interface';

export interface FormInputData<D extends InputData = InputData> {
  title: string;
  questionPlaceholder?: string;
  descriptionPlaceholder?: string;
  type: keyof typeof translateComponentType;
  data: D | null;

  customTitle?: string;
  codeEditor: CodeEditorData;
}
