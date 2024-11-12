import {Component, inject} from '@angular/core';
import {ModalServiceService} from "../../../services/modal/modal-service.service";
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {TextareaComponentData} from "./interfaces/textarea-component-data";
import {TextareaEditComponent} from "./textarea-edit/textarea-edit.component";

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
})
export class TextareaComponent extends AbstractInput<TextareaComponentData, string> {
  private readonly modalService: ModalServiceService<TextareaEditComponent, TextareaComponentData> = inject(ModalServiceService);

  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Area Component Settings',
      modalContent: TextareaEditComponent,
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
