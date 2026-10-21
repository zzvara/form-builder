import type { CdkDropList } from '@angular/cdk/drag-drop';
import type { FormInputData } from '@interfaces/form-input-data';

export interface SidebarData {
  groupName: string;
  active: boolean;
  dropListConnectedTo: () => (CdkDropList | string)[] | CdkDropList | string;
  groupContents: FormInputData[];
}
