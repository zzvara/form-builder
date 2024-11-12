import {Component, inject} from '@angular/core';
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {AbstractInput} from "../../abstract-classes/abstract-input";
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
        questionValue:    this.data.questionValue,
        descriptionValue: this.data.descriptionValue,
        defaultValue:     this.data.defaultValue,
        placeholderValue: this.data.placeholderValue,
      }
    }).subscribe(result => this.defaultValueSetter(result));
  }
}
