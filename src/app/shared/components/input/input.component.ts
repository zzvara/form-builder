import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputEditComponent } from '@components/input/input-edit/input-edit.component';
import { InputComponentData } from '@components/input/interfaces/input-component-data';
import { ErrorType } from '@helpers/error-helper';
import { NzFormControlComponent, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzTooltipModule,
    NzInputModule,
    NzIconModule,
  ],
})
export class InputComponent extends AbstractFieldLikeInputs<string, InputComponentData, InputEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.INPUT.MODEL_TITLE_TEXT_INPUT'),
        modalContent: InputEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }

  override errorList(): ErrorType[] {
    return super.errorList().concat([
      {
        errorName: 'minlength',
        errorMessage: this.data.minLengthMessage!.replace('{{..}}', String(this.data.minLengthNumber!)),
      },
    ]);
  }
}
