import {inject, Injectable} from '@angular/core';
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {NzModalService} from "ng-zorro-antd/modal";
import {Observable} from "rxjs";
import {AbstractEditForm} from "../../shared/abstract-classes/abstract-edit-form";
import {InputData} from "../../shared/interfaces/input-data";
import {ModalData} from "../../shared/interfaces/modal-data";

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService<T, D extends InputData, E extends AbstractEditForm<T, D>> {
  private readonly modal = inject(NzModalService);

  constructor() { }

  openModal(modalData: ModalData<D, E>): Observable<boolean | undefined> {
    return this.openModalAndGet<boolean>(modalData);
  }

  openModalAndGet<RetType>(modalData: ModalData<D, E>, dataGetter: ((instance: E) => RetType) | null = null): Observable<RetType | undefined> {
    const modal = this.modal.create<E, D>({
      nzTitle: modalData.modalTitle,
      nzContent: modalData.modalContent,
      nzData: modalData.modalData,
      nzFooter: [{
          label: "Close",
          shape: "round",
          onClick: () => {
            modal.close();
          }
        }, {
          label: "Reset",
          shape: "round",
          type: "dashed",
          onClick: (editComponentInstance?: E) => {
            editComponentInstance?.onReset();
          }
      },{
          label: "Save",
          type: "primary",
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
          }
      }
      ]
    });
    return modal.afterClose.asObservable();
  }
}
