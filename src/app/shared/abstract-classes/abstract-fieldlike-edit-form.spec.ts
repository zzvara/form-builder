import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import type { FieldLikeInputData } from '@interfaces/field-like-input-data';
import { AbstractFieldLikeEditForm } from './abstract-fieldlike-edit-form';

class FieldFormHarness extends AbstractFieldLikeEditForm<string, FieldLikeInputData<string>> {
  initialize() {
    this.ngOnInit();
    this.initializeFormValues();
  }
}

describe('AbstractFieldLikeEditForm', () => {
  let form: FieldFormHarness;
  let data: FieldLikeInputData<string>;

  beforeEach(() => {
    data = {
      questionValue: 'Question',
      required: false,
      showTooltip: false,
      defaultValue: 'initial',
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: NZ_MODAL_DATA, useValue: data },
        { provide: TranslateService, useValue: {} },
      ],
    });
    form = TestBed.runInInjectionContext(() => new FieldFormHarness());
    form.initialize();
  });

  it('requires explanatory text only when the corresponding option is enabled', () => {
    expect(form.getControl('requiredMessage')!.valid).toBeTrue();
    form.getControl('required')!.setValue(true);
    expect(form.getControl('requiredMessage')!.hasError('required')).toBeTrue();
    form.getControl('showTooltip')!.setValue(true);
    expect(form.getControl('tooltipText')!.hasError('required')).toBeTrue();
    form.getControl('tooltipText')!.setValue('Helpful text');
    expect(form.getControl('tooltipText')!.valid).toBeTrue();
  });
  
  it('clears default-value validators and saved defaults when disabled', () => {
    form.getControl('required')!.setValue(true);
    form.getControl('defaultValue')!.setValue('');
    expect(form.getControl('defaultValue')!.hasError('required')).toBeTrue();
    form.getControl('setDefaultValue')!.setValue(false);
    expect(form.getControl('defaultValue')!.valid).toBeTrue();
    form.saveData();
    expect(data.defaultValue).toBeUndefined();
    form.onReset();
    expect(form.getControlValue('setDefaultValue')).toBeTrue();
  });

  it('persists enabled tooltip text and restores required-default validation', () => {
    form.getControl('showTooltip')!.setValue(true);
    form.getControl('tooltipText')!.setValue('Help');
    form.getControl('required')!.setValue(true);
    form.getControl('requiredMessage')!.setValue('Required');
    form.getControl('setDefaultValue')!.setValue(false);
    form.getControl('defaultValue')!.setValue('');
    form.getControl('setDefaultValue')!.setValue(true);
    expect(form.getControl('defaultValue')!.invalid).toBeTrue();
    expect(form.getErrorMessages(form.getControl<string>('defaultValue')!)).toEqual(['Required']);
    form.saveData();
    expect(data.tooltipText).toBe('Help');
    expect(data.requiredMessage).toBe('Required');
  });
});
