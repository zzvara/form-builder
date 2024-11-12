import {Component, inject, TemplateRef} from '@angular/core';
import {SelectEditComponent} from "./select-edit/select-edit.component";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {SelectComponentData} from "./interfaces/select-component-data";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent extends AbstractInput<SelectComponentData, string | string[]> {
  private readonly modalService: ModalServiceService<SelectEditComponent, SelectComponentData> = inject(ModalServiceService);

  selectOptions: string[] = [];
  isMultipleChoice: boolean = false;

  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Select Component Settings',
      modalContent: SelectEditComponent,
      modalData: {
        questionValue: this.questionValue,
        descriptionValue: this.descriptionValue,
        selectOptions: this.selectOptions,
        defaultValue: this.defaultValue,
        placeholderValue: this.placeholderValue,
        isMultipleChoice: this.isMultipleChoice
      }
    }).subscribe(result => {
      if (result) {
        this.selectOptions = result.selectOptions;
        this.questionValue = result.questionValue;
        this.descriptionValue = result.descriptionValue;
        if (!result.defaultValue) {
          if (result.isMultipleChoice) {
            this.defaultValue = [];
          } else {
            this.defaultValue = "";
          }
        } else {
          this.defaultValue = result.defaultValue;
        }
        this.placeholderValue = result.placeholderValue;
        this.isMultipleChoice = result.isMultipleChoice;
        this.onEdit(result);
      }
    });
  }
}
