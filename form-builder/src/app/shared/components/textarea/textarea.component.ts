import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {TextareaComponentData} from "./interfaces/textarea-component-data";
import {TextareaEditComponent} from "./textarea-edit/textarea-edit.component";

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
})
export class TextareaComponent extends AbstractFieldLikeInputs<string, TextareaComponentData, TextareaEditComponent> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Area Component Settings',
      modalContent: TextareaEditComponent,
      modalData: this.data
    }).subscribe(this.defaultOnEditSubscribeEvent);
  }
}
