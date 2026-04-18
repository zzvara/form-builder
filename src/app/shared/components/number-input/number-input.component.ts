import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  imports: [CommonModule, FormsModule, NzFormItemComponent, NzFormControlComponent, NzInputNumberComponent, NzTooltipModule, NzIconModule],
})
export class NumberInputComponent extends AbstractFieldLikeInputs<number, NumberInputComponentData, NumberInputEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.NUMBER_INPUT.MODEL_TITLE_NUMBER_INPUT'),
        modalContent: NumberInputEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }

  get minNumber() {
    return this.data.min && this.data.minNumber ? this.data.minNumber : -Infinity;
  }
  get maxNumber() {
    return this.data.max && this.data.maxNumber ? this.data.maxNumber : Infinity;
  }

  get inputFormatter(): (value: number) => string {
    if (this.data.format && this.data.formatter) {
      return (value) => this.data.formatter!.replace('{{..}}', String(value));
    }
    return (value) => String(value);
  }

  get inputParser(): (value: string) => number {
    if (this.data.format && this.data.formatter) {
      return (value) => {
        const specIndex = this.data.formatter!.indexOf('{{..}}');
        if (specIndex > -1) {
          const [before, after] = [
            this.data.formatter!.substring(0, specIndex),
            this.data.formatter!.substring(specIndex + 3, this.data.formatter!.length),
          ];
          return Number(value.replace(before, '').replace(after, ''));
        }
        return Number(value);
      };
    }
    return (value) => Number(value);
  }
}
