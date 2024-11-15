import {Directive} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AbstractControl, FormControl, ValidatorFn, Validators} from "@angular/forms";
import {FieldLikeInputData} from "../interfaces/field-like-input-data";
import {UpdateOnStrategy} from "../interfaces/update-on-strategy";
import {CustomValidators} from "../validators/custom-validators";
import {AbstractEditForm} from "./abstract-edit-form";

@Directive()
export abstract class AbstractFieldLikeEditForm<T extends FieldLikeInputData<any>> extends AbstractEditForm<T> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.addControls({
      required:        new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE
      }),
      requiredMessage: new FormControl(null,
        CustomValidators.validateRequiredIf(() => this.getControlValue<boolean>("required"))),
      showTooltip:     new FormControl(false, {
        updateOn: UpdateOnStrategy.CHANGE
      }),
      tooltipText:     new FormControl(null,
        CustomValidators.validateRequiredIf(() => this.getControlValue<boolean>("showTooltip"))),
    });
    this.connectValidations({
      required: [{name: "requiredMessage"}, {name: "defaultValue"}],
      showTooltip: [{name: "tooltipText"}]
    });
    this.setupDefaultValueCheckBox();
  }

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
          this.getStrictControl<string>("defaultValue")?.setValidators(this.defaultValueValidations());
        } else {
          this.getStrictControl<string>("defaultValue")?.clearValidators();
        }
      });
    this.connectAnyValidations({
      setDefaultValue: [{name: "defaultValue"}],
    });
  }

  override defaultValueValidations() {
    return CustomValidators.executeValidationsConditionally(this.getValidatorsForDefaultValue());
  }

  getValidatorsForDefaultValue(): {condition: () => boolean, validation: ValidatorFn}[] {
    return [{
        condition: () => this.getControlValue<boolean>("required"),
        validation: Validators.required
      }
    ];
  }

  getErrorMessages(control: AbstractControl<string>): string[] {
    return this.errorList()
      .filter(error => control.hasError(error.validatorName))
      .map(error => error.validationMessage);
  }

  errorList(): {validatorName: string, validationMessage: string}[]  {
    return [{
      validatorName: "required",
      validationMessage: this.getControlValue<string>("requiredMessage")
    }]
  }
}
