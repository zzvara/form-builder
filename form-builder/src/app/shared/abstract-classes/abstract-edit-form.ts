import {DestroyRef, Directive, inject, OnInit} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {NZ_MODAL_DATA} from "ng-zorro-antd/modal";
import {ControlConnection, ControlConnectionData} from "../interfaces/control-connection";
import {InputData, InputDataKeys} from "../interfaces/input-data";
import {UpdateOnStrategy} from "../interfaces/update-on-strategy";

@Directive()
export abstract class AbstractEditForm<D extends InputData<T>, T> implements OnInit {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly nzModalData: D = inject(NZ_MODAL_DATA);
  protected readonly String = String.prototype;

  protected defaultValueControl: FormControl = new FormControl(this.getDefaultValueValue, {
    updateOn: this.defaultValueUpdateOn,
    validators: this.defaultValueValidators
  });

  protected readonly formData: FormGroup = this.formBuilder.group<{[key in InputDataKeys<D>]?: FormControl<any>}>({}, {
    updateOn: this.formUpdateOn,
    validators: this.formValidators
  });

  protected initialValues!: D;

  ngOnInit() {
    this.initialValues = this.nzModalData;
    this.addControls({
      questionValue: new FormControl(null, Validators.required),
      descriptionValue: new FormControl(),
      placeholderValue: new FormControl(),
      defaultValue: this.defaultValueControl,
    });
  }

  protected initializeFormValues() {
    if (this.initialValues) {
      this.formData.patchValue(this.initialValues);
    }
  };

  onReset() {
    this.formData.reset(this.initialValues);
  }

  onSave(): boolean {
    if (this.isDirty) {
      this.saveData();
      return true;
    }
    return false;
  }

  saveData() {
    this.initialValues.questionValue    = this.rawFormData.questionValue;
    this.initialValues.descriptionValue = this.rawFormData.descriptionValue;
    this.initialValues.defaultValue     = this.rawFormData.defaultValue;
    this.initialValues.placeholderValue = this.rawFormData.placeholderValue;
  }

  get rawFormData(): D {
    return this.formData.getRawValue();
  };

  protected get formValidators(): ValidatorFn | ValidatorFn[] | null | undefined {
    return null;
  };
  protected get formUpdateOn(): UpdateOnStrategy {
    return UpdateOnStrategy.BLUR;
  };

  protected get defaultValueValidators(): ValidatorFn | ValidatorFn[] | null | undefined {
    return null;
  };
  protected get defaultValueUpdateOn(): UpdateOnStrategy {
    return UpdateOnStrategy.BLUR;
  };
  protected get getDefaultValueValue(): T | null {
    return null;
  };

//---------FORM CONTROLS------------------------------------------------------------------------------------------------

  protected addControls(controls: {[key in InputDataKeys<D>]?: AbstractControl}) {
    this.addAnyControls(controls as {[key: string]: AbstractControl});
  }
  protected addAnyControls(controls: {[key: string]: AbstractControl}) {
    Object.entries(controls).forEach(([key, value]) => {
      this.formData.addControl(key, value);
    })
  }

  protected setControls(controls: {[key in InputDataKeys<D>]?: AbstractControl}) {
    this.setAnyControls(controls as {[key: string]: AbstractControl});
  }
  protected setAnyControls(controls: {[key: string]: AbstractControl}) {
    Object.entries(controls).forEach(([key, value]) => {
      this.formData.setControl(key, value);
    })
  }

  protected removeControls(controls: InputDataKeys<D>[]) {
    this.removeAnyControls(controls as string[]);
  }
  protected removeAnyControls(controls: string[]) {
    controls.forEach(control => {
      this.formData.removeControl(control);
    })
  }

  getStrictControlValue<VType>(control: InputDataKeys<D>): VType {
    return this.getControlValue(control as string);
  }
  getControlValue<VType>(control: string): VType {
    return this.formData?.get(control)?.getRawValue();
  }

  getStrictControl<VType>(control: InputDataKeys<D>): AbstractControl<VType> | null {
    return this.getControl(control as string);
  }
  getControl<VType>(control: string): AbstractControl<VType> | null {
    return this.formData?.get(control);
  }

//---------FORM STATE---------------------------------------------------------------------------------------------------

  get isValid(): boolean {
    return this.formData.valid;
  };
  get isInvalid(): boolean {
    return this.formData.invalid;
  };


  get isPristine(): boolean {
    return this.formData.pristine;
  };
  get isDirty() : boolean {
    return this.formData.dirty;
  }

//---------CONTROL ERRORS-----------------------------------------------------------------------------------------------

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

//---------CONTROL CHANGE METHODS---------------------------------------------------------------------------------------

  setControlValuesBasedOnChanges(controls: {[key in InputDataKeys<D>]?: {name: InputDataKeys<D>, additionalData?: () => any}[]}) {
    this.setAnyControlValuesBasedOnChanges(controls as ControlConnection);
  }
  setAnyControlValuesBasedOnChanges(controls: ControlConnection) {
    this.executeBasedOnChanges(controls, (connData) => {
      const control = this.getControl<any>(connData.name);
      control?.setValue(connData.additionalData?.());
    });
  }

  /**
   * A különböző, kapcsolatbanlévő FormControl-ok változásait összekötő metódus
   * FONTOS: rekurzív hívás/frissítés esetén pontosan az EGYIK hívásnál jelölni kell, hogy az rekurzív volt (alreadyCalled = false, vagy üres maradjon!)
   *
   * @param controls
   */
  connectValidations(controls: {[key in InputDataKeys<D>]?: {name: InputDataKeys<D>, recursiveCall?: boolean}[]}) {
    this.connectAnyValidations(controls as ControlConnection);
  }
  connectAnyValidations(controls: ControlConnection) {
    this.executeBasedOnChanges(controls, (connData) => {
      const control = this.getControl<any>(connData.name);
      // A sorrend KEGYETLEN fontos... órákat **** el vele :(
      control?.markAsDirty();
      if (connData.recursiveCall) {
        if (connData.alreadyCalled) {
          connData.alreadyCalled = false;
          control?.updateValueAndValidity({onlySelf: true, emitEvent: false});
        } else {
          connData.alreadyCalled = true;
          control?.updateValueAndValidity({onlySelf: true});
        }
      } else {
        control?.updateValueAndValidity({onlySelf: true});
      }
    });
  }

  executeBasedOnChanges(controls: ControlConnection, execute: (conn: ControlConnectionData) => void) {
    Object.entries(controls).forEach(([key, value]) => {
      this.getControl<any>(key)?.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => value.forEach((connectedControlName) => execute(connectedControlName)));
    })
  }

  /*
  TODO: bárhogy próbáltam, nekem a FormGroup szintű re-validáció nem működik. Így marad a control-ok kézzel összekötögetése

  notifyFormGroupOnValueChanges(controls: InputDataKeys<T>[], formGroup: FormGroup) {
    controls.forEach(control => {
      this.getStrictControl(control)?.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          // formGroup.markAllAsTouched();
          // formGroup.markAsDirty();

          // Ez se jó, így meg végtelen rekurzóba fut, "emitEvent: false"-al se működik, mert akkor a felületen nem regisztrálódik a változás
          Object.values(formGroup.controls).forEach((control: AbstractControl) => {
            control.markAsDirty();
            control.updateValueAndValidity({onlySelf: true, emitEvent: true});
          })
          // formGroup.updateValueAndValidity();
        });
    });
  }
  */
}
