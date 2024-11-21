import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {SelectEditComponent} from "./select-edit/select-edit.component";
import {SelectComponentData} from "./interfaces/select-component-data";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent extends AbstractFieldLikeInputs<SelectComponentData, SelectEditComponent, string | string[]> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Select Component Settings',
      modalContent: SelectEditComponent,
      modalData: this.data
    }).subscribe(this.defaultOnEditSubscribeEvent);
  }
}
