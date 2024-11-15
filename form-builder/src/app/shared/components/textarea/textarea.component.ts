import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {TextareaComponentData, TextareaComponentEditData} from "./interfaces/textarea-component-data";
import {TextareaEditComponent} from "./textarea-edit/textarea-edit.component";

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
})
export class TextareaComponent extends AbstractFieldLikeInputs<TextareaComponentData, TextareaEditComponent, string> {
  override edit(): void {
    this.modalService.openModal<TextareaComponentEditData>({
      modalTitle: 'Edit Text Area Component Settings',
      modalContent: TextareaEditComponent,
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
        this.defaultValueSetter(result)
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
}
