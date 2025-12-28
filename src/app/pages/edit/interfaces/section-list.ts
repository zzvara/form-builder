import { CodeEditorData } from '@app/shared/interfaces/code-editor.interface';
import { FormInputData } from '@interfaces/form-input-data';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';

export interface SectionList {
  sectionId: string;
  layout: LayoutEnum;
  reorderEnabled: boolean;
  sectionInputs: FormInputData[];

  data: {
    id: string;
    sectionId: string;
  };

  customTitle?: string;
  codeEditor: CodeEditorData;
}
