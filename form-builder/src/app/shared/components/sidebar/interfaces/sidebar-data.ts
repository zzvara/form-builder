import { CdkDropList } from '@angular/cdk/drag-drop';
import { Type } from '@angular/core';
import { FormComponentMarker } from '@shared/interfaces/form-component-marker';
import { FormInputData } from '@shared/interfaces/form-input-data';

export interface SidebarData {
  groupName: string;
  active: boolean;
  dropListConnectedTo: () => (CdkDropList | string)[] | CdkDropList | string;
  groupContents: FormInputData[];
}

// Így groupName-nek egyedinek kell lennie!!!
export const identifySidebarData: (index: number, item: SidebarData) => string = (_index, item) => item.groupName;
// Mivel ID-juk még nincs az inputoknak, ezért a típusuk szerint azonosítja be őket a sideBar
export const identifyGroupContents: (index: number, item: FormInputData<any>) => Type<FormComponentMarker> = (_index, item) => item.type;
