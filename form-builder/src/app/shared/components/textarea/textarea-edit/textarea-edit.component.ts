import {Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AbstractEditForm} from "../../../abstract-classes/abstract-edit-form";
import {TextareaComponentData} from "../interfaces/textarea-component-data";

@Component({
  selector: 'app-textarea-edit',
  templateUrl: './textarea-edit.component.html',
  styleUrls: ['./textarea-edit.component.css']
})
export class TextareaEditComponent extends AbstractEditForm<TextareaComponentData> {
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
