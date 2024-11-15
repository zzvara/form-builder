import {Component, inject} from '@angular/core';
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {AbstractInput} from "../../abstract-classes/abstract-input";
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
      modalData: {
        questionValue:    this.data.questionValue,
        descriptionValue: this.data.descriptionValue,
        defaultValue:     this.data.defaultValue,
        placeholderValue: this.data.placeholderValue,
        showTooltip:      this.data.showTooltip,
        tooltipText:      this.data.tooltipText,
        required:         this.data.required,
        requiredMessage:  this.data.requiredMessage,
      }
    }).subscribe(result => {
      if (result) {
        this.defaultValueSetter(result)
        this.onEdit(result);
      }
    });
  }
}
