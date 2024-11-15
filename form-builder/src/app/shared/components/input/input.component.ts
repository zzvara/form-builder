import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {InputEditComponent} from "./input-edit/input-edit.component";
import {InputComponentData, InputComponentEditData} from "./interfaces/input-component-data";

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent extends AbstractFieldLikeInputs<InputComponentData, InputEditComponent, string> {
  override edit(): void {
    this.modalService.openModal<InputComponentEditData>({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: InputEditComponent,
      modalData: {
        questionValue:        this.data.questionValue,
        descriptionValue:     this.data.descriptionValue,
        defaultValue:         this.data.defaultValue,
        placeholderValue:     this.data.placeholderValue,
        showTooltip:          this.data.showTooltip,
        tooltipText:          this.data.tooltipText,
        required:             this.data.required,
        requiredMessage:      this.data.requiredMessage,
        minLength:            this.data.minLength,
        minLengthNumber:      this.data.minLengthNumber,
        minLengthMessage:     this.data.minLengthMessage,
        maxLength:            this.data.maxLength,
        maxLengthNumber:      this.data.maxLengthNumber,
        showCharacterCounter: this.data.showCharacterCounter,
      }
    }).subscribe(result => {
      if (result) {
        this.defaultValueSetter(result);
        this.data.minLength              = result.minLength;
        if (result.minLength) {
          this.data.minLengthNumber      = result.minLengthNumber;
          this.data.minLengthMessage     = result.minLengthMessage;
        }
        this.data.maxLength              = result.maxLength;
        if (result.maxLength) {
          this.data.maxLengthNumber      = result.maxLengthNumber;
          this.data.showCharacterCounter = result.showCharacterCounter;
        }
        if (!result.setDefaultValue) {
          this.data.defaultValue = undefined;
        }
        this.onEdit(result);
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
