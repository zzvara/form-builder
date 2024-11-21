import {CdkDropList} from "@angular/cdk/drag-drop";
import {Type} from "@angular/core";
import {FormComponentMarker} from "../../../interfaces/form-component-marker";
import {FormInputData} from "../../../interfaces/form-input-data";

export interface SidebarData {
  groupName: string;
  active: boolean;
  dropListConnectedTo: () => (CdkDropList | string)[] | CdkDropList | string;
  groupContents: FormInputData<any, any>[]
}

// Így groupName-nek egyedinek kell lennie!!!
export const identifySidebarData: (index: number, item: SidebarData) => string = (_index, item) => item.groupName;
// Mivel ID-juk még nincs az inputoknak, ezért a típusuk szerint azonosítja be őket a sideBar
export const identifyGroupContents: (index: number, item: FormInputData<any, any>) => Type<FormComponentMarker> = (_index, item) => item.type;
