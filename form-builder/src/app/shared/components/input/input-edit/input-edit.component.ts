import {Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AbstractEditForm} from "../../../abstract-classes/abstract-edit-form";
import {InputComponentData} from "../interfaces/input-component-data";

@Component({
  selector: 'app-input-edit',
  templateUrl: './input-edit.component.html',
  styleUrls: ['./input-edit.component.css']
})
export class InputEditComponent extends AbstractEditForm<InputComponentData> {
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
