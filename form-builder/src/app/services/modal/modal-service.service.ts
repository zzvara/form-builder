import {inject, Injectable} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {ModalData} from "../../shared/interfaces/modal-data";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {AbstractEditForm} from "../../shared/abstract-classes/abstract-edit-form";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService<T extends AbstractEditForm<D>, D> {
  private readonly modal = inject(NzModalService);

  constructor() { }

  openModal(component: ModalData<T, D>): Observable<D | undefined> {
    const modal = this.modal.create<T,D,D>({
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
                modal.close(contentComponentInstance?.getFormData());
              }
          }
      }
      ]
    });
    return modal.afterClose.asObservable();
  }
}
