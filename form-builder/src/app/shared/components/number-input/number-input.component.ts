import {Component, EventEmitter, inject, Input, Output, TemplateRef} from '@angular/core';
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {InputEditComponent} from "../input/input-edit/input-edit.component";
import {InputComponentData} from "../input/interfaces/input-component-data";
import {NumberInputComponentData} from "./interfaces/number-input-component-data";
import {NumberInputEditComponent} from "./number-input-edit/number-input-edit.component";

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent extends AbstractInput<NumberInputComponentData, number> {
  private readonly modalService: ModalServiceService<NumberInputEditComponent, NumberInputComponentData> = inject(ModalServiceService);

  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: NumberInputEditComponent,
      modalData: {
        questionValue: this.questionValue,
        descriptionValue: this.descriptionValue,
        defaultValue: this.defaultValue,
        placeholderValue: this.placeholderValue,
      }
    }).subscribe(result => {
      if (result) {
        this.questionValue = result.questionValue;
        this.descriptionValue = result.descriptionValue;
        this.defaultValue = result.defaultValue;
        this.placeholderValue = result.placeholderValue;
        this.onEdit(result);
      }
    });
  }
}
