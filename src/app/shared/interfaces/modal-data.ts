import type { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import type { Type } from '@angular/core';
import type { InputData } from '@interfaces/input-data';

export interface ModalData<D extends InputData, E extends AbstractEditForm<any, D>> {
  modalTitle: string;
  modalContent: Type<E>;
  modalData: D;
}
