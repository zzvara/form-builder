import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { Component } from '@angular/core';
import { InputEditComponent } from '@components/input/input-edit/input-edit.component';
import { InputComponentData } from '@components/input/interfaces/input-component-data';
import { ErrorType } from '@helpers/error-helper';

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: [],
  standalone: false,
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
        errorMessage: this.data.minLengthMessage!.replace('{*}', String(this.data.minLengthNumber!)),
      },
    ]);
  }
}
