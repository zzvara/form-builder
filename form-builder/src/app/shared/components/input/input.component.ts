import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {InputEditComponent} from "./input-edit/input-edit.component";
import {InputComponentData} from "./interfaces/input-component-data";

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent extends AbstractFieldLikeInputs<InputComponentData, InputEditComponent, string> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: InputEditComponent,
      modalData: this.data
    }).subscribe(result => {
      if (result) {
        this.onEdit(this.data);
      }
    });
  }

  override errorList(): { validatorName: string; validationMessage: string }[] {
    return super.errorList().concat([{
      validatorName: "minlength",
      validationMessage: this.data.minLengthMessage!.replace("{*}", String(this.data.minLengthNumber!)),
    }]);
  }
}
