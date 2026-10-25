import type { CodeEditorData } from '@app/shared/interfaces/code-editor.interface';
import type { FormInputData } from '@interfaces/form-input-data';
import type { LayoutEnum } from '@pages/edit/interfaces/layout-enum';
import type { translateComponentType } from '../config/edit-data-config';

export interface SectionList {
  sectionId: string;
  layout: LayoutEnum;
  sectionInputs: FormInputData[];
  type: keyof typeof translateComponentType;

  data: {
    id: string;
    sectionId: string;
  };

  customTitle?: string;
  codeEditor: CodeEditorData;
  reorderEnabled: boolean;
}

export interface RepeatedSectionList extends SectionList {
  repeatByOther: boolean;
  repeatTimes: number | undefined;
  referencableInputs: string[];
  referencedInput: SectionList['customTitle'];
}
