import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import type { InputData } from '@interfaces/input-data';
import { TranslateService } from '@ngx-translate/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { AbstractEditForm } from './abstract-edit-form';
import type { CodeEditorModalComponent } from '@components/code-editor/code-editor-modal/code-editor-modal.component';
import { inputFixture } from '@app/testing/fixtures';

class EditFormHarness extends AbstractEditForm<string, InputData<string>> {
  replaceDefault(value: string) {
    this.setControls({ defaultValue: new FormControl(value) });
  }

  removeDefault() {
    this.removeControls(['defaultValue']);
  }

  normalize(value: string) {
    return this.trimString(value);
  }

  initialize() {
    this.ngOnInit();
    this.initializeFormValues();
  }

  addDraft(value: boolean) {
    this.addAnyControls({ draft: new FormControl(value) });
  }
}

describe('AbstractEditForm', () => {
  let form: EditFormHarness;
  let data: InputData<string>;

  beforeEach(() => {
    data = {
      questionValue: 'Original question',
      descriptionValue: 'Description',
      defaultValue: 'Answer',
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: NZ_MODAL_DATA, useValue: data },
        { provide: TranslateService, useValue: {} },
      ],
    });
    form = TestBed.runInInjectionContext(() => new EditFormHarness());
    form.initialize();
  });

  it('initializes values and saves only dirty forms', () => {
    expect(form.rawFormData.defaultValue).toBe('Answer');
    expect(form.isPristine).toBeTrue();
    expect(form.onSave()).toBeFalse();
    const question = form.getStrictControl<string>('questionValue')!;
    question.setValue('Changed question');
    question.markAsDirty();
    expect(form.onSave()).toBeTrue();
    expect(data.questionValue).toBe('Changed question');
  });

  it('supports replacing and removing controls in derived forms', () => {
    form.replaceDefault('Replacement');
    expect(form.getControlValue('defaultValue')).toBe('Replacement');
    form.removeDefault();
    expect(form.getControl('defaultValue')).toBeNull();
    expect(form.normalize(' text ')).toBe('text');
  });

  it('requires valid enabled JavaScript and commits editor settings when saving', () => {
    const input = inputFixture();
    const settings = {
      enabled: true,
      data: { code: 'return true;', isValid: false, variables: [] },
    };
    form.codeEditorModalElement = jasmine.createSpyObj<CodeEditorModalComponent>('editor', [], {
      selectedElement: input,
      selectedElementCodeMirror: settings,
    });
    expect(form.isInvalid).toBeTrue();
    settings.data.isValid = true;
    expect(form.isInvalid).toBeFalse();
    form.saveData();
    expect(input.codeEditor).toBe(settings);
  });

  it('restores initial values and pristine state when reset', () => {
    const question = form.getStrictControl<string>('questionValue')!;
    question.setValue('Changed');
    question.markAsDirty();
    form.onReset();
    expect(form.getStrictControlValue('questionValue')).toBe('Original question');
    expect(form.isDirty).toBeFalse();
  });

  it('allows drafts while reporting normal required-field errors', () => {
    const question = form.getStrictControl<string>('questionValue')!;
    question.setValue('');
    expect(form.isInvalid).toBeTrue();
    expect(form.hasErrors(question, 'required')).toBeTrue();
    expect(form.hasErrorsName('questionValue', 'required')).toBeTrue();
    expect(form.getErrorName('questionValue', 'required')).toBeTrue();
    expect(form.getError(question, 'required')).toBeTrue();
    expect(form.hasErrorsName('missing', 'required')).toBeFalse();
    expect(form.getErrorName('missing', 'required')).toBeNull();
    form.addDraft(true);
    expect(form.isValid).toBeTrue();
    expect(form.isInvalid).toBeFalse();
  });

  it('updates connected values and revalidates dependent controls', () => {
    form.setControlValuesBasedOnChanges({
      questionValue: [
        { name: 'descriptionValue', additionalData: (caller) => `About ${caller.value}` },
      ],
    });
    form.getControl('questionValue')!.setValue('Age');
    expect(form.getControlValue('descriptionValue')).toBe('About Age');
    form.getControl('defaultValue')!.addValidators(Validators.required);
    form.getControl('defaultValue')!.setValue('');
    form.connectValidations({ questionValue: [{ name: 'defaultValue' }] });
    form.getControl('questionValue')!.setValue('Name');
    expect(form.getControl('defaultValue')!.dirty).toBeTrue();
    expect(form.getControl('defaultValue')!.hasError('required')).toBeTrue();
  });

  it('unsubscribes from connected controls when the injection context is destroyed', () => {
    const callback = jasmine.createSpy('callback');
    form.executeBasedOnChanges({ questionValue: [{ name: 'descriptionValue' }] }, callback);
    const question = form.getControl('questionValue')!;
    TestBed.resetTestingModule();
    question.setValue('After destruction');
    expect(callback).not.toHaveBeenCalled();
  });
});
