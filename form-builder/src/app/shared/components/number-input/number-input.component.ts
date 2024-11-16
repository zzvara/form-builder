import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {NumberInputComponentData} from "./interfaces/number-input-component-data";
import {NumberInputEditComponent} from "./number-input-edit/number-input-edit.component";

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent extends AbstractFieldLikeInputs<NumberInputComponentData, NumberInputEditComponent, number> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: NumberInputEditComponent,
      modalData: this.data
    }).subscribe(result => {
      if (result) {
        this.onEdit(this.data);
      }
    });
  }
}
