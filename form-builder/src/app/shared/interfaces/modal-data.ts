import {Type} from "@angular/core";
import {AbstractEditForm} from "../abstract-classes/abstract-edit-form";
import {InputData} from "./input-data";

export interface ModalData<T extends AbstractEditForm<D, any>, D extends InputData<any>> {
  modalTitle: string;
  modalContent: Type<T>;
  modalData: D;
}
