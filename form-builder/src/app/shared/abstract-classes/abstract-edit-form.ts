import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {Directive, inject, OnInit} from "@angular/core";
import {NZ_MODAL_DATA} from "ng-zorro-antd/modal";

@Directive()
export abstract class AbstractEditForm<T> implements OnInit {
  protected readonly String = String.prototype;
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly nzModalData: T = inject(NZ_MODAL_DATA);

  formData!: FormGroup;
  initialValues!: T;

  ngOnInit() {
    this.initialValues = this.nzModalData;
  }

  initializeFormValues() {
    if (this.initialValues) {
      this.formData.patchValue(this.initialValues);
    }
  };


  isValid(): boolean {
    return this.formData.valid;
  };
  isInvalid(): boolean {
    return this.formData.invalid;
  };


  isPristine(): boolean {
    return this.formData.pristine;
  };
  isDirty() : boolean {
    return this.formData.dirty;
  }

  hasErrors(control: AbstractControl, ...errors: string[]): boolean {
    return errors.reduce((acc, curr) => acc || control.hasError(curr), false);
  }
  hasErrorsName(controlName: string, ...errors: string[]): boolean {
    const control = this.formData.get(controlName);
    if (control) {
      return errors.reduce((acc, curr) => acc || control.hasError(curr), false);
    }
    return false;
  }

  getError<ErrType>(control: AbstractControl, errorName: string): ErrType | null {
    return control.errors?.[errorName];
  }
  getErrorName<ErrType>(controlName: string, errorName: string): ErrType | null {
    const control = this.formData.get(controlName);
    if (control) {
      return control.errors?.[errorName];
    }
    return null;
  }

  onReset() {
    this.formData.reset(this.initialValues);
  }

  getFormData(): T {
    return this.formData.getRawValue();
  };
}
