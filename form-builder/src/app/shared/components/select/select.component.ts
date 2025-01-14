import { Component } from '@angular/core';
import { AbstractFieldLikeInputs } from "../../abstract-classes/abstract-fieldlike-inputs";
import { SelectEditComponent } from "./select-edit/select-edit.component";
import { SelectComponentData } from "./interfaces/select-component-data";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent extends AbstractFieldLikeInputs<string | string[], SelectComponentData, SelectEditComponent> {

  title: string;

  constructor(private translate: TranslateService) {
    super();
    this.title = this.translate.instant('components.combobox.MODEL_TITLE_SELECT');
  }

  override edit(): void {
    this.modalService.openModal({
      modalTitle: this.title,
      modalContent: SelectEditComponent,
      modalData: this.data
    }).subscribe(this.defaultOnEditSubscribeEvent);
  }
}
