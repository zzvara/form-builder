import {Component} from '@angular/core';
import {AbstractFieldLikeInputs} from "../../abstract-classes/abstract-fieldlike-inputs";
import {NumberInputComponentData} from "./interfaces/number-input-component-data";
import {NumberInputEditComponent} from "./number-input-edit/number-input-edit.component";
import {identity} from "rxjs";

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent extends AbstractFieldLikeInputs<NumberInputComponentData, NumberInputEditComponent, number> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Text Field Component Settings',
      modalContent: NumberInputEditComponent,
      modalData: this.data
    }).subscribe(result => {
      if (result) {
        this.onEdit(this.data);
      }
    });
  }

  get minNumber() {
    return this.data.min && this.data.minNumber ? this.data.minNumber : -Infinity;
  }
  get maxNumber() {
    return this.data.max && this.data.maxNumber ? this.data.maxNumber : Infinity;
  }

  get inputFormatter(): (value: number) => string {
    if (this.data.format && this.data.formatter) {
      return value => this.data.formatter!.replace("{*}", String(value));
    }
    return value => String(value);
  }
  get inputParser(): (value: string) => string {
    if (this.data.format && this.data.formatter) {
      return value => {
        const specIndex = this.data.formatter!.indexOf("{*}");
        if (specIndex > -1) {
          const [before, after] = [this.data.formatter!.substring(0, specIndex), this.data.formatter!.substring(specIndex + 3, this.data.formatter!.length)];
          return value.replace(before, "").replace(after, "");
        }
        return value;
      }
    }
    return identity;
  }
}
