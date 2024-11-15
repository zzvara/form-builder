import {Component, inject} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {UpdateOnStrategy} from "../../interfaces/update-on-strategy";
import {SelectEditComponent} from "./select-edit/select-edit.component";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {ModalServiceService} from "../../../services/modal/modal-service.service";
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
      modalData: {
        questionValue:    this.data.questionValue,
        descriptionValue: this.data.descriptionValue,
        selectOptions:    this.data.selectOptions,
        defaultValue:     this.data.defaultValue,
        placeholderValue: this.data.placeholderValue,
        isMultipleChoice: this.data.isMultipleChoice,
        showTooltip:      this.data.showTooltip,
        tooltipText:      this.data.tooltipText,
        required:         this.data.required,
        requiredMessage:  this.data.requiredMessage,
      }
    }).subscribe(result => {
      if (result) {
        this.data.selectOptions = result.selectOptions;
        this.data.questionValue = result.questionValue;
        this.data.descriptionValue = result.descriptionValue;
        if (!result.defaultValue) {
          if (result.isMultipleChoice) {
            this.data.defaultValue = [];
          } else {
            this.data.defaultValue = "";
          }
        } else {
          this.data.defaultValue = result.defaultValue;
        }
        this.data.placeholderValue = result.placeholderValue;
        this.data.isMultipleChoice = result.isMultipleChoice;
        this.onEdit(result);
      }
    });
  }
}
