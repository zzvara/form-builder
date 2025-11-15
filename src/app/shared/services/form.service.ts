import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from './validator.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  createComponentNameForm(names: string[], name?: string): FormGroup {
    return this.fb.group({
      name: [
        name ?? '',
        [
          Validators.compose([
            Validators.required,
            ValidatorService.validVariableNameValidator(),
            ValidatorService.uniqueNameValidator(names),
          ]),
        ],
      ],
    });
  }
}
