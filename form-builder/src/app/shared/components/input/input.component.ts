import {Component, inject} from '@angular/core';
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {InputEditComponent} from "./input-edit/input-edit.component";
import {InputComponentData} from "./interfaces/input-component-data";

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent extends AbstractInput<InputComponentData, string> {
  private readonly modalService: ModalServiceService<InputEditComponent, InputComponentData> = inject(ModalServiceService);

  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: InputEditComponent,
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
