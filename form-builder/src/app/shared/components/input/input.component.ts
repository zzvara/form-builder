import {Component, inject} from '@angular/core';
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {InputEditComponent} from "./input-edit/input-edit.component";
import {InputComponentData} from "./interfaces/input-component-data";
import {HasValidation} from "../../interfaces/has-validation";
import {AbstractControl} from "@angular/forms";

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent extends AbstractInput<InputComponentData, string> implements HasValidation<string>{
  private readonly modalService: ModalServiceService<InputEditComponent, InputComponentData> = inject(ModalServiceService);

  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: InputEditComponent,
      modalData: {
        questionValue:        this.data.questionValue,
        descriptionValue:     this.data.descriptionValue,
        defaultValue:         this.data.defaultValue,
        placeholderValue:     this.data.placeholderValue,
        required:             this.data.required,
        requiredMessage:      this.data.requiredMessage,
        minLength:            this.data.minLength,
        minLengthNumber:      this.data.minLengthNumber,
        minLengthMessage:     this.data.minLengthMessage,
        maxLength:            this.data.maxLength,
        maxLengthNumber:      this.data.maxLengthNumber,
        showCharacterCounter: this.data.showCharacterCounter,
        changeDetection:      this.data.changeDetection,
      }
    }).subscribe(result => {
      if (result) {
        this.defaultValueSetter(result);
        this.data.required             = result.required;
        if (result.required) {
          this.data.requiredMessage    = result.requiredMessage;
        }
        this.data.minLength            = result.minLength;
        if (result.minLength) {
          this.data.minLengthNumber    = result.minLengthNumber;
          this.data.minLengthMessage   = result.minLengthMessage;
        }
        this.data.maxLength            = result.maxLength;
        if (result.maxLength) {
          this.data.maxLengthNumber      = result.maxLengthNumber;
          this.data.showCharacterCounter = result.showCharacterCounter;
        }
        this.data.changeDetection      = result.changeDetection;
        this.onEdit(result);
      }
    });
  }

  getErrors(control: AbstractControl<string>): string {
    return [
      ["required", this.data.requiredMessage],
      ["minlength", this.data.minLengthMessage + this.data.minLengthNumber + " characters"]]
      .filter(error => control.hasError(error[0]))
      .map(error => error[1])
      .join("\n");
  }
}
