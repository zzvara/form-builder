import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { Component } from '@angular/core';
import { SelectComponentData } from '@components/select/interfaces/select-component-data';
import { SelectEditComponent } from '@components/select/select-edit/select-edit.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  standalone: false,
})
export class SelectComponent extends AbstractFieldLikeInputs<string | string[], SelectComponentData, SelectEditComponent> {
  title: string;

  constructor(private readonly translate: TranslateService) {
    super();
    this.title = this.translate.instant('components.combobox.MODEL_TITLE_SELECT');
  }

  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.title,
        modalContent: SelectEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
