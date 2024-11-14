import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DestroyRef, Directive, inject, OnInit} from "@angular/core";
import {NZ_MODAL_DATA} from "ng-zorro-antd/modal";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive()
export abstract class AbstractEditForm<T> implements OnInit {
  protected readonly destroyRef = inject(DestroyRef);
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

  getControlValue<VType>(control: string): VType {
    return this.formData?.get(control)?.value;
  }

  getControl<VType>(control: string): AbstractControl<VType> | null {
    return this.formData?.get(control);
  }

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

  /**
   * A különböző, kapcsolatbanlévő FormControl-ok változásait összekötő metódus
   * FONTOS: rekurzív hívás/frissítés esetén pontosan az EGYIK hívásnál jelölni kell, hogy az rekurzív volt (alreadyCalled = false, vagy üres maradjon!)
   *
   * @param controls
   */
  connectValidations(controls: {[key: string]: {name: string, recursiveCall?: boolean, alreadyCalled?: boolean}[]}) {
    Object.entries(controls).forEach(([key, value]) => {
      this.getControl<any>(key)?.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => value
          .forEach((connectedControlName) => {
            const control = this.getControl<any>(connectedControlName.name);
            // A sorrend KEGYETLEN fontos... órákat **** el vele :(
            control?.markAsDirty();
            if (connectedControlName.recursiveCall) {
              if (connectedControlName.alreadyCalled) {
                connectedControlName.alreadyCalled = false;
                control?.updateValueAndValidity({onlySelf: true, emitEvent: false});
              } else {
                connectedControlName.alreadyCalled = true;
                control?.updateValueAndValidity({onlySelf: true});
              }
            } else {
              control?.updateValueAndValidity({onlySelf: true});
            }
          }));
    })
  }
}
