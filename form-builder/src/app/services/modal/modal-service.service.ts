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
export class ModalServiceService<T extends AbstractEditForm<D, any>, D extends InputData<any>> {
  private readonly modal = inject(NzModalService);

  constructor() { }

  openModal(modalData: ModalData<T, D>): Observable<boolean | undefined> {
    return this.openModalAndGet<boolean>(modalData);
  }

  openModalAndGet<RetType>(modalData: ModalData<T, D>, dataGetter: ((instance: T) => RetType) | null = null): Observable<RetType | undefined> {
    const modal = this.modal.create<T,D>({
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
          onClick: (editComponentInstance?: T) => {
            editComponentInstance?.onReset();
          }
      },{
          label: "Save",
          type: "primary",
          disabled: (editComponentInstance?: T) => {
            //TODO: this gets called dozens of times with each change in the embedded component (could cause performance issues)
            return editComponentInstance?.isInvalid ?? true;
          },
          onClick: (editComponentInstance?: T): NzSafeAny | Promise<NzSafeAny> => {
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
