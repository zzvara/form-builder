import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaComponentData } from '@components/textarea/interfaces/textarea-component-data';
import { TextareaEditComponent } from '@components/textarea/textarea-edit/textarea-edit.component';
import { NzFormControlComponent, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzTooltipModule,
    NzInputModule
  ],
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
