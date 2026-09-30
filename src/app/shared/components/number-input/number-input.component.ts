import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberInputComponentData } from '@components/number-input/interfaces/number-input-component-data';
import { NumberInputEditComponent } from '@components/number-input/number-input-edit/number-input-edit.component';
import { NzFormControlComponent, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputNumberComponent,
    NzTooltipModule,
    NzIconModule,
  ],
})
export class NumberInputComponent extends AbstractFieldLikeInputs<
  number,
  NumberInputComponentData,
  NumberInputEditComponent
> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.NUMBER_INPUT.MODEL_TITLE_NUMBER_INPUT'),
        modalContent: NumberInputEditComponent,
        modalData: this.state(),
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }

  get minNumber() {
    const data = this.state();
    return data.min && data.minNumber ? data.minNumber : -Infinity;
  }
  get maxNumber() {
    const data = this.state();
    return data.max && data.maxNumber ? data.maxNumber : Infinity;
  }

  get inputFormatter(): (value: number) => string {
    const data = this.state();
    if (data.format && data.formatter) {
      return (value) => data.formatter!.replace('{{..}}', String(value));
    }
    return (value) => String(value);
  }

  get inputParser(): (value: string) => number {
    const data = this.state();
    if (data.format && data.formatter) {
      return (value) => {
        const specIndex = data.formatter!.indexOf('{{..}}');
        if (specIndex > -1) {
          const [before, after] = [
            data.formatter!.substring(0, specIndex),
            data.formatter!.substring(specIndex + 3, data.formatter!.length),
          ];
          return Number(value.replace(before, '').replace(after, ''));
        }
        return Number(value);
      };
    }
    return (value) => Number(value);
  }
}
