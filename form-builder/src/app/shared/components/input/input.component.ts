import {AbstractFieldLikeInputs} from '@abstract-classes/abstract-fieldlike-inputs';
import {Component} from '@angular/core';
import {InputEditComponent} from '@components/input/input-edit/input-edit.component';
import {InputComponentData} from '@components/input/interfaces/input-component-data';
import {ErrorType} from '@helpers/error-helper';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-text-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css'],
    standalone: false
})
export class InputComponent extends AbstractFieldLikeInputs<string, InputComponentData, InputEditComponent> {
  title: string;

  constructor(private readonly translate: TranslateService) {
    super();
    this.title = this.translate.instant('components.input.MODEL_TITLE_TEXT_INPUT');
  }

  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.title,
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
