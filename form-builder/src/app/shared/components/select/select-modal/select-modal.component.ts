import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, TemplateRef, Type} from '@angular/core';

import {NZ_MODAL_DATA, NzModalService} from 'ng-zorro-antd/modal';
import {NzSafeAny} from "ng-zorro-antd/core/types";

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.css']
})
export class SelectModalComponent {
  readonly nzModalData = inject(NZ_MODAL_DATA);

  selectOptions!: string[];
  defaultSelectValue!: string | string[];
  placeholderValue!: string;
  isMultiple!: boolean;

  newOption: string = '';

  ngOnInit(): void {
    this.selectOptions = this.nzModalData.selectOptions;
    this.defaultSelectValue = this.nzModalData.defaultSelectValue;
    this.placeholderValue = this.nzModalData.placeholderValue;
    this.isMultiple = this.nzModalData.isMultiple;
  }

  // Add a new option
  addOption() {
    if (this.newOption && this.newOption.trim().length !== 0 && !this.selectOptions.includes(this.newOption)) {
      this.selectOptions = this.selectOptions.concat([this.newOption]);
      this.newOption = '';
    }
  }

  // Remove an existing option
  removeOption(option: string) {
    this.selectOptions = this.selectOptions.filter(opt => opt !== option);
    if (Array.isArray(this.defaultSelectValue)) {
      this.defaultSelectValue = this.defaultSelectValue.filter(opt => opt !== option);
    } else {
      this.defaultSelectValue = '';
    }
  }
}
