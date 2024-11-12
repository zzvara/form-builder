import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AbstractEditForm} from "../../../abstract-classes/abstract-edit-form";
import {NumberInputComponentData} from "../interfaces/number-input-component-data";

@Component({
  selector: 'app-number-input-edit',
  templateUrl: './number-input-edit.component.html',
  styleUrls: ['./number-input-edit.component.css']
})
export class NumberInputEditComponent extends AbstractEditForm<NumberInputComponentData> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.formData = this.formBuilder.group({
      questionValue:    new FormControl(null, Validators.required),
      descriptionValue: new FormControl(null, Validators.required),
      placeholderValue: new FormControl(),
      defaultValue:     new FormControl()
    });
    this.initializeFormValues();
  }
}
