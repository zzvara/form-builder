import {Type} from "@angular/core";
import {AbstractEditForm} from "../abstract-classes/abstract-edit-form";
import {InputData} from "./input-data";

export interface ModalData<D extends InputData, E extends AbstractEditForm<any, D>> {
  modalTitle: string;
  modalContent: Type<E>;
  modalData: D;
}
