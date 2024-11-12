import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AbstractEditForm} from "../../../abstract-classes/abstract-edit-form";
import {PictureInputComponentData} from "../interfaces/picture-input-component-data";

@Component({
  selector: 'app-picture-input-edit',
  templateUrl: './picture-input-edit.component.html',
  styleUrls: ['./picture-input-edit.component.css']
})
export class PictureInputEditComponent extends AbstractEditForm<PictureInputComponentData>{
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
