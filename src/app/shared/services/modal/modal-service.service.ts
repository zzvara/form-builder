import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { Injectable } from '@angular/core';
import { InputData } from '@interfaces/input-data';
import { ModalData } from '@interfaces/modal-data';
import { TranslateService } from '@ngx-translate/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalServiceService<T, D extends InputData, E extends AbstractEditForm<T, D>> {
  constructor(
    private modal: NzModalService,
    private translate: TranslateService
  ) {}

  openModal(modalData: ModalData<D, E>): Observable<boolean | undefined> {
    return this.openModalAndGet<boolean>(modalData);
  }

  openModalAndGet<RetType>(
    modalData: ModalData<D, E>,
    dataGetter: ((instance: E) => RetType) | null = null
  ): Observable<RetType | undefined> {
    // Get the translated button labels
    const closeLabel = this.translate.instant('GENERAL.CANCEL');
    const resetLabel = this.translate.instant('RESET');
    const saveLabel = this.translate.instant('SAVE');
    const templateLabel = this.translate.instant('Save as Template');

    const modal = this.modal.create<E, D>({
      nzTitle: modalData.modalTitle,
      nzContent: modalData.modalContent,
      nzData: modalData.modalData,
      nzWidth: '600px',
      nzFooter: [
        {
          label: closeLabel,
          shape: 'round',
          onClick: () => {
            modal.close();
          },
        },
        {
          label: resetLabel,
          shape: 'round',
          type: 'dashed',
          onClick: (editComponentInstance?: E) => {
            editComponentInstance?.onReset();
          },
        },
        {
          label: templateLabel,
          shape: 'round',
          type: 'dashed',
          onClick: (editComponentInstance?: E) => {
            editComponentInstance?.onReset();
          },
        },
        {
          label: saveLabel,
          type: 'primary',
          disabled: (editComponentInstance?: E) => {
            //TODO: this gets called dozens of times with each change in the embedded component (could cause performance issues)
            return editComponentInstance?.isInvalid ?? true;
          },

          onClick: (editComponentInstance?: E): NzSafeAny | Promise<NzSafeAny> => {
            const saveSuccess = editComponentInstance?.onSave();
            if (editComponentInstance && dataGetter) {
              modal.close(dataGetter(editComponentInstance));
            } else {
              modal.close(saveSuccess);
            }
          },
        },
      ],
    });

    return modal.afterClose.asObservable();
  }
}
