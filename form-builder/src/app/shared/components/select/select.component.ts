import {Component, inject, TemplateRef} from '@angular/core';
import {SelectEditComponent} from "./select-edit/select-edit.component";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {SelectData} from "./interfaces/select-data";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent extends AbstractInput {
  private readonly modalService: ModalServiceService<SelectEditComponent, SelectData> = inject(ModalServiceService);

  inputPlaceholder: string = 'Select input value';
  inputTemplate!: TemplateRef<any>;

  selectOptions: string[] = [];
  defaultSelectValue: string | string[] = "";
  placeholderValue: string = "";
  isMultipleChoice: boolean = false;

  edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Select Component Settings',
      modalContent: SelectEditComponent,
      modalData: {
        selectOptions: this.selectOptions,
        defaultSelectValue: this.defaultSelectValue,
        placeholderValue: this.placeholderValue,
        isMultipleChoice: this.isMultipleChoice
      }
    }).subscribe(result => {
      if (result) {
        this.selectOptions = result.selectOptions;
        if (!result.defaultSelectValue) {
          if (result.isMultipleChoice) {
            this.defaultSelectValue = [];
          } else {
            this.defaultSelectValue = "";
          }
        } else {
          this.defaultSelectValue = result.defaultSelectValue;
        }
        this.placeholderValue = result.placeholderValue;
        this.isMultipleChoice = result.isMultipleChoice;
      }
    })
  }
}
