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
export class ModalServiceService<T extends AbstractEditForm<D>, D extends InputData<any>> {
  private readonly modal = inject(NzModalService);

  constructor() { }

  openModal<RetType extends D>(component: ModalData<T, D>): Observable<RetType | undefined> {
    const modal = this.modal.create<T,D,RetType>({
      nzTitle: component.modalTitle,
      nzContent: component.modalContent,
      nzData: component.modalData,
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
          onClick: (contentComponentInstance?: T) => {
            contentComponentInstance?.onReset();
          }
      },{
          label: "Save",
          type: "primary",
          disabled: (contentComponentInstance?: T) => {
            //TODO: this gets called dozens of times with each change in the embedded component (could cause performance issues)
            return contentComponentInstance?.isInvalid() ?? true;
          },
          onClick: (contentComponentInstance?: T): NzSafeAny | Promise<NzSafeAny> => {
              if (contentComponentInstance?.isPristine()) {
                modal.close();
              } else {
                modal.close(contentComponentInstance?.getFormData() as RetType);
              }
          }
      }
      ]
    });
    return modal.afterClose.asObservable();
  }
}
