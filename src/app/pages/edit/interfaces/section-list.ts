import { CodeEditorData } from '@app/shared/interfaces/code-editor.interface';
import { FormInputData } from '@interfaces/form-input-data';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';
import { translateComponentType } from '../config/edit-data-config';

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
  codeEditor: CodeEditorData
  reorderEnabled: boolean;
}

export interface RepeatedSectionList extends SectionList {
  repeatByOther: boolean;
  repeatTimes: number | undefined;
  referencableInputs: string[];
  referencedInput: SectionList['customTitle'];
}
