import {CdkDropList} from "@angular/cdk/drag-drop";
import {FormInputData} from "../../../interfaces/form-input-data";

export interface SidebarData {
  groupName: string;
  active: boolean;
  dropListConnectedTo: () => (CdkDropList | string)[] | CdkDropList | string;
  groupContents: FormInputData<any, any>[]
}
