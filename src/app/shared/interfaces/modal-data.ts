import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { Type } from '@angular/core';
import { InputData } from '@interfaces/input-data';

export interface ModalData<D extends InputData, E extends AbstractEditForm<any, D>> {
  modalTitle: string;
  modalContent: Type<E>;
  modalData: D;
}
