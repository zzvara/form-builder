import { Injectable, inject } from '@angular/core';
import type { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ValidatorService } from './validator.service';
import { UpdateOnStrategy } from '../interfaces/update-on-strategy';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private fb = inject(FormBuilder);

  createComponentNameForm(names: string[], name?: string): FormGroup {
    return this.fb.group(
      {
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
      },
      {
        updateOn: UpdateOnStrategy.CHANGE,
      },
    );
  }
}
