import { Component } from '@angular/core';
import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { TextareaComponentData } from '@components/textarea/interfaces/textarea-component-data';
import { TextareaEditComponent } from '@components/textarea/textarea-edit/textarea-edit.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.css'],
    standalone: false
})
export class TextareaComponent extends AbstractFieldLikeInputs<string, TextareaComponentData, TextareaEditComponent> {
  title: string;

  constructor(private translate: TranslateService) {
    super();
    this.title = this.translate.instant('components.text_area.MODEL_TITLE_TEXTAREA');
  }

  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.title,
        modalContent: TextareaEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
