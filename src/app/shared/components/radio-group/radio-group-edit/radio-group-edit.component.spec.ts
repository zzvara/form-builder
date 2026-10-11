import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { RadioGroupEditComponent } from '@components/radio-group/radio-group-edit/radio-group-edit.component';

describe('RadioGroupEditComponent', () => {
  let component: RadioGroupEditComponent;
  let fixture: ComponentFixture<RadioGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: NZ_MODAL_DATA, useValue: { options: [] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads saved option descriptions and identifiers into a new editor', () => {
    TestBed.inject(NZ_MODAL_DATA).options = [
      { option_id: 8, option_description: 'Saved' },
      { option_id: 9, option_description: 'Other' },
    ];
    TestBed.inject(NZ_MODAL_DATA).defaultValue = 8;
    const loaded = TestBed.createComponent(RadioGroupEditComponent);
    loaded.detectChanges();
    const element: HTMLElement = loaded.nativeElement;
    expect(
      Array.from(element.querySelectorAll('.option-label'), (label) => label.textContent?.trim()),
    ).toEqual(['Saved', 'Other']);
    const radios = element.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios[0].checked).toBeTrue();
    radios[1].click();
    loaded.detectChanges();
    expect(loaded.componentInstance.getControlValue('defaultValue')).toBe(9);
    expect(radios[0].checked).toBeFalse();
    expect(radios[1].checked).toBeTrue();
    loaded.componentInstance.saveData();
    expect(TestBed.inject(NZ_MODAL_DATA).defaultValue).toBe(9);
  });

  it('reorders existing options without changing their values', () => {
    for (const label of ['First', 'Second']) {
      component.newOptionValue = label;
      component.addOption();
    }
    component.drop({ previousIndex: 0, currentIndex: 1 } as Parameters<typeof component.drop>[0]);
    expect(component.optionIds).toEqual([2, 1]);
  });

  it('saves options and required validation and restores the saved options on reset', () => {
    for (const label of ['First', 'Second']) {
      component.newOptionValue = label;
      component.addOption();
    }
    component.getControl('required')!.setValue(true);
    component.getControl('requiredMessage')!.setValue('Choose one');
    component.getControl('isButton')!.setValue(true);
    component.getControl('defaultValue')!.setValue(2);
    component.saveData();
    expect(TestBed.inject(NZ_MODAL_DATA)).toEqual(
      jasmine.objectContaining({
        required: true,
        requiredMessage: 'Choose one',
        isButton: true,
        defaultValue: 2,
        options: component.optionObjects,
      }),
    );
    component.removeOption(0);
    component.onReset();
    expect(component.optionDescriptions).toEqual(['First', 'Second']);
    expect(component.getControlValue('defaultValue')).toBe(2);
    component.getControl('required')!.setValue(false);
    component.getControl('setDefaultValue')!.setValue(false);
    component.saveData();
    expect(TestBed.inject(NZ_MODAL_DATA).defaultValue).toBeUndefined();
  });

  it('reports missing choices and required-selection errors and leaves blank edits unchanged', () => {
    expect(component.getMinOptions()).toBe(2);
    component.newOptionValue = 'Original';
    component.addOption();
    component.startEdit(0, 'Original');
    component.editControl.setValue('  ');
    component.saveEdit(0);
    expect(component.optionDescriptions).toEqual(['Original']);
    component.getControl('required')!.setValue(true);
    component.getControl('requiredMessage')!.setValue('Choose one');
    component.getControl<string>('defaultValue')!.setValue('');
    expect(component.getErrorMessages(component.getControl<string>('defaultValue')!)).toEqual([
      'Choose one',
    ]);
  });

  it('assigns stable unique identifiers when options are added and removed', () => {
    for (const value of ['First', 'Second', 'Third']) {
      component.newOptionValue = value;
      component.addOption();
    }
    component.removeOption(1);
    component.newOptionValue = 'Fourth';
    component.addOption();
    expect(component.optionIds).toEqual([1, 3, 4]);
    expect(component.optionDescriptions).toEqual(['First', 'Third', 'Fourth']);
  });

  it('renames an option without changing its identifier or selection', () => {
    component.newOptionValue = 'Original';
    component.addOption();
    component.getStrictControl('defaultValue')!.setValue(1);
    component.startEdit(0, 'Original');
    component.editControl.setValue(' Renamed ');
    component.saveEdit(0);
    expect(component.optionObjects).toEqual([{ option_id: 1, option_description: 'Renamed' }]);
    expect(component.getStrictControlValue<number>('defaultValue')).toBe(1);
    expect(component.editingIndex()).toBeNull();
  });

  it('rejects duplicate labels and leaves the original option intact on cancel', () => {
    for (const value of ['First', 'Second']) {
      component.newOptionValue = value;
      component.addOption();
    }
    component.startEdit(0, 'First');
    component.editControl.setValue('Second');
    component.saveEdit(0);
    expect(component.editError()).toBeTruthy();
    component.cancelEdit();
    expect(component.optionDescriptions).toEqual(['First', 'Second']);
    expect(component.editError()).toBeNull();
  });
});
