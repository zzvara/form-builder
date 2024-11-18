import {Directive} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AbstractControl, FormControl, ValidatorFn, Validators} from "@angular/forms";
import {FieldLikeInputData} from "../interfaces/field-like-input-data";
import {UpdateOnStrategy} from "../interfaces/update-on-strategy";
import {CustomValidators} from "../validators/custom-validators";
import {AbstractEditForm} from "./abstract-edit-form";

@Directive()
export abstract class AbstractFieldLikeEditForm<D extends FieldLikeInputData<T>, T> extends AbstractEditForm<D, T> {
  protected readonly Infinity = Infinity;

  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      required:        new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE
      }),
      requiredMessage: new FormControl(null,
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>("required"))),
      showTooltip:     new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE
      }),
      tooltipText:     new FormControl(null,
        CustomValidators.validateRequiredIf(() => this.getStrictControlValue<boolean>("showTooltip"))),
    });
    this.connectValidations({
      required: [{name: "requiredMessage"}, {name: "defaultValue"}],
      showTooltip: [{name: "tooltipText"}]
    });
    this.setupDefaultValueCheckBox();
  }

  override onReset() {
    super.onReset();
    this.getControl<boolean>("setDefaultValue")?.setValue(true);
  }

  override saveData() {
    super.saveData();
    this.initialValues.required = this.rawFormData.required;
    if (this.rawFormData.required) {
      this.initialValues.requiredMessage = this.rawFormData.requiredMessage;
    }
    this.initialValues.showTooltip = this.rawFormData.showTooltip;
    if (this.rawFormData.showTooltip) {
      this.initialValues.tooltipText = this.rawFormData.tooltipText;
    }
  }

//----------------------------------------------------------------------------------------------------------------------

  setupDefaultValueCheckBox() {
    //Add custom form control
    this.addAnyControls({setDefaultValue: new FormControl<boolean>(true, {
        updateOn: UpdateOnStrategy.CHANGE
      })
    });
    this.getControl<boolean>("setDefaultValue")?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(checked => {
        if (checked) {
          this.getStrictControl<string>("defaultValue")?.setValidators(this.defaultValueValidators);
        } else {
          this.getStrictControl<string>("defaultValue")?.clearValidators();
        }
      });
    this.connectAnyValidations({
      setDefaultValue: [{name: "defaultValue"}],
    });
  }

  override get defaultValueValidators(){
    return CustomValidators.executeValidationsConditionally(this.getValidatorsForDefaultValue());
  };

  getValidatorsForDefaultValue(): {condition: () => boolean, validation: ValidatorFn}[] {
    return [{
        condition: () => this.getStrictControlValue<boolean>("required"),
        validation: Validators.required
      }
    ];
  }

//----------------------------------------------------------------------------------------------------------------------

  getErrorMessages(control: AbstractControl<string>): string[] {
    return this.errorList()
      .filter(error => control.hasError(error.validatorName))
      .map(error => error.validationMessage);
  }

  errorList(): {validatorName: string, validationMessage: string}[]  {
    return [{
      validatorName: "required",
      validationMessage: this.getStrictControlValue<string>("requiredMessage")
    }]
  }
}