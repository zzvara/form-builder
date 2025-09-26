import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { Component } from '@angular/core';
import { TextareaComponentData } from '@components/textarea/interfaces/textarea-component-data';
import { TextareaEditComponent } from '@components/textarea/textarea-edit/textarea-edit.component';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: [],
  standalone: false,
})
export class TextareaComponent extends AbstractFieldLikeInputs<string, TextareaComponentData, TextareaEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.TEXT_AREA.MODEL_TITLE_TEXTAREA'),
        modalContent: TextareaEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
