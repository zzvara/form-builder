import {CdkDropList} from '@angular/cdk/drag-drop';
import {translateComponentType} from "@pages/edit/config/edit-data-config";
import {FormInputData} from '@shared/interfaces/form-input-data';

export interface SidebarData {
  groupName: string;
  active: boolean;
  dropListConnectedTo: () => (CdkDropList | string)[] | CdkDropList | string;
  groupContents: FormInputData[];
}

// Így groupName-nek egyedinek kell lennie!!!
export const identifySidebarData: (index: number, item: SidebarData) => string = (_index, item) => item.groupName;
// Mivel ID-juk még nincs az inputoknak, ezért a típusuk szerint azonosítja be őket a sideBar
export const identifyGroupContents: (index: number, item: FormInputData<any>) => keyof typeof translateComponentType = (_index, item) => item.type;
