import { Component, Input, TemplateRef } from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {SelectModalComponent} from "./select-modal/select-modal.component";

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css']
})
export class SelectComponent {
  descriptionValue: string = 'The input can be used for...';
  inputPlaceholder: string = 'Select input value';
  inputTemplate!: TemplateRef<any>;
  type: string = 'text';
  questionValue: string = "ComboBox input";
  answerValue!: Component;

  actualValue: string | string[] = "";

  answerOptions: string[] = [];
  defaultValue: string | string[] = "";
  placeholderValue: string = "";
  isMultipleChoice: boolean = false;
  @Input() isInSection!: boolean;
  @Input() sectiondId!: string;

  constructor(private modal: NzModalService) {}

  openModal(): void {
    this.modal.create({
      nzTitle: 'Edit Select Component Settings',
      nzContent: SelectModalComponent,
      nzData: {
        selectOptions: [...this.answerOptions],
        defaultSelectValue: this.defaultValue,
        placeholderValue: this.placeholderValue,
        isMultiple: this.isMultipleChoice
      },
      nzOnOk: (instance) => {
        this.answerOptions = instance.selectOptions;
        if (!instance.defaultSelectValue) {
          if (instance.isMultiple) {
            this.defaultValue = [];
            this.actualValue = [];
          } else {
            this.defaultValue = "";
            this.actualValue = "";
          }
        } else {
          this.defaultValue = instance.defaultSelectValue;
          this.actualValue = instance.defaultSelectValue;
        }
        this.placeholderValue = instance.placeholderValue;
        this.isMultipleChoice = instance.isMultiple;
      }
    });
  }
}
