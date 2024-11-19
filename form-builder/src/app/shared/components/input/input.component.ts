import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {ErrorType} from "../../helpers/error-helper";
import {InputEditComponent} from "./input-edit/input-edit.component";
import {InputComponentData} from "./interfaces/input-component-data";

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent extends AbstractFieldLikeInputs<InputComponentData, InputEditComponent<InputComponentData>, string> {
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

  override errorList(): ErrorType[] {
    return super.errorList().concat([{
      errorName: "minlength",
      errorMessage: this.data.minLengthMessage!.replace("{*}", String(this.data.minLengthNumber!)),
    }]);
  }
}
