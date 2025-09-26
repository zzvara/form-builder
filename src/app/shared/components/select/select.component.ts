import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { Component } from '@angular/core';
import { SelectComponentData } from '@components/select/interfaces/select-component-data';
import { SelectEditComponent } from '@components/select/select-edit/select-edit.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  standalone: false,
})
export class SelectComponent extends AbstractFieldLikeInputs<string | string[], SelectComponentData, SelectEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.COMBOBOX.MODEL_TITLE_SELECT'),
        modalContent: SelectEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
