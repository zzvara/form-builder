import {AbstractEditForm} from "../abstract-classes/abstract-edit-form";
import {Type} from "@angular/core";

export interface ModalData<T extends AbstractEditForm<D>, D> {
  modalTitle: string;
  modalContent: Type<T>;
  modalData: D;
}
